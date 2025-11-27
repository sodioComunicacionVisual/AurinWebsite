/**
 * useScrollOpacity Hook
 * Calcula la opacidad basada en la posición de scroll del elemento
 */

import { useEffect, useState } from 'react'
import { calculateScrollOpacity } from '../utils'

export const useScrollOpacity = (
  containerRef: React.RefObject<HTMLDivElement | null>
): number => {
  const [scrollOpacity, setScrollOpacity] = useState(1)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false
            return
          }

          const rect = containerRef.current.getBoundingClientRect()
          const opacity = calculateScrollOpacity(rect)
          setScrollOpacity(opacity)
          ticking = false
        })
        ticking = true
      }
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollOpacity
}
