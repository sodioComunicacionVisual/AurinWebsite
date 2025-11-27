/**
 * LightRays Module
 * Barrel export para el submódulo de rayos de luz
 */

// Main component
export { default as LightRays } from './LightRays'
export { default } from './LightRays'

// Types
export type { 
  LightRaysProps, 
  RaysOrigin, 
  Uniforms, 
  MousePosition,
  AnchorAndDirection 
} from './types'

// Constants
export { 
  DEFAULT_COLOR, 
  DEFAULT_PROPS,
  OBSERVER_CONFIG,
  INTRO_ANIMATION_DURATION,
  MOUSE_SMOOTHING_FACTOR,
  MOBILE_BREAKPOINT,
  MOBILE_ADJUSTMENTS,
  MAX_DPR,
  OUTSIDE_FACTOR,
} from './constants'

// Utils
export { 
  hexToRgb, 
  getAnchorAndDir,
  easeOutCubic,
  calculateScrollOpacity,
} from './utils'

// Shaders
export { vertexShader, fragmentShader } from './shaders'

// Hooks
export {
  useVisibility,
  usePageVisibility,
  useMobileDetection,
  useScrollOpacity,
  useMouseTracking,
  useIntroAnimation,
} from './hooks'
