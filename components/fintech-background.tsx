"use client"

import { useEffect, useRef } from "react"

export default function FintechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    // Animation variables
    let time = 0
    const waveCount = 5
    const waves = Array.from({ length: waveCount }, (_, i) => ({
      amplitude: 25 + Math.random() * 20,
      period: 200 + Math.random() * 50,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.01,
      color:
        i % 2 === 0
          ? `rgba(103, 58, 183, ${0.1 + (i / waveCount) * 0.15})`
          : // Purple
            `rgba(33, 150, 243, ${0.1 + (i / waveCount) * 0.15})`, // Blue
      y: canvas.height * (0.5 + (i - waveCount / 2) * 0.15),
    }))

    // Create gradient background
    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0a29")
      gradient.addColorStop(1, "#1a1a3a")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw a single wave
    function drawWave(wave: any) {
      ctx.beginPath()

      // Start at the left edge
      ctx.moveTo(0, wave.y)

      // Draw the wave across the canvas
      for (let x = 0; x < canvas.width; x += 5) {
        const dx = x / wave.period
        const y = wave.y + Math.sin(dx + wave.phase + time * wave.speed) * wave.amplitude
        ctx.lineTo(x, y)
      }

      // Complete the path to fill the wave
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()

      // Fill the wave
      ctx.fillStyle = wave.color
      ctx.fill()
    }

    // Add some floating particles
    const particleCount = 50
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
    }))

    function drawParticles() {
      particles.forEach((particle) => {
        // Move particle upward
        particle.y -= particle.speed

        // Reset if it goes off the top
        if (particle.y < -10) {
          particle.y = canvas.height + 10
          particle.x = Math.random() * canvas.width
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      })
    }

    // Animation loop
    function animate() {
      time += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      drawBackground()

      // Draw waves
      waves.forEach(drawWave)

      // Draw particles
      drawParticles()

      // Add subtle glow effect
      const glow = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
      )
      glow.addColorStop(0, "rgba(103, 58, 183, 0.1)")
      glow.addColorStop(1, "rgba(103, 58, 183, 0)")

      ctx.fillStyle = glow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
}

