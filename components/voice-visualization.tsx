"use client"

import { useEffect, useRef } from "react"

interface VoiceVisualizationProps {
  isListening: boolean
}

export default function VoiceVisualization({ isListening }: VoiceVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Center of the canvas
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Sphere settings
    const radius = Math.min(centerX, centerY) * 0.8
    const particleCount = 2000
    const particles: Particle[] = []

    // Create particles in a spherical distribution
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 1 + 0.5,
        color: getParticleColor(phi),
        baseX: x,
        baseY: y,
        baseZ: z,
      })
    }

    function getParticleColor(phi: number) {
      const t = phi / Math.PI
      const value = Math.floor(255 * t)
      return `rgb(${value},${value},${value})`
    }

    // Animation
    let animationFrameId: number
    let rotationAngle = 0
    let pulsePhase = 0

    const animate = () => {
      rotationAngle += 0.005
      pulsePhase += 0.05
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Sort particles by z-index for pseudo-3D effect
      const sortedParticles = particles.sort((a, b) => b.z - a.z)

      // Draw particles
      for (let i = 0; i < sortedParticles.length; i++) {
        const p = sortedParticles[i]

        // Apply pulsing effect when listening
        if (isListening) {
          const pulseFactor = Math.sin(pulsePhase) * 0.05 + 1
          p.x = p.baseX * pulseFactor
          p.y = p.baseY * pulseFactor
          p.z = p.baseZ * pulseFactor
        } else {
          p.x = p.baseX
          p.y = p.baseY
          p.z = p.baseZ
        }

        // Rotate particles
        const rotatedX = p.x * Math.cos(rotationAngle) - p.z * Math.sin(rotationAngle)
        const rotatedZ = p.x * Math.sin(rotationAngle) + p.z * Math.cos(rotationAngle)

        // Project 3D coordinates to 2D
        const scale = 400 / (400 - rotatedZ)
        const x2d = rotatedX * scale + centerX
        const y2d = p.y * scale + centerY

        // Draw particle
        ctx.beginPath()
        ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      // Draw pulsing rings when listening
      if (isListening) {
        for (let i = 0; i < 3; i++) {
          const ringRadius = radius * (1 + i * 0.1) * (Math.sin(pulsePhase + (i * Math.PI) / 3) * 0.05 + 1)
          ctx.beginPath()
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - i * 0.03})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isListening])

  return <canvas ref={canvasRef} className="w-[300px] h-[300px]" />
}

interface Particle {
  x: number
  y: number
  z: number
  size: number
  color: string
  baseX: number
  baseY: number
  baseZ: number
}

