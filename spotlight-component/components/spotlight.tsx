"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  children: React.ReactNode
  className?: string
  size?: number
  intensity?: number
  color?: string
}

export function Spotlight({
  children,
  className,
  size = 300,
  intensity = 0.8,
  color = "rgba(255, 255, 255, 0.1)",
}: SpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* スポットライト効果 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? intensity : 0,
          background: `radial-gradient(${size}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color} 0%, transparent 70%)`,
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
