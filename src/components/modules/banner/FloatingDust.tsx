"use client"

import { useEffect, useRef } from 'react'

interface FloatingDustProps {
  particleCount?: number
  color?: string
  className?: string
}

class Particle {
  x: number = 0
  y: number = 0
  vx: number = 0
  vy: number = 0
  accelX: number = 0
  accelY: number = 0
  life: number = 2000
  maxLife: number = 2000
  alpha: number = 1
  size: number = 2

  update() {
    this.vx += this.accelX
    this.vy += this.accelY
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = `rgba(${color}, ${this.alpha})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }

  isAlive() {
    return this.life >= 0
  }
}

class ParticleSystem {
  particles: Particle[] = []
  updateHandler?: (particle: Particle) => void

  addParticle(particle: Particle) {
    this.particles.push(particle)
  }

  update() {
    this.particles.forEach((particle) => {
      particle.update()
      this.updateHandler && this.updateHandler(particle)
    })
  }

  onUpdate(fn: (particle: Particle) => void) {
    this.updateHandler = fn
  }
}

export default function FloatingDust({ 
  particleCount = 200, 
  color = '255, 255, 255',
  className = '' 
}: FloatingDustProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const systemRef = useRef<ParticleSystem | null>(null)
  const animationRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const setup = () => {
      canvas.width = width
      canvas.height = height
    }

    const system = new ParticleSystem()
    systemRef.current = system

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle()
      particle.x = Math.random() * width
      particle.y = Math.random() * height
      particle.life = Math.random() * 1000 + 1000
      particle.size = Math.random() * 0.8 + 0.3 // Tamaño entre 0.3-1.1px (más pequeñitos)
      particle.maxLife = particle.life
      system.addParticle(particle)
    }

    system.onUpdate((particle) => {
      if (!particle.isAlive()) {
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.vx = 0
        particle.vy = 0
        particle.life = Math.random() * 1000 + 1000
        particle.maxLife = particle.life
      }

      particle.life -= 10
      particle.accelX = (Math.random() - 0.5) * 0.02
      particle.accelY = (Math.random() - 0.5) * 0.02

      if (particle.life >= particle.maxLife / 2) {
        particle.alpha = (1 - particle.life / particle.maxLife) * 1 
      } else {
        particle.alpha = (particle.life / particle.maxLife) * 0.8
      }

      particle.update()
    })

    const render = () => {
      // Solo renderizar si está visible y la página está activa
      if (isVisibleRef.current && !isPausedRef.current) {
        // Clear with transparency
        ctx.clearRect(0, 0, width, height)

        // Draw particles
        ctx.globalCompositeOperation = 'lighter'
        system.particles.forEach((particle) => particle.draw(ctx, color))

        system.update()
      }
      
      animationRef.current = requestAnimationFrame(render)
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      setup()
    }

    // Intersection Observer para detectar visibilidad
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting
      },
      { 
        threshold: 0,
        rootMargin: '100px 0px 100px 0px'
      }
    )

    observer.observe(canvas)

    // Page Visibility API
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('resize', handleResize)
    
    setup()
    render()

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, color])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
