"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedSpotlightProps {
  children: React.ReactNode
  className?: string
  size?: number
  duration?: number
  color?: string
}

export function AnimatedSpotlight({
  children,
  className,
  size = 200,
  duration = 4000,
  color = "rgba(59, 130, 246, 0.15)",
}: AnimatedSpotlightProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const animate = () => {
      // ランダムな位置を生成（パーセンテージ）
      const newX = Math.random() * 100
      const newY = Math.random() * 100
      setPosition({ x: newX, y: newY })
    }

    // 初期アニメーション
    animate()

    // 定期的にアニメーション
    const interval = setInterval(animate, duration)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* アニメーションスポットライト */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-[4000ms] ease-in-out"
        style={{
          background: `radial-gradient(${size}px circle at ${position.x}% ${position.y}%, ${color} 0%, transparent 70%)`,
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
