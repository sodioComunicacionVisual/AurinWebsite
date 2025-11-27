/**
 * useMouseTracking Hook
 * Rastrea la posición del mouse con throttling para rendimiento
 */

import { useEffect, useRef } from 'react'
import type { MousePosition } from '../types'

interface UseMouseTrackingOptions {
  enabled?: boolean
}

interface UseMouseTrackingReturn {
  mouseRef: React.MutableRefObject<MousePosition>
  smoothMouseRef: React.MutableRefObject<MousePosition>
}

export const useMouseTracking = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseMouseTrackingOptions = {}
): UseMouseTrackingReturn => {
  const { enabled = true } = options
  
  const mouseRef = useRef<MousePosition>({ x: 0.5, y: 0.5 })
  const smoothMouseRef = useRef<MousePosition>({ x: 0.5, y: 0.5 })

  useEffect(() => {
    if (!enabled) return

    let ticking = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false
            return
          }

          const rect = containerRef.current.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width
          const y = (e.clientY - rect.top) / rect.height

          mouseRef.current = { x, y }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [enabled])

  return { mouseRef, smoothMouseRef }
}
