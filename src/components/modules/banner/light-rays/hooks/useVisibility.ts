/**
 * useVisibility Hook
 * Maneja la visibilidad del componente usando Intersection Observer
 */

import { useEffect, useRef, useState } from 'react'
import { OBSERVER_CONFIG } from '../constants'

interface UseVisibilityOptions {
  rootMargin?: string
  threshold?: number
}

interface UseVisibilityReturn {
  isVisible: boolean
  observerRef: React.RefObject<IntersectionObserver | null>
}

export const useVisibility = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseVisibilityOptions = {}
): UseVisibilityReturn => {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const { 
    rootMargin = OBSERVER_CONFIG.rootMargin, 
    threshold = OBSERVER_CONFIG.threshold 
  } = options

  useEffect(() => {
    if (!containerRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsVisible(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observerRef.current.observe(containerRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [rootMargin, threshold])

  return { isVisible, observerRef }
}
