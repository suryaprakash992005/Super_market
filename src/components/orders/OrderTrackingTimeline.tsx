import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  Store,
  Check,
  AlertCircle,
  Navigation,
  Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { Order, OrderStatus } from '../../types';
import { DeliveryVehicle } from './DeliveryVehicle';

interface OrderTrackingTimelineProps {
  order: Order;
  className?: string;
}

const STATUS_KEYS: OrderStatus[] = [
  'placed',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
];

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  order,
  className = '',
}) => {
  const isPickup = order.fulfillmentMethod === 'store_pickup';
  const targetStepIndex = Math.max(0, STATUS_KEYS.indexOf(order.status));
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  const STORAGE_KEY = `bharathi_customer_seen_${order.id}`;

  // Calculate starting position:
  // When customer opens or tracks the order, start from previous place
  // so the scooter physically drives left-to-right to the updated place
  const getInitialStartProgress = useCallback(() => {
    try {
      const savedStage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (savedStage) {
        const savedIndex = STATUS_KEYS.indexOf(savedStage as OrderStatus);
        if (savedIndex >= 0 && savedIndex < targetStepIndex) {
          return savedIndex;
        }
      }
    } catch {
      // fallback
    }
    return targetStepIndex > 0 ? targetStepIndex - 1 : 0;
  }, [STORAGE_KEY, targetStepIndex]);

  const [initialStartProgress] = useState<number>(getInitialStartProgress);
  const [displayStepIndex, setDisplayStepIndex] = useState<number>(initialStartProgress);
  const [hasNewOwnerUpdate, setHasNewOwnerUpdate] = useState<boolean>(false);

  // Master tracking stages configuration
  const stages = [
    {
      key: 'placed' as OrderStatus,
      label: 'Order Placed',
      desc: 'Received by Bharathi Store system',
      icon: Clock,
      step: 1,
    },
    {
      key: 'confirmed' as OrderStatus,
      label: 'Store Confirmed',
      desc: 'Verified by inventory manager',
      icon: CheckCircle2,
      step: 2,
    },
    {
      key: 'packed' as OrderStatus,
      label: 'Items Packed',
      desc: 'Sealed in temperature-safe bags',
      icon: Package,
      step: 3,
    },
    {
      key: 'out_for_delivery' as OrderStatus,
      label: isPickup ? 'Ready for Pickup' : 'Out for Delivery',
      desc: isPickup ? 'Available at Central Counter' : 'En route with store driver',
      icon: isPickup ? Store : Truck,
      step: 4,
    },
    {
      key: 'delivered' as OrderStatus,
      label: isPickup ? 'Picked Up' : 'Delivered',
      desc: isPickup ? 'Handed over at store counter' : 'Handed over successfully',
      icon: CheckCircle2,
      step: 5,
    },
  ];

  // Refs for tracking DOM elements & GSAP animation state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vehicleWrapperRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<SVGLineElement | null>(null);
  const activeLineGlowRef = useRef<SVGLineElement | null>(null);
  const energyCometRef = useRef<SVGCircleElement | null>(null);
  const energyTrailRef = useRef<SVGLineElement | null>(null);

  // Animation values stored in refs for direct GPU / GSAP manipulation
  const currentProgressRef = useRef<number>(initialStartProgress);
  const prevStatusRef = useRef<OrderStatus>(order.status);
  const isInitialMount = useRef<boolean>(true);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const cometTweenRef = useRef<gsap.core.Tween | null>(null);

  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [vehicleX, setVehicleX] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<{ startX: number; endX: number; y: number }>({
    startX: 0,
    endX: 0,
    y: 20,
  });

  // Calculate center X coordinates of each stage relative to container
  const getStageCenters = useCallback(() => {
    if (!containerRef.current) return [];
    const containerRect = containerRef.current.getBoundingClientRect();

    return stages.map((_, idx) => {
      const el = stageRefs.current[idx];
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.left - containerRect.left + rect.width / 2;
    });
  }, [stages]);

  const getStageCenterY = useCallback(() => {
    if (!containerRef.current || !stageRefs.current[0]) return 20;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = stageRefs.current[0].getBoundingClientRect();
    return rect.top - containerRect.top + rect.height / 2;
  }, []);

  // Convert numeric progress (0.0 to 4.0) to pixel X
  const interpolateX = useCallback((progress: number, centers: number[]) => {
    if (centers.length === 0) return 0;
    const clamped = Math.max(0, Math.min(stages.length - 1, progress));
    const floor = Math.floor(clamped);
    const ceil = Math.min(stages.length - 1, floor + 1);
    const fraction = clamped - floor;

    const x1 = centers[floor] ?? 0;
    const x2 = centers[ceil] ?? x1;
    return x1 + (x2 - x1) * fraction;
  }, [stages.length]);

  // Direct DOM update for high-performance 60/120fps rendering during GSAP tick
  const applyVehicleAndLinePosition = useCallback((x: number, startX: number) => {
    if (vehicleWrapperRef.current) {
      // Precise center alignment with hardware-accelerated GPU translate3d
      vehicleWrapperRef.current.style.transform = `translate3d(${x}px, 0, 0) translateX(-50%)`;
    }
    if (activeLineRef.current) {
      activeLineRef.current.setAttribute('x2', `${x}`);
    }
    if (activeLineGlowRef.current) {
      activeLineGlowRef.current.setAttribute('x2', `${x}`);
    }
  }, []);

  // Continuous JavaScript Electric Energy Comet along the active route
  const startEnergyCometLoop = useCallback((startX: number, currentX: number) => {
    if (!energyCometRef.current || currentX <= startX + 5) return;

    if (cometTweenRef.current) {
      cometTweenRef.current.kill();
    }

    const cometProxy = { x: startX };
    cometTweenRef.current = gsap.to(cometProxy, {
      x: currentX,
      duration: 1.8,
      repeat: -1,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (energyCometRef.current) {
          energyCometRef.current.setAttribute('cx', `${cometProxy.x}`);
        }
        if (energyTrailRef.current) {
          const trailLength = Math.min(25, cometProxy.x - startX);
          energyTrailRef.current.setAttribute('x1', `${Math.max(startX, cometProxy.x - trailLength)}`);
          energyTrailRef.current.setAttribute('x2', `${cometProxy.x}`);
        }
      },
    });
  }, []);

  // Measure and position vehicle immediately
  const refreshLayout = useCallback((progress: number) => {
    const centers = getStageCenters();
    if (centers.length < 5 || centers[0] === 0) return;

    const startX = centers[0];
    const endX = centers[centers.length - 1];
    const y = getStageCenterY();

    setRouteCoordinates({ startX, endX, y });

    const x = interpolateX(progress, centers);
    setVehicleX(x);
    applyVehicleAndLinePosition(x, startX);
    startEnergyCometLoop(startX, x);
  }, [getStageCenters, getStageCenterY, interpolateX, applyVehicleAndLinePosition, startEnergyCometLoop]);

  // Handle Resize & Initial Measurement
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshLayout(currentProgressRef.current);
    }, 60);

    const handleResize = () => {
      refreshLayout(currentProgressRef.current);
    };

    window.addEventListener('resize', handleResize);

    let observer: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        handleResize();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (cometTweenRef.current) cometTweenRef.current.kill();
    };
  }, [refreshLayout]);

  // Master JavaScript (GSAP) Kinetic Drive Transition (Left to Right)
  const driveToProgress = useCallback((targetProgress: number, duration: number = 1.8, onFinish?: () => void) => {
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
    }

    const centers = getStageCenters();
    const startX = centers[0] || routeCoordinates.startX;
    const fromVal = currentProgressRef.current;

    setIsMoving(true);

    const progressProxy = { val: fromVal };
    activeTweenRef.current = gsap.to(progressProxy, {
      val: targetProgress,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        currentProgressRef.current = progressProxy.val;
        const currentCenters = getStageCenters();
        const posX = interpolateX(progressProxy.val, currentCenters);
        setVehicleX(posX);
        applyVehicleAndLinePosition(posX, startX);

        // Dynamically update active step index as scooter crosses midway
        setDisplayStepIndex(Math.round(progressProxy.val));
      },
      onComplete: () => {
        setIsMoving(false);
        currentProgressRef.current = targetProgress;
        setDisplayStepIndex(targetProgress);
        refreshLayout(targetProgress);

        // Save last seen status in localStorage
        try {
          localStorage.setItem(STORAGE_KEY, order.status);
        } catch {
          // ignore
        }

        // Premium Arrival Hydraulic Settle & Elastic Pop on Destination Stage Node
        const destIdx = Math.round(targetProgress);
        const destEl = stageRefs.current[destIdx];
        if (destEl) {
          gsap.fromTo(
            destEl,
            { scale: 1.25, rotate: -2 },
            { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(2.5)' }
          );
        }

        if (onFinish) onFinish();
      },
    });
  }, [getStageCenters, routeCoordinates.startX, interpolateX, applyVehicleAndLinePosition, refreshLayout, STORAGE_KEY, order.status]);

  // Customer triggers the drive animation (e.g. clicks "Track Route" button)
  const handleTriggerTrackRide = useCallback(() => {
    if (isMoving) return;
    setHasNewOwnerUpdate(false);

    // Reset to previous stage (or start) then drive left to right into updated stage!
    const fromIndex = targetStepIndex > 0 ? targetStepIndex - 1 : 0;
    currentProgressRef.current = fromIndex;
    setDisplayStepIndex(fromIndex);
    refreshLayout(fromIndex);

    setTimeout(() => {
      driveToProgress(targetStepIndex, 1.8);
    }, 150);
  }, [isMoving, targetStepIndex, refreshLayout, driveToProgress]);

  // Customer Open Effect:
  // When customer opens/visits the order track page:
  // 1. Scooter renders at previous place (left)
  // 2. After 400ms, it physically accelerates and drives LEFT-TO-RIGHT to the updated place!
  useEffect(() => {
    const targetIndex = STATUS_KEYS.indexOf(order.status);
    if (targetIndex === -1) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStatusRef.current = order.status;

      const startPos = getInitialStartProgress();
      currentProgressRef.current = startPos;
      setDisplayStepIndex(startPos);
      refreshLayout(startPos);

      // If there is an updated destination ahead, drive left-to-right to the updated place
      if (targetIndex > startPos) {
        const animTimer = setTimeout(() => {
          driveToProgress(targetIndex, 1.8, () => {
            setDisplayStepIndex(targetIndex);
          });
        }, 400);

        return () => clearTimeout(animTimer);
      } else {
        // Already at destination or stage 0: soft welcome pulse
        const destEl = stageRefs.current[targetIndex];
        if (destEl) {
          gsap.fromTo(
            destEl,
            { scale: 1.15 },
            { scale: 1, duration: 0.5, ease: 'back.out(2)' }
          );
        }
      }
      return;
    }

    // When the owner updates the status in Admin/background:
    // User requirement: Do NOT automatically move the scooter on owner update!
    // Instead, flag that an update is ready so customer clicks "Track" to see it move!
    if (prevStatusRef.current !== order.status) {
      prevStatusRef.current = order.status;
      setHasNewOwnerUpdate(true);
    }
  }, [order.status, refreshLayout, driveToProgress, getInitialStartProgress]);

  if (isCancelled) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle no-print space-y-3">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Order Cancelled</p>
            <p className="text-stone-600 mt-0.5">
              This order has been cancelled. Any pre-authorized payment is processed for automatic store refund.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeStage = stages[displayStepIndex] || stages[0];

  return (
    <div
      className={`bg-white rounded-2xl border border-surface-border p-5 sm:p-7 shadow-subtle no-print space-y-6 overflow-hidden ${className}`}
    >
      {/* 1. Header with Live Logistics Status & Customer Track Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isDelivered ? 'bg-emerald-500' : 'bg-brand-crimson'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isDelivered ? 'bg-emerald-600' : 'bg-brand-crimson'
                }`}
              />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-obsidian flex items-center gap-1.5">
              <span>Live Fulfillment Journey</span>
              <span className="text-[10px] text-muted font-normal">| Bharathi Express EV</span>
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Realtime dispatch tracking • Order #{order.orderNumber}
          </p>
        </div>

        {/* Action Controls: Prominent Track Button & Fulfillment Mode Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Customer Track Button: triggers the impressive left-to-right journey anytime */}
          <button
            type="button"
            onClick={handleTriggerTrackRide}
            disabled={isMoving}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer ${
              hasNewOwnerUpdate
                ? 'bg-brand-crimson text-white animate-bounce shadow-crimson'
                : 'bg-stone-900 hover:bg-black text-white'
            }`}
            title="Click to watch the EV Scooter travel left to right to the updated status"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>{hasNewOwnerUpdate ? 'New Status: Track Now' : 'Track Route'}</span>
          </button>

          {/* Delivery Mode Tag */}
          <div className="px-3.5 py-1.5 bg-stone-50 border border-surface-border rounded-full flex items-center gap-1.5 text-xs font-semibold text-stone-700">
            {isPickup ? (
              <>
                <Store className="w-3.5 h-3.5 text-brand-crimson" />
                <span>Store Pickup</span>
              </>
            ) : (
              <>
                <Truck className="w-3.5 h-3.5 text-brand-crimson" />
                <span className="hidden xs:inline">100% Electric Doorstep Delivery</span>
                <span className="xs:hidden">100% Electric EV</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Owner Update Ready Notification Banner (visible when owner updates while customer is on page) */}
      {hasNewOwnerUpdate && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="font-medium">
              Store manager updated order to <strong className="uppercase">{order.status.replace(/_/g, ' ')}</strong>! Click Track Route to see the live EV dispatch journey.
            </p>
          </div>
          <button
            onClick={handleTriggerTrackRide}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shrink-0 transition-colors"
          >
            Track Now
          </button>
        </div>
      )}

      {/* 2. Interactive Route & Real EV Scooter Area */}
      <div className="relative pt-10 sm:pt-14 pb-5 px-1 sm:px-6" ref={containerRef}>
        {/* SVG Route Lines connecting stages with Electric Laser Beam */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep Ruby Glow for Active Completed Route */}
            <filter id="routeCrimsonGlow" x="-10%" y="-20%" width="120%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#C8102E" floodOpacity="0.35" />
            </filter>

            {/* Electric Blue Laser Glow for Energy Comet */}
            <filter id="cometLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#38BDF8" floodOpacity="0.8" />
            </filter>

            {/* Energy Comet Gradient Trail */}
            <linearGradient id="cometTrailGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Inactive Base Route Line (Road Underlay) */}
          {routeCoordinates.startX > 0 && (
            <line
              x1={routeCoordinates.startX}
              y1={routeCoordinates.y}
              x2={routeCoordinates.endX}
              y2={routeCoordinates.y}
              stroke="#E2E8F0"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Upcoming Segments Road Surface Dashed Track */}
          {routeCoordinates.startX > 0 && (
            <line
              x1={routeCoordinates.startX}
              y1={routeCoordinates.y}
              x2={routeCoordinates.endX}
              y2={routeCoordinates.y}
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              opacity="0.55"
            />
          )}

          {/* Active Completed Route Glow Tube */}
          {routeCoordinates.startX > 0 && (
            <line
              ref={activeLineGlowRef}
              x1={routeCoordinates.startX}
              y1={routeCoordinates.y}
              x2={vehicleX || routeCoordinates.startX}
              y2={routeCoordinates.y}
              stroke="#C8102E"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#routeCrimsonGlow)"
              opacity="0.3"
            />
          )}

          {/* Active Completed Route Solid Crimson Highway */}
          {routeCoordinates.startX > 0 && (
            <line
              ref={activeLineRef}
              x1={routeCoordinates.startX}
              y1={routeCoordinates.y}
              x2={vehicleX || routeCoordinates.startX}
              y2={routeCoordinates.y}
              stroke="#C8102E"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Dynamic JavaScript Electric Energy Comet Trail */}
          {routeCoordinates.startX > 0 && (
            <line
              ref={energyTrailRef}
              x1={routeCoordinates.startX}
              y1={routeCoordinates.y}
              x2={routeCoordinates.startX}
              y2={routeCoordinates.y}
              stroke="url(#cometTrailGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Dynamic JavaScript Electric Energy Comet Head */}
          {routeCoordinates.startX > 0 && (
            <circle
              ref={energyCometRef}
              cx={routeCoordinates.startX}
              cy={routeCoordinates.y}
              r="3.8"
              fill="#FFFFFF"
              filter="url(#cometLaserGlow)"
            />
          )}
        </svg>

        {/* 3. The Real EV Scooter (Centered precisely on routeCoordinates.y with wheels on line) */}
        <div
          ref={vehicleWrapperRef}
          className="absolute z-20 pointer-events-none transition-opacity duration-300"
          style={{
            top: `${routeCoordinates.y}px`,
            left: '0px',
            transform: `translate3d(${vehicleX}px, 0, 0) translateX(-50%)`,
            opacity: routeCoordinates.startX > 0 ? 1 : 0,
          }}
        >
          <div style={{ transform: 'translateY(-91.7%)' }}>
            <DeliveryVehicle
              status={stages[displayStepIndex]?.key || order.status}
              fulfillmentMethod={order.fulfillmentMethod}
              isMoving={isMoving}
              size="md"
            />
          </div>
        </div>

        {/* 4. The 5 Stage Nodes */}
        <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-4 text-center">
          {stages.map((stage, idx) => {
            const isCompleted = displayStepIndex > idx;
            const isCurrent = displayStepIndex === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className="flex flex-col items-center group relative select-none"
              >
                {/* Stage Circle Node with Radar Ripples */}
                <div className="relative flex items-center justify-center">
                  {/* Active Radar Ripple Rings */}
                  {isCurrent && (
                    <>
                      <span className="animate-ping absolute inline-flex h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-brand-crimson/25 opacity-75" />
                      <span className="absolute inline-flex h-10 w-10 sm:h-12 sm:w-12 rounded-full ring-2 ring-brand-crimson/35 animate-pulse" />
                    </>
                  )}

                  <div
                    ref={(el) => (stageRefs.current[idx] = el)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-brand-crimson text-white shadow-crimson'
                        : isCurrent
                        ? isDelivered
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/25 shadow-lg'
                          : 'bg-brand-crimson text-white ring-4 ring-brand-crimson/30 shadow-crimson'
                        : 'bg-white text-stone-400 border-2 border-stone-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                </div>

                {/* Stage Typography (Desktop/Tablet) */}
                <div className="mt-3 hidden sm:block max-w-[130px]">
                  <h3
                    className={`text-xs font-bold leading-tight transition-colors ${
                      isCompleted || isCurrent ? 'text-obsidian' : 'text-stone-400'
                    }`}
                  >
                    {stage.label}
                  </h3>
                  <p className="text-[10px] text-muted mt-0.5 leading-snug">
                    {stage.desc}
                  </p>
                </div>

                {/* Compact Label (Mobile) */}
                <div className="mt-2 block sm:hidden">
                  <span
                    className={`text-[9px] font-bold block truncate max-w-[58px] ${
                      isCompleted || isCurrent ? 'text-obsidian' : 'text-stone-400'
                    }`}
                  >
                    {stage.label.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Mobile Stage Spotlight Card */}
      <div className="sm:hidden bg-stone-50 border border-surface-border rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDelivered ? 'bg-emerald-600 text-white' : 'bg-brand-crimson text-white shadow-crimson'
            }`}
          >
            {React.createElement(activeStage.icon, { className: 'w-4 h-4' })}
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold tracking-wider text-brand-crimson block">
              {isDelivered ? 'Completed' : 'Current Progress'} • Step {displayStepIndex + 1} of 5
            </span>
            <p className="font-bold text-obsidian text-xs leading-tight truncate">
              {activeStage.label}
            </p>
            <p className="text-[11px] text-muted truncate">{activeStage.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
