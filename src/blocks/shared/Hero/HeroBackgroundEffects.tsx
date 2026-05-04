"use client"

export function HeroBackgroundEffects() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        opacity: 0.4,
        maskImage:
          "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
      }}
    />
  )
}
