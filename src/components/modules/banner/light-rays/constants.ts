/**
 * LightRays Module Constants
 * Valores por defecto y constantes de configuración
 */

import type { LightRaysProps } from './types'

/** Color blanco por defecto para los rayos */
export const DEFAULT_COLOR = "#ffffff"

/** Valores por defecto para las props del componente */
export const DEFAULT_PROPS: Required<Omit<LightRaysProps, 'className'>> & { className: string } = {
  raysOrigin: "top-center",
  raysColor: DEFAULT_COLOR,
  raysSpeed: 1,
  lightSpread: 1,
  rayLength: 2,
  pulsating: false,
  fadeDistance: 1.0,
  saturation: 1.0,
  followMouse: true,
  mouseInfluence: 0.1,
  noiseAmount: 0.0,
  distortion: 0.0,
  className: "",
  introAnimation: true,
}

/** Configuración del Intersection Observer */
export const OBSERVER_CONFIG = {
  threshold: 0,
  rootMargin: '100px 0px 100px 0px', // Pre-cargar antes de que sea visible
}

/** Configuración de animación de intro */
export const INTRO_ANIMATION_DURATION = 2500 // ms

/** Factor de suavizado para el seguimiento del mouse */
export const MOUSE_SMOOTHING_FACTOR = 0.92

/** Breakpoint para dispositivos móviles */
export const MOBILE_BREAKPOINT = 768

/** Multiplicadores para ajustes en móvil */
export const MOBILE_ADJUSTMENTS = {
  lightSpreadMultiplier: 2.5,
  rayLengthMultiplier: 1.5,
}

/** DPR máximo para rendimiento */
export const MAX_DPR = 2

/** Factor para calcular posición fuera de pantalla */
export const OUTSIDE_FACTOR = 0.2
