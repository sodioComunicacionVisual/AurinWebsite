/**
 * LightRays Module Utilities
 * Funciones de utilidad para el componente LightRays
 */

import type { RaysOrigin, AnchorAndDirection } from './types'
import { OUTSIDE_FACTOR } from './constants'

/**
 * Convierte un color hexadecimal a valores RGB normalizados (0-1)
 * @param hex - Color en formato hexadecimal (#RRGGBB)
 * @returns Tupla con valores RGB normalizados
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m
    ? [
        Number.parseInt(m[1], 16) / 255,
        Number.parseInt(m[2], 16) / 255,
        Number.parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1]
}

/**
 * Calcula el punto de anclaje y la dirección de los rayos según el origen especificado
 * @param origin - Origen de los rayos
 * @param w - Ancho del canvas en píxeles
 * @param h - Alto del canvas en píxeles
 * @returns Objeto con anchor (punto de origen) y dir (dirección)
 */
export const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number
): AnchorAndDirection => {
  const outside = OUTSIDE_FACTOR

  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0, 1] }
    case "top-right":
      return { anchor: [w, -outside * h], dir: [0, 1] }
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] }
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] }
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] }
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] }
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] }
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] }
  }
}

/**
 * Crea una función de ease-out cúbico
 * @param progress - Progreso de 0 a 1
 * @returns Valor con ease aplicado
 */
export const easeOutCubic = (progress: number): number => {
  return 1 - Math.pow(1 - progress, 3)
}

/**
 * Calcula la opacidad basada en la posición de scroll
 * @param rect - DOMRect del elemento
 * @returns Valor de opacidad de 0 a 1
 */
export const calculateScrollOpacity = (rect: DOMRect): number => {
  if (rect.top >= 0) {
    return 1
  }
  
  const scrollProgress = Math.abs(rect.top) / rect.height
  return Math.max(0, 1 - scrollProgress)
}
