/**
 * useMobileDetection Hook
 * Detecta si el dispositivo es móvil basado en el ancho de pantalla
 */

import { useEffect, useState } from 'react'
import { MOBILE_BREAKPOINT } from '../constants'

export const useMobileDetection = (breakpoint: number = MOBILE_BREAKPOINT): boolean => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
    
    const handleResize = () => setIsMobile(mediaQuery.matches)
    
    handleResize() // Initial check
    mediaQuery.addEventListener("change", handleResize)
    
    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [breakpoint])

  return isMobile
}
