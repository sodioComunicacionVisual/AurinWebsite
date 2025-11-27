"use client"

import type React from "react"
import { Mesh, Program, Renderer, Triangle } from "ogl"
import { useEffect, useRef } from "react"

// Types
import type { LightRaysProps, Uniforms, MousePosition } from "./types"

// Constants
import { DEFAULT_PROPS, MAX_DPR, MOBILE_ADJUSTMENTS, MOUSE_SMOOTHING_FACTOR } from "./constants"

// Utils
import { hexToRgb, getAnchorAndDir } from "./utils"

// Shaders
import { vertexShader, fragmentShader } from "./shaders"

// Hooks
import {
  useVisibility,
  usePageVisibility,
  useMobileDetection,
  useScrollOpacity,
  useMouseTracking,
  useIntroAnimation,
} from "./hooks"

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = DEFAULT_PROPS.raysOrigin,
  raysColor = DEFAULT_PROPS.raysColor,
  raysSpeed = DEFAULT_PROPS.raysSpeed,
  lightSpread = DEFAULT_PROPS.lightSpread,
  rayLength = DEFAULT_PROPS.rayLength,
  pulsating = DEFAULT_PROPS.pulsating,
  fadeDistance = DEFAULT_PROPS.fadeDistance,
  saturation = DEFAULT_PROPS.saturation,
  followMouse = DEFAULT_PROPS.followMouse,
  mouseInfluence = DEFAULT_PROPS.mouseInfluence,
  noiseAmount = DEFAULT_PROPS.noiseAmount,
  distortion = DEFAULT_PROPS.distortion,
  className = DEFAULT_PROPS.className,
  introAnimation = DEFAULT_PROPS.introAnimation,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<Uniforms | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const cleanupFunctionRef = useRef<(() => void) | null>(null)

  // Hooks
  const { isVisible } = useVisibility(containerRef)
  const { isPausedRef } = usePageVisibility()
  const isMobile = useMobileDetection()
  const scrollOpacity = useScrollOpacity(containerRef)
  const { mouseRef, smoothMouseRef } = useMouseTracking(containerRef, { enabled: followMouse })

  // Intro animation
  useIntroAnimation(uniformsRef, { enabled: introAnimation && isVisible })

  // WebGL initialization effect
  useEffect(() => {
    if (!isVisible || !containerRef.current) return

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current()
      cleanupFunctionRef.current = null
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return

      await new Promise((resolve) => setTimeout(resolve, 10))
      if (!containerRef.current) return

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, MAX_DPR),
        alpha: true,
      })
      rendererRef.current = renderer

      const gl = renderer.gl
      gl.canvas.style.width = "100%"
      gl.canvas.style.height = "100%"

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
      containerRef.current.appendChild(gl.canvas)

      const uniforms: Uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
        uIntro: { value: introAnimation ? 0 : 1 },
      }

      uniformsRef.current = uniforms

      const geometry = new Triangle(gl)
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms,
      })

      const mesh = new Mesh(gl, { geometry, program })
      meshRef.current = mesh

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return

        renderer.dpr = Math.min(window.devicePixelRatio, MAX_DPR)
        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current
        renderer.setSize(wCSS, hCSS)

        const dpr = renderer.dpr
        const w = wCSS * dpr
        const h = hCSS * dpr

        uniforms.iResolution.value = [w, h]

        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h)
        uniforms.rayPos.value = anchor
        uniforms.rayDir.value = dir
      }

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return
        }

        const shouldRender = isVisible && !isPausedRef.current

        if (shouldRender) {
          uniforms.iTime.value = t * 0.001

          if (followMouse && mouseInfluence > 0.0) {
            const smoothing = MOUSE_SMOOTHING_FACTOR
            smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing)
            smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing)

            uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y]
          }

          try {
            renderer.render({ scene: mesh })
          } catch (error) {
            console.warn("WebGL rendering error:", error)
            return
          }
        }

        animationIdRef.current = requestAnimationFrame(loop)
      }

      window.addEventListener("resize", updatePlacement)
      updatePlacement()
      animationIdRef.current = requestAnimationFrame(loop)

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
          animationIdRef.current = null
        }

        window.removeEventListener("resize", updatePlacement)

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas
            const loseContextExt = renderer.gl.getExtension("WEBGL_lose_context")
            if (loseContextExt) {
              loseContextExt.loseContext()
            }
            if (canvas?.parentNode) {
              canvas.parentNode.removeChild(canvas)
            }
          } catch (error) {
            console.warn("Error during WebGL cleanup:", error)
          }
        }

        rendererRef.current = null
        uniformsRef.current = null
        meshRef.current = null
      }
    }

    initializeWebGL()

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current()
        cleanupFunctionRef.current = null
      }
    }
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    introAnimation,
  ])

  // Update uniforms when props change
  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return

    const u = uniformsRef.current
    const renderer = rendererRef.current

    u.raysColor.value = hexToRgb(raysColor)
    u.raysSpeed.value = raysSpeed
    u.lightSpread.value = isMobile ? lightSpread * MOBILE_ADJUSTMENTS.lightSpreadMultiplier : lightSpread
    u.rayLength.value = isMobile ? rayLength * MOBILE_ADJUSTMENTS.rayLengthMultiplier : rayLength
    u.pulsating.value = pulsating ? 1.0 : 0.0
    u.fadeDistance.value = fadeDistance
    u.saturation.value = saturation
    u.mouseInfluence.value = mouseInfluence
    u.noiseAmount.value = noiseAmount
    u.distortion.value = distortion

    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current
    const dpr = renderer.dpr
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr)
    u.rayPos.value = anchor
    u.rayDir.value = dir
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion,
    isMobile,
  ])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none z-[3] overflow-hidden relative ${className}`.trim()}
      style={{
        opacity: scrollOpacity,
        transition: 'opacity 0.1s ease-out'
      }}
    />
  )
}

export default LightRays
