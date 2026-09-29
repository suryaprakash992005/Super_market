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

  // Refs for the DESKTOP horizontal layout
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vehicleWrapperRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<SVGLineElement | null>(null);
  const activeLineGlowRef = useRef<SVGLineElement | null>(null);
  const energyCometRef = useRef<SVGCircleElement | null>(null);
  const energyTrailRef = useRef<SVGLineElement | null>(null);

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

  // Detect if we are on a small (mobile) screen
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const applyVehicleAndLinePosition = useCallback((x: number, _startX: number) => {
    if (vehicleWrapperRef.current) {
      vehicleWrapperRef.current.style.transform = `translate3d(${x}px, 0, 0) translateX(-50%)`;
    }
    if (activeLineRef.current) {
      activeLineRef.current.setAttribute('x2', `${x}`);
    }
    if (activeLineGlowRef.current) {
      activeLineGlowRef.current.setAttribute('x2', `${x}`);
    }
  }, []);

  const startEnergyCometLoop = useCallback((startX: number, currentX: number) => {
    if (!energyCometRef.current || currentX <= startX + 5) return;
    if (cometTweenRef.current) cometTweenRef.current.kill();
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

  const refreshLayout = useCallback((progress: number) => {
    // Only run the GSAP/DOM route logic for the desktop layout
    if (isMobile) return;
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
  }, [isMobile, getStageCenters, getStageCenterY, interpolateX, applyVehicleAndLinePosition, startEnergyCometLoop]);

  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(() => refreshLayout(currentProgressRef.current), 60);
    const handleResize = () => refreshLayout(currentProgressRef.current);
    window.addEventListener('resize', handleResize);
    let observer: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(handleResize);
      observer.observe(containerRef.current);
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (cometTweenRef.current) cometTweenRef.current.kill();
    };
  }, [isMobile, refreshLayout]);

  const driveToProgress = useCallback((targetProgress: number, duration: number = 1.8, onFinish?: () => void) => {
    if (activeTweenRef.current) activeTweenRef.current.kill();
    const centers = getStageCenters();
    const startX = centers[0] || routeCoordinates.startX;
    const fromVal = currentProgressRef.current;
    setIsMoving(true);
    const progressProxy = { val: fromVal };
    activeTweenRef.current = gsap.to(progressProxy, {
      val: targetProgress,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        currentProgressRef.current = progressProxy.val;
        if (!isMobile) {
          const currentCenters = getStageCenters();
          const posX = interpolateX(progressProxy.val, currentCenters);
          setVehicleX(posX);
          applyVehicleAndLinePosition(posX, startX);
        }
        setDisplayStepIndex(Math.round(progressProxy.val));
      },
      onComplete: () => {
        setIsMoving(false);
        currentProgressRef.current = targetProgress;
        setDisplayStepIndex(targetProgress);
        if (!isMobile) refreshLayout(targetProgress);
        try { localStorage.setItem(STORAGE_KEY, order.status); } catch { /* ignore */ }
        const destIdx = Math.round(targetProgress);
        const destEl = stageRefs.current[destIdx];
        if (destEl) {
          gsap.fromTo(destEl, { scale: 1.25, rotate: -2 }, { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(2.5)' });
        }
        if (onFinish) onFinish();
      },
    });
  }, [isMobile, getStageCenters, routeCoordinates.startX, interpolateX, applyVehicleAndLinePosition, refreshLayout, STORAGE_KEY, order.status]);

  const handleTriggerTrackRide = useCallback(() => {
    if (isMoving) return;
    setHasNewOwnerUpdate(false);
    const fromIndex = targetStepIndex > 0 ? targetStepIndex - 1 : 0;
    currentProgressRef.current = fromIndex;
    setDisplayStepIndex(fromIndex);
    if (!isMobile) refreshLayout(fromIndex);
    setTimeout(() => driveToProgress(targetStepIndex, 1.8), 150);
  }, [isMoving, isMobile, targetStepIndex, refreshLayout, driveToProgress]);

  useEffect(() => {
    const targetIndex = STATUS_KEYS.indexOf(order.status);
    if (targetIndex === -1) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStatusRef.current = order.status;
      const startPos = getInitialStartProgress();
      currentProgressRef.current = startPos;
      setDisplayStepIndex(startPos);
      if (!isMobile) refreshLayout(startPos);
      if (targetIndex > startPos) {
        const animTimer = setTimeout(() => {
          driveToProgress(targetIndex, 1.8, () => setDisplayStepIndex(targetIndex));
        }, 400);
        return () => clearTimeout(animTimer);
      } else {
        const destEl = stageRefs.current[targetIndex];
        if (destEl) gsap.fromTo(destEl, { scale: 1.15 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
      }
      return;
    }
    if (prevStatusRef.current !== order.status) {
      prevStatusRef.current = order.status;
      setHasNewOwnerUpdate(true);
    }
  }, [isMobile, order.status, refreshLayout, driveToProgress, getInitialStartProgress]);

  if (isCancelled) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-subtle no-print space-y-3">
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

  const activeStage = stages[Math.round(displayStepIndex)] || stages[0];
  const displayIndex = Math.round(displayStepIndex);

  return (
    <div className={`bg-white rounded-2xl border border-surface-border shadow-subtle no-print overflow-hidden ${className}`}>
      
      {/* ── Header ── */}
      <div className="p-4 sm:p-6 border-b border-surface-border/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDelivered ? 'bg-emerald-500' : 'bg-brand-crimson'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDelivered ? 'bg-emerald-600' : 'bg-brand-crimson'}`} />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-obsidian">
                Live Fulfillment Journey
                <span className="text-[10px] text-muted font-normal ml-1.5">| Bharathi Express EV</span>
              </h2>
            </div>
            <p className="text-xs text-muted mt-1 ml-4.5">
              Realtime dispatch tracking • Order #{order.orderNumber}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleTriggerTrackRide}
              disabled={isMoving}
              className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[36px] ${
                hasNewOwnerUpdate
                  ? 'bg-brand-crimson text-white animate-bounce shadow-crimson'
                  : 'bg-stone-900 hover:bg-black text-white'
              }`}
              title="Watch the EV Scooter travel to the updated status"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{hasNewOwnerUpdate ? 'New Status! Track' : 'Track Route'}</span>
            </button>

            <div className="px-3 py-2 bg-stone-50 border border-surface-border rounded-full flex items-center gap-1.5 text-xs font-semibold text-stone-700 min-h-[36px]">
              {isPickup ? (
                <>
                  <Store className="w-3.5 h-3.5 text-brand-crimson shrink-0" />
                  <span>Store Pickup</span>
                </>
              ) : (
                <>
                  <Truck className="w-3.5 h-3.5 text-brand-crimson shrink-0" />
                  <span className="hidden xs:inline">100% Electric Delivery</span>
                  <span className="xs:hidden">EV Delivery</span>
                </>
              )}
            </div>

            {/* Delivered badge */}
            {isDelivered && (
              <div className="px-3 py-2 bg-emerald-600 rounded-full flex items-center gap-1.5 text-xs font-bold text-white min-h-[36px]">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Delivered Safely ✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Owner update banner */}
        {hasNewOwnerUpdate && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="font-medium">
                Store updated order to <strong className="uppercase">{order.status.replace(/_/g, ' ')}</strong>! Click Track to see the EV dispatch journey.
              </p>
            </div>
            <button
              onClick={handleTriggerTrackRide}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shrink-0 transition-colors"
            >
              Track Now
            </button>
          </div>
        )}
      </div>

      {/* ── MOBILE: Vertical Step List (< sm) ── */}
      <div className="sm:hidden p-4 space-y-0">
        {stages.map((stage, idx) => {
          const isCompleted = displayIndex > idx;
          const isCurrent = displayIndex === idx;
          const isLast = idx === stages.length - 1;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex gap-3">
              {/* Left: Circle + vertical connector */}
              <div className="flex flex-col items-center">
                <div
                  ref={(el) => (stageRefs.current[idx] = el)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand-crimson text-white shadow-crimson'
                      : isCurrent
                      ? isDelivered
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/25 shadow-lg'
                        : 'bg-brand-crimson text-white ring-4 ring-brand-crimson/30 shadow-crimson'
                      : 'bg-white text-stone-400 border-2 border-stone-200'
                  }`}
                >
                  {isCurrent && !isCompleted && (
                    <span className="absolute animate-ping inline-flex h-9 w-9 rounded-full bg-brand-crimson/20 opacity-75" />
                  )}
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Vertical line connector between steps */}
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] my-1 rounded-full transition-colors duration-500 ${
                    isCompleted ? 'bg-brand-crimson' : 'bg-stone-200'
                  }`} />
                )}
              </div>

              {/* Right: Step label + description */}
              <div className={`pb-4 pt-1 min-w-0 flex-1 ${isLast ? 'pb-1' : ''}`}>
                <p className={`text-xs font-bold leading-tight transition-colors ${
                  isCompleted || isCurrent ? 'text-obsidian' : 'text-stone-400'
                }`}>
                  {stage.label}
                  {isCurrent && (
                    <span className="ml-1.5 text-[9px] font-bold uppercase bg-brand-crimson text-white px-1.5 py-0.5 rounded-full align-middle">
                      {isDelivered ? 'Done' : 'Live'}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-muted mt-0.5 leading-snug">{stage.desc}</p>

                {/* EV Scooter vehicle shown inline at the active mobile step */}
                {isCurrent && (
                  <div className="mt-2 flex items-center gap-2">
                    <DeliveryVehicle
                      status={stages[displayIndex]?.key || order.status}
                      fulfillmentMethod={order.fulfillmentMethod}
                      isMoving={isMoving}
                      size="sm"
                    />
                    {isMoving && (
                      <span className="text-[10px] text-brand-crimson font-semibold animate-pulse">
                        En route…
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: Horizontal Route with GSAP Scooter (sm+) ── */}
      <div className="hidden sm:block p-5 sm:p-7">
        <div className="relative pt-12 pb-5 px-4 sm:px-6" ref={containerRef}>
          {/* SVG route lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="routeCrimsonGlow" x="-10%" y="-20%" width="120%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#C8102E" floodOpacity="0.35" />
              </filter>
              <filter id="cometLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#38BDF8" floodOpacity="0.8" />
              </filter>
              <linearGradient id="cometTrailGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
                <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>
            </defs>

            {routeCoordinates.startX > 0 && (
              <>
                {/* Base road underlay */}
                <line x1={routeCoordinates.startX} y1={routeCoordinates.y} x2={routeCoordinates.endX} y2={routeCoordinates.y} stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
                {/* Dashed upcoming road */}
                <line x1={routeCoordinates.startX} y1={routeCoordinates.y} x2={routeCoordinates.endX} y2={routeCoordinates.y} stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" opacity="0.55" />
                {/* Active glow tube */}
                <line ref={activeLineGlowRef} x1={routeCoordinates.startX} y1={routeCoordinates.y} x2={vehicleX || routeCoordinates.startX} y2={routeCoordinates.y} stroke="#C8102E" strokeWidth="8" strokeLinecap="round" filter="url(#routeCrimsonGlow)" opacity="0.3" />
                {/* Active solid crimson */}
                <line ref={activeLineRef} x1={routeCoordinates.startX} y1={routeCoordinates.y} x2={vehicleX || routeCoordinates.startX} y2={routeCoordinates.y} stroke="#C8102E" strokeWidth="4" strokeLinecap="round" />
                {/* Energy comet trail */}
                <line ref={energyTrailRef} x1={routeCoordinates.startX} y1={routeCoordinates.y} x2={routeCoordinates.startX} y2={routeCoordinates.y} stroke="url(#cometTrailGrad)" strokeWidth="3" strokeLinecap="round" />
                {/* Comet head */}
                <circle ref={energyCometRef} cx={routeCoordinates.startX} cy={routeCoordinates.y} r="3.8" fill="#FFFFFF" filter="url(#cometLaserGlow)" />
              </>
            )}
          </svg>

          {/* The EV Scooter */}
          <div
            ref={vehicleWrapperRef}
            className="absolute z-20 pointer-events-none transition-opacity duration-300"
            style={{
              top: `${routeCoordinates.y - 64}px`,
              left: '0px',
              transform: `translate3d(${vehicleX}px, 0, 0) translateX(-50%)`,
              opacity: routeCoordinates.startX > 0 ? 1 : 0,
            }}
          >
            <DeliveryVehicle
              status={stages[displayIndex]?.key || order.status}
              fulfillmentMethod={order.fulfillmentMethod}
              isMoving={isMoving}
              size="md"
            />
          </div>

          {/* 5 stage nodes */}
          <div className="relative z-10 grid grid-cols-5 gap-1 sm:gap-4 text-center">
            {stages.map((stage, idx) => {
              const isCompleted = displayIndex > idx;
              const isCurrent = displayIndex === idx;
              const Icon = stage.icon;

              return (
                <div key={stage.key} className="flex flex-col items-center group relative select-none">
                  <div className="relative flex items-center justify-center">
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

                  {/* Desktop labels */}
                  <div className="mt-3 max-w-[130px]">
                    <h3 className={`text-xs font-bold leading-tight transition-colors ${isCompleted || isCurrent ? 'text-obsidian' : 'text-stone-400'}`}>
                      {stage.label}
                    </h3>
                    <p className="text-[10px] text-muted mt-0.5 leading-snug">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
