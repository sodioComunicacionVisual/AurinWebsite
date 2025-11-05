export function getBackgroundEffectStyles() {
  return {
    wideGlow: {
      background: `radial-gradient(ellipse 800px 600px at 50% 0%, 
        rgba(59, 130, 246, 0.15) 0%, 
        transparent 50%)`,
    },
    sharpGlow: {
      background: `radial-gradient(ellipse 400px 300px at 50% 0%, 
        rgba(59, 130, 246, 0.25) 0%, 
        transparent 60%)`,
    },
    centerGlow: {
      background: `radial-gradient(ellipse 200px 150px at 50% 0%, 
        rgba(59, 130, 246, 0.4) 0%, 
        transparent 70%)`,
    },
    gridBackground: {
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
      mask: "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
      WebkitMask: "radial-gradient(circle at center, black 0%, black 40%, transparent 80%)",
      maskComposite: "intersect",
      WebkitMaskComposite: "source-in",
      maskImage:
        "radial-gradient(circle at center, black 0%, black 40%, transparent 80%), linear-gradient(to top, transparent 0%, black 20%)",
      WebkitMaskImage:
        "radial-gradient(circle at center, black 0%, black 40%, transparent 80%), linear-gradient(to top, transparent 0%, black 20%)",
    },
  }
}
