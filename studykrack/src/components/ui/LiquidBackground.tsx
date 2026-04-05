'use client';

/**
 * LiquidBackground: Centralized high-viscosity mesh gradient.
 * Reduced opacity and blur for hardware acceleration.
 * Pointer-events disabled to prevent interaction interference.
 */
export default function LiquidBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 opacity-20 liquid-mesh pointer-events-none" 
      aria-hidden="true"
    />
  );
}
