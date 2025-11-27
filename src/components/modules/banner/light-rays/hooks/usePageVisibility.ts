/**
 * usePageVisibility Hook
 * Detecta cuando la pestaña del navegador está activa o inactiva
 */

import { useEffect, useRef, useState } from 'react'

interface UsePageVisibilityReturn {
  isPageVisible: boolean
  isPausedRef: React.MutableRefObject<boolean>
}

export const usePageVisibility = (): UsePageVisibilityReturn => {
  const [isPageVisible, setIsPageVisible] = useState(true)
  const isPausedRef = useRef(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden
      setIsPageVisible(!isHidden)
      isPausedRef.current = isHidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return { isPageVisible, isPausedRef }
}
