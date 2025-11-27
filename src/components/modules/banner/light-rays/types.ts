/**
 * LightRays Module Types
 * Definición de tipos e interfaces para el componente LightRays
 */

export type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"

export interface LightRaysProps {
  /** Origen de los rayos de luz */
  raysOrigin?: RaysOrigin
  /** Color de los rayos en formato hexadecimal */
  raysColor?: string
  /** Velocidad de animación de los rayos */
  raysSpeed?: number
  /** Dispersión de la luz */
  lightSpread?: number
  /** Longitud de los rayos */
  rayLength?: number
  /** Habilitar efecto de pulsación */
  pulsating?: boolean
  /** Distancia de desvanecimiento */
  fadeDistance?: number
  /** Nivel de saturación del color */
  saturation?: number
  /** Seguir el movimiento del mouse */
  followMouse?: boolean
  /** Intensidad de la influencia del mouse */
  mouseInfluence?: number
  /** Cantidad de ruido visual */
  noiseAmount?: number
  /** Distorsión de los rayos */
  distortion?: number
  /** Clases CSS adicionales */
  className?: string
  /** Habilitar animación de entrada */
  introAnimation?: boolean
}

export interface UniformValue {
  value: number | number[]
}

export interface Uniforms {
  iTime: UniformValue
  iResolution: UniformValue
  rayPos: UniformValue
  rayDir: UniformValue
  raysColor: UniformValue
  raysSpeed: UniformValue
  lightSpread: UniformValue
  rayLength: UniformValue
  pulsating: UniformValue
  fadeDistance: UniformValue
  saturation: UniformValue
  mousePos: UniformValue
  mouseInfluence: UniformValue
  noiseAmount: UniformValue
  distortion: UniformValue
  uIntro: UniformValue
}

export interface MousePosition {
  x: number
  y: number
}

export interface AnchorAndDirection {
  anchor: [number, number]
  dir: [number, number]
}
