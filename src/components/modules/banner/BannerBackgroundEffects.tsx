"use client"

import LightRays from "./LightRays"

export function BannerBackgroundEffects() {
  return (
    <>
      {/* The new WebGL light rays effect, with props tweaked for a soft, ambient spotlight look. */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#E8E8E8" // Color blanco más brillante
        lightSpread={0.35} // Slightly soften the spotlight edges
        rayLength={2.5} // Maximum length
        fadeDistance={1.2} // Keep visibility
        pulsating // Keep subtle movement
        raysSpeed={0.4} // Más movimiento
        mouseInfluence={0} // No mouse interaction
        distortion={0.02} // Keep organic feel sin aumentar
        noiseAmount={0} // No noise
        saturation={1.2} // Max saturation
        className="absolute inset-0"
      />

      {/* Gradient overlay to fade out the bottom of the light rays */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #0A0A0A 6%, transparent 50%)",
        }}
      />

      {/* Grid background with radial fade */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.4,
          mask: "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
          WebkitMask: "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          maskImage:
            "radial-gradient(circle at center, black 0%, black 40%, transparent 80%), linear-gradient(to top, transparent 0%, black 20%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, black 40%, transparent 80%), linear-gradient(to top, transparent 0%, black 20%)",
          zIndex: 10,
        }}
      />
    </>
  )
}
