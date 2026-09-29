import React, { useEffect, useRef } from 'react';
import { OrderStatus, FulfillmentMethod } from '../../types';
import gsap from 'gsap';

interface DeliveryVehicleProps {
  status: OrderStatus;
  fulfillmentMethod?: FulfillmentMethod;
  isMoving?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  currentSpeed?: number;
}

export const DeliveryVehicle: React.FC<DeliveryVehicleProps> = ({
  status,
  fulfillmentMethod = 'delivery',
  isMoving = false,
  className = '',
  size = 'md',
  currentSpeed = 0,
}) => {
  const isPickup = fulfillmentMethod === 'store_pickup';
  const isDelivered = status === 'delivered';
  const isOutForDelivery = status === 'out_for_delivery';

  const chassisRef = useRef<SVGGElement | null>(null);
  const rearWheelRef = useRef<SVGGElement | null>(null);
  const frontWheelRef = useRef<SVGGElement | null>(null);
  const lightBeamRef = useRef<SVGPolygonElement | null>(null);
  const headlampGlowRef = useRef<SVGCircleElement | null>(null);

  // Status HUD pill content with clean, elegant styling
  const getPillContent = () => {
    switch (status) {
      case 'placed':
        return { 
          badge: 'Assigned',
          title: 'Order Received', 
          shortTitle: 'Received',
          bgColor: 'bg-stone-900/90 text-white',
          dotColor: 'bg-amber-400',
        };
      case 'confirmed':
        return { 
          badge: 'Verified',
          title: 'Store Confirmed', 
          shortTitle: 'Confirmed',
          bgColor: 'bg-stone-900/90 text-white',
          dotColor: 'bg-blue-400',
        };
      case 'packed':
        return { 
          badge: 'Sealed',
          title: isPickup ? 'Bagged for Pickup' : 'Cargo Sealed & Loaded', 
          shortTitle: isPickup ? 'Bagged' : 'Packed',
          bgColor: 'bg-stone-900/90 text-white',
          dotColor: 'bg-amber-400',
        };
      case 'out_for_delivery':
        return {
          badge: 'EV Live',
          title: isPickup ? 'Ready at Counter' : 'En Route with Driver',
          shortTitle: isPickup ? 'Ready' : 'En Route',
          bgColor: 'bg-brand-crimson text-white shadow-crimson',
          dotColor: 'bg-white',
          isLive: true,
        };
      case 'delivered':
        return {
          badge: 'Delivered',
          title: isPickup ? 'Handed Over ✓' : 'Delivered Safely ✓',
          shortTitle: isPickup ? 'Picked Up' : 'Delivered',
          bgColor: 'bg-emerald-700 text-white',
          dotColor: 'bg-emerald-300',
        };
      default:
        return { 
          badge: 'Active', 
          title: 'Fulfillment Active', 
          shortTitle: 'Active',
          bgColor: 'bg-stone-900/90 text-white', 
          dotColor: 'bg-stone-400',
        };
    }
  };

  const pill = getPillContent();

  // JavaScript (GSAP) suspension physics, engine breathing & wheel kinetics
  useEffect(() => {
    if (!chassisRef.current) return;

    const ctx = gsap.context(() => {
      if (isMoving) {
        // Dynamic Acceleration & Road Kinematics:
        // Chassis tilts slightly forward into acceleration and vibrates with high-frequency road feel
        gsap.to(chassisRef.current, {
          y: -2.8,
          rotation: 4.2,
          skewX: -1.5,
          duration: 0.16,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '40% 85%',
        });

        // Wheel RPM rotation during motion
        if (rearWheelRef.current && frontWheelRef.current) {
          gsap.to([rearWheelRef.current, frontWheelRef.current], {
            rotation: '+=360',
            duration: 0.42,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
          });
        }

        // Projector beam pulsing intensity during high-speed travel
        if (lightBeamRef.current) {
          gsap.to(lightBeamRef.current, {
            opacity: 0.95,
            duration: 0.25,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
          });
        }
      } else {
        // Idle Realistic Suspension Breathing (Gentle sine-wave idle)
        gsap.to(chassisRef.current, {
          y: -1.4,
          rotation: 0,
          skewX: 0,
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          transformOrigin: '50% 85%',
        });

        // Idle headlamp steady glow
        if (headlampGlowRef.current) {
          gsap.to(headlampGlowRef.current, {
            r: 5.5,
            opacity: 0.85,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }
      }
    });

    return () => ctx.revert();
  }, [isMoving]);

  // Scaled dimensions: on mobile view (<sm), vehicle is scaled down to ~50px x 30px so it fits cleanly between stage nodes
  // On tablet (sm): ~88px x 53px, On desktop (md+): full 116px x 70px with authentic high-fidelity details
  const scaleClasses = {
    sm: 'w-[44px] h-[26px] sm:w-[72px] sm:h-[43px] md:w-[88px] md:h-[54px]',
    md: 'w-[50px] h-[30px] sm:w-[88px] sm:h-[53px] md:w-[116px] md:h-[70px]',
    lg: 'w-[58px] h-[35px] sm:w-[100px] sm:h-[60px] md:w-[136px] md:h-[82px]',
  }[size];

  // Calculated display speed for telemetry badge
  const displaySpeed = isMoving ? (currentSpeed > 0 ? currentSpeed : 38) : 0;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 1. Minimalist Glassmorphic HUD Tooltip floating above the EV Scooter */}
      <div className="absolute -top-7 sm:-top-8 md:-top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none transition-all duration-300">
        <div
          className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold tracking-tight shadow-xl border border-white/20 backdrop-blur-md ${pill.bgColor} transition-colors duration-300`}
        >
          {/* Animated pulsing live beacon dot */}
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            {(pill.isLive || isMoving) && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${pill.dotColor}`} />
          </span>

          <span className="text-[7.5px] sm:text-[8px] md:text-[8.5px] uppercase tracking-wider text-white/80 font-semibold border-r border-white/20 pr-1 sm:pr-1.5">
            {pill.badge}
          </span>
          <span className="hidden sm:inline font-bold text-white tracking-tight">{pill.title}</span>
          <span className="sm:hidden font-bold text-white tracking-tight">{pill.shortTitle}</span>
        </div>

        {/* Downward indicator triangle */}
        <div className="w-0 h-0 border-l-[3px] sm:border-l-[4px] border-l-transparent border-r-[3px] sm:border-r-[4px] border-r-transparent border-t-[3px] sm:border-t-[4px] border-t-stone-900 mx-auto -mt-[0.5px]" />
      </div>

      {/* 2. REALISTIC HIGH-FIDELITY EV SCOOTER SVG (Ather / Ola Fleet Edition) */}
      <div className={`relative ${scaleClasses} transition-all duration-300`}>
        <svg
          viewBox="0 0 120 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Lustrous Metallic Bharathi Crimson Gradient */}
            <linearGradient id="evCrimsonMetallic" x1="20" y1="15" x2="105" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="25%" stopColor="#E11D48" />
              <stop offset="60%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>

            {/* Aerodynamic Carbon & Obsidian Graphite Bodywork */}
            <linearGradient id="evCarbonGloss" x1="45" y1="20" x2="85" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#090D16" />
            </linearGradient>

            {/* Commercial Thermal Cargo Box Shell */}
            <linearGradient id="cargoPodBevel" x1="8" y1="10" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* High-Intensity Forward LED Headlamp Cone */}
            <linearGradient id="projectorLightCone" x1="100" y1="28" x2="138" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#67E8F9" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#0284C7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
            </linearGradient>

            {/* Machined Diamond-Cut Star Alloy Wheel Rims */}
            <radialGradient id="alloyWheelRimGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#CBD5E1" />
              <stop offset="85%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </radialGradient>

            {/* Brake Rotor Stainless Steel Metallic */}
            <radialGradient id="brakeRotorGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="60%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            {/* Soft Ambient Ground Shadow Filter */}
            <filter id="ambientGroundShadow" x="-15%" y="-30%" width="130%" height="160%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>

            {/* Glowing Light Beam Filter */}
            <filter id="cyanNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38BDF8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Realistic Soft Ambient Occlusion Ground Contact Shadow beneath tires */}
          <ellipse
            cx="60"
            cy="66.5"
            rx="46"
            ry="3.8"
            fill="#090D16"
            opacity={isMoving ? 0.35 : 0.45}
            filter="url(#ambientGroundShadow)"
          />

          {/* 2. High-Speed Kinetic Slipstream Particles (dynamic electric sparks during motion) */}
          {isMoving && (
            <g id="slipstream-particles" className="opacity-95">
              <line x1="-2" y1="46" x2="16" y2="46" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
              <line x1="-8" y1="38" x2="12" y2="38" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
              <line x1="2" y1="54" x2="18" y2="54" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <circle cx="-5" cy="42" r="1.5" fill="#38BDF8" opacity="0.75" />
              <circle cx="-10" cy="50" r="1.2" fill="#E11D48" opacity="0.7" />
            </g>
          )}

          {/* 3. Forward Projector Headlamp Beam (casts onto the road ahead) */}
          {(isOutForDelivery || isMoving) && (
            <g id="forward-lighting">
              <polygon
                ref={lightBeamRef}
                points="100,28 140,20 140,58 100,34"
                fill="url(#projectorLightCone)"
                opacity="0.85"
              />
              {/* Luminous illumination pool on the road ahead */}
              <ellipse cx="122" cy="65.5" rx="14" ry="2.2" fill="#38BDF8" opacity="0.28" filter="url(#cyanNeonGlow)" />
            </g>
          )}

          {/* 4. MAIN SCOOTER CHASSIS & SUSPENSION (with GSAP Dynamic Suspension Tilt) */}
          <g ref={chassisRef} id="scooter-body-assembly">
            {/* A. Low-Slung Battery Floorboard (Structural Aluminum Subframe) */}
            <g id="ev-battery-subframe">
              {/* Main heavy-duty battery casing (42 to 78, y=50 to 57) */}
              <rect x="44" y="50" width="34" height="6.5" rx="2.5" fill="#090D16" />
              <rect x="46" y="51" width="30" height="2.2" rx="1" fill="#1E293B" />
              {/* Illuminated Electric Green Battery Energy Status Strip */}
              <line x1="47" y1="54.8" x2="75" y2="54.8" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="49" cy="54.8" r="0.8" fill="#FFFFFF" />
              {/* Aluminum Footboard Non-Slip Deck Ribs */}
              <path d="M52 50.5H54M56 50.5H58M60 50.5H62M64 50.5H66M68 50.5H70" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* B. Rear Mono-Shock Suspension with Exposed Red Spring Coil */}
            <g id="rear-mono-shock">
              {/* Upper & lower aluminum damper cylinder mounts */}
              <rect x="35" y="44" width="3.5" height="10" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
              {/* Coiled high-tensile red spring */}
              <path d="M35 45.5H38.5M35 47.5H38.5M35 49.5H38.5M35 51.5H38.5" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* C. Rear Aluminum Swingarm & Belt Drive Cover */}
            <path d="M28 55L45 51L44 55Z" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />

            {/* D. Commercial Supermarket Thermal Delivery Cargo Pod */}
            <g id="supermarket-cargo-pod">
              {/* Heavy-duty Tubular Steel Support Frame */}
              <path d="M20 52L24 45L40 45L43 51" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

              {/* Main Pod Body (Beveled Aerodynamic Arctic Box) */}
              <rect
                x="8"
                y="14"
                width="36"
                height="32"
                rx="5"
                fill="url(#cargoPodBevel)"
                stroke="#CBD5E1"
                strokeWidth="1.4"
              />

              {/* Top Lid Header in Bharathi Signature Crimson */}
              <path
                d="M8 20C8 16.6863 10.6863 14 14 14H38C41.3137 14 44 16.6863 44 20V22.5H8V20Z"
                fill="url(#evCrimsonMetallic)"
              />

              {/* Top Lid Rear High-Mount LED Brake Light Strip */}
              <rect x="12" y="15.5" width="28" height="2.2" rx="1.1" fill="#FF1E40" />
              <rect x="16" y="16" width="20" height="1.2" rx="0.6" fill="#FCA5A5" />

              {/* Box Stainless Steel Heavy-Duty Lock Latch & Toggle */}
              <rect x="24" y="28" width="4" height="6.5" rx="1.2" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />
              <circle cx="26" cy="32" r="1.1" fill="#090D16" />
              <line x1="8" y1="33" x2="44" y2="33" stroke="#E2E8F0" strokeWidth="1" />

              {/* Bold Bharathi Delivery Pod Decal */}
              <text
                x="26"
                y="20.5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="5.2"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.6"
              >
                BHARATHI
              </text>

              {/* 100% Electric Eco Badge on Side of Cargo Pod */}
              <rect x="12" y="24" width="28" height="3.5" rx="1.75" fill="#E11D48" fillOpacity="0.12" />
              <text
                x="26"
                y="26.6"
                textAnchor="middle"
                fill="#BE123C"
                fontSize="2.7"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.2"
              >
                100% ELECTRIC EV
              </text>

              {/* Cold Chain Certified Micro-Tag */}
              <text
                x="26"
                y="38.5"
                textAnchor="middle"
                fill="#64748B"
                fontSize="2.2"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.2"
              >
                COLD-CHAIN 4°C SAFE
              </text>

              {/* Rear License Plate: TN 09 EV 2026 */}
              <rect x="10" y="47.5" width="13" height="4.5" rx="1" fill="#FEF08A" stroke="#090D16" strokeWidth="0.6" />
              <text
                x="16.5"
                y="51"
                textAnchor="middle"
                fill="#090D16"
                fontSize="2.4"
                fontWeight="900"
                fontFamily="monospace"
              >
                TN•09•EV
              </text>
            </g>

            {/* E. Ergonomic Rider Saddle / Seat */}
            <g id="rider-seat">
              {/* Contoured two-tier sport seat */}
              <path
                d="M44 32C44 28.5 48 26.5 54 26.5H68C72.5 26.5 75 29 76 33.5L77 38H46C44.5 38 44 35 44 32Z"
                fill="#090D16"
              />
              {/* White Contrast French Stitching Line */}
              <path
                d="M47 32.5C50 30 55 28.5 62 28.5H69C73 28.5 74.5 30.5 75 33"
                stroke="#FFFFFF"
                strokeWidth="0.8"
                strokeOpacity="0.8"
                strokeDasharray="1.5 1"
              />
            </g>

            {/* F. Front Cowl, Aerodynamic Fairing & Cockpit (Ather / Ola inspired) */}
            <g id="front-cowl-assembly">
              {/* Dynamic Sculpted Center Spine Panel */}
              <path
                d="M72 52L86 31H96C99 31 101 33.5 101 36.5L97 50C95 53 92 54 88 54H74L72 52Z"
                fill="url(#evCrimsonMetallic)"
              />

              {/* Dark Carbon Contrast Air Dam & Aero Inlets */}
              <path
                d="M76 50L88 32.5H94L90 48H80L76 50Z"
                fill="url(#evCarbonGloss)"
              />

              {/* Front Aerodynamic Mudguard / Hugger Fender */}
              <path
                d="M82 53C83.5 47 88.5 42 95 42C98.5 42 101.5 44 103.5 47L101 50C99.5 47.5 97 46 94 46C89 46 86 49.5 85 54H82Z"
                fill="url(#evCrimsonMetallic)"
              />

              {/* Upside-Down (USD) Front Telescopic Hydraulic Forks */}
              <path d="M88 32L94 55" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
              <path d="M89 34L93 52" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

              {/* Horizontal LED DRL Eyebrow Light Bar & Dual Projector Unit */}
              <polygon
                points="95,33 102,33 100,38 93,38"
                fill="#E0F2FE"
                stroke="#38BDF8"
                strokeWidth="1"
              />
              <line x1="95.5" y1="35.5" x2="100.5" y2="35.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              {/* Active Headlamp Lens Glow */}
              <circle
                ref={headlampGlowRef}
                cx="98"
                cy="35.5"
                r="4"
                fill="#38BDF8"
                opacity="0.75"
                filter="url(#cyanNeonGlow)"
              />

              {/* Handlebar Stem & Triple Clamp */}
              <path d="M86 31L90 19" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />

              {/* Aerodynamic Handlebars with Throttle Grips */}
              <path d="M83 21L95 18" stroke="#090D16" strokeWidth="2.6" strokeLinecap="round" />
              {/* Right Throttle Grip & Disc Brake Lever */}
              <circle cx="95" cy="18" r="1.6" fill="#475569" />
              <line x1="95" y1="18" x2="100" y2="17" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

              {/* Aerodynamic Side Rear-View Mirror */}
              <path d="M86 19L88 12L94 13L92 19" fill="#1E293B" stroke="#090D16" strokeWidth="0.8" />
              <path d="M89 13.5L93 14" stroke="#38BDF8" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />

              {/* Modern Digital Cockpit Tablet Touchscreen Display */}
              <rect x="87" y="16" width="5.5" height="3.8" rx="1" fill="#020617" stroke="#38BDF8" strokeWidth="0.8" />
              {/* Speed / Battery readout pixels */}
              <rect x="88" y="17.2" width="3.2" height="1.4" rx="0.4" fill="#10B981" />

              {/* Tinted Aerodynamic Smoked Flyscreen Windshield */}
              <path
                d="M90 18L93.5 10C94.2 9 96 9 96.8 10L98 18H90Z"
                fill="#0F172A"
                fillOpacity="0.75"
                stroke="#64748B"
                strokeWidth="0.8"
              />
            </g>
          </g>

          {/* 5. HIGH-PERFORMANCE REALISTIC EV ALLOY WHEELS & BRAKE ROTORS */}
          <g id="alloy-wheels-assembly">
            {/* A. REAR ALLOY WHEEL (Wheelbase Center: x=28, y=55) */}
            <g id="rear-wheel" transform="translate(28, 55)">
              {/* Outer Deep Rubber Tubeless Tire (Radius 11 -> baseline touches 66) */}
              <circle cx="0" cy="0" r="11" fill="#090D16" />
              <circle cx="0" cy="0" r="9.5" fill="#1E293B" />

              {/* 5-Spoke Machine-Cut Diamond Alloy Wheel Rim */}
              <g ref={rearWheelRef}>
                <circle cx="0" cy="0" r="7.8" fill="url(#alloyWheelRimGrad)" stroke="#475569" strokeWidth="0.9" />

                {/* Cross-Drilled Stainless Steel Disc Rotor */}
                <circle cx="0" cy="0" r="5.5" fill="url(#brakeRotorGrad)" stroke="#94A3B8" strokeWidth="0.6" />
                {/* Rotor Ventilation Slots */}
                <circle cx="-3" cy="0" r="0.4" fill="#334155" />
                <circle cx="3" cy="0" r="0.4" fill="#334155" />
                <circle cx="0" cy="-3" r="0.4" fill="#334155" />
                <circle cx="0" cy="3" r="0.4" fill="#334155" />

                {/* 5 Diamond-Cut Polished Star Rim Spokes */}
                <line x1="-6.5" y1="0" x2="6.5" y2="0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="0" y1="-6.5" x2="0" y2="6.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="-4.6" y1="-4.6" x2="4.6" y2="4.6" stroke="#F1F5F9" strokeWidth="1" strokeLinecap="round" />
                <line x1="4.6" y1="-4.6" x2="-4.6" y2="4.6" stroke="#F1F5F9" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Red Disc Caliper (Fixed at 10 o'clock) */}
              <path d="M-4 -5.5L-1.5 -7L1 -5L-1.5 -3.5Z" fill="#DC2626" stroke="#991B1B" strokeWidth="0.5" />

              {/* High-Torque Hub Motor Axle Center Core */}
              <circle cx="0" cy="0" r="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.2" fill="#10B981" />
            </g>

            {/* B. FRONT ALLOY WHEEL (Wheelbase Center: x=92, y=55) */}
            <g id="front-wheel" transform="translate(92, 55)">
              {/* Outer Deep Rubber Tubeless Tire (Radius 11 -> baseline touches 66) */}
              <circle cx="0" cy="0" r="11" fill="#090D16" />
              <circle cx="0" cy="0" r="9.5" fill="#1E293B" />

              {/* 5-Spoke Machine-Cut Diamond Alloy Wheel Rim */}
              <g ref={frontWheelRef}>
                <circle cx="0" cy="0" r="7.8" fill="url(#alloyWheelRimGrad)" stroke="#475569" strokeWidth="0.9" />

                {/* Cross-Drilled Stainless Steel Disc Rotor */}
                <circle cx="0" cy="0" r="5.5" fill="url(#brakeRotorGrad)" stroke="#94A3B8" strokeWidth="0.6" />
                {/* Rotor Ventilation Slots */}
                <circle cx="-3" cy="0" r="0.4" fill="#334155" />
                <circle cx="3" cy="0" r="0.4" fill="#334155" />
                <circle cx="0" cy="-3" r="0.4" fill="#334155" />
                <circle cx="0" cy="3" r="0.4" fill="#334155" />

                {/* 5 Diamond-Cut Polished Star Rim Spokes */}
                <line x1="-6.5" y1="0" x2="6.5" y2="0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="0" y1="-6.5" x2="0" y2="6.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="-4.6" y1="-4.6" x2="4.6" y2="4.6" stroke="#F1F5F9" strokeWidth="1" strokeLinecap="round" />
                <line x1="4.6" y1="-4.6" x2="-4.6" y2="4.6" stroke="#F1F5F9" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Front Disc Caliper (Fixed at 10 o'clock) */}
              <path d="M-4 -5.5L-1.5 -7L1 -5L-1.5 -3.5Z" fill="#DC2626" stroke="#991B1B" strokeWidth="0.5" />

              {/* Front Axle Center Nut */}
              <circle cx="0" cy="0" r="2.4" fill="#0F172A" stroke="#94A3B8" strokeWidth="0.6" />
              <circle cx="0" cy="0" r="0.9" fill="#E2E8F0" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
