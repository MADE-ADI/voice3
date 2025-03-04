"use client"

import { useEffect, useRef } from "react"

interface Point {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  baseZ: number
}

interface WaveSphereVisualizerProps {
  isListening: boolean
}

export default function WaveSphereVisualizer({ isListening }: WaveSphereVisualizerProps) {
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

    // Create points on a sphere
    const points: Point[] = []
    const numPoints = 2000
    const radius = 120
    const noiseScale = 0.02
    const noiseSpeed = 0.001
    let time = 0

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
      })
    }

    // Simplex noise approximation
    function noise(x: number, y: number, z: number) {
      const t = time * noiseSpeed
      return Math.sin(x * noiseScale + t) * Math.cos(y * noiseScale + t) * Math.sin(z * noiseScale + t)
    }

    function animate() {
      if (!canvas || !ctx) return

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sort points by z-index for pseudo-3D effect
      const sortedPoints = [...points].sort((a, b) => b.z - a.z)

      // Update and draw points
      sortedPoints.forEach((point, i) => {
        if (isListening) {
          // Add noise-based movement when listening
          const intensity = 15
          const noiseValue = noise(point.baseX, point.baseY, point.baseZ)

          point.x = point.baseX + noiseValue * intensity
          point.y = point.baseY + noiseValue * intensity
          point.z = point.baseZ + noiseValue * intensity
        } else {
          // Gradually return to base position when not listening
          point.x += (point.baseX - point.x) * 0.1
          point.y += (point.baseY - point.y) * 0.1
          point.z += (point.baseZ - point.z) * 0.1
        }

        // Project 3D point to 2D
        const scale = 400 / (400 - point.z)
        const x2d = point.x * scale + centerX
        const y2d = point.y * scale + centerY

        // Draw point
        const size = Math.max(0.5, ((point.z + radius) / (radius * 2)) * 2)

        // Create gradient color based on z-position
        const hue = ((point.z + radius) / (radius * 2)) * 60 + 240 // Blue to purple
        const lightness = 50 + ((point.z + radius) / (radius * 2)) * 20
        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, 0.8)`

        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fill()

        // Connect nearby points
        sortedPoints.slice(i + 1).forEach((point2) => {
          const dx = point.x - point2.x
          const dy = point.y - point2.y
          const dz = point.z - point2.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < 40) {
            const x2d2 = point2.x * scale + centerX
            const y2d2 = point2.y * scale + centerY

            const alpha = (1 - dist / 40) * 0.2
            ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(x2d, y2d)
            ctx.lineTo(x2d2, y2d2)
            ctx.stroke()
          }
        })
      })

      time++
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [isListening])

  return <canvas ref={canvasRef} width={400} height={400} className="w-[400px] h-[400px]" />
}

