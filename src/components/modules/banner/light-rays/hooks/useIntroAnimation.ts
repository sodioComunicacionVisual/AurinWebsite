/**
 * useIntroAnimation Hook
 * Maneja la animación de entrada con ease-out
 */

import { useEffect, useRef } from 'react'
import type { Uniforms } from '../types'
import { INTRO_ANIMATION_DURATION } from '../constants'
import { easeOutCubic } from '../utils'

interface UseIntroAnimationOptions {
  enabled?: boolean
  duration?: number
}

export const useIntroAnimation = (
  uniformsRef: React.MutableRefObject<Uniforms | null>,
  options: UseIntroAnimationOptions = {}
): void => {
  const { enabled = true, duration = INTRO_ANIMATION_DURATION } = options
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!enabled || hasStarted.current || !uniformsRef.current) return

    hasStarted.current = true
    let startTime: number | null = null

    const animateIntro = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsedTime = currentTime - startTime
      let progress = Math.min(elapsedTime / duration, 1)

      progress = easeOutCubic(progress)

      if (uniformsRef.current) {
        uniformsRef.current.uIntro.value = progress
      }

      if (elapsedTime < duration) {
        requestAnimationFrame(animateIntro)
      }
    }

    requestAnimationFrame(animateIntro)
  }, [enabled, duration])
}
