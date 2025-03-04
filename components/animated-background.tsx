"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
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

    // Create gradient points
    const points = [
      { x: 0, y: 0, color: "#5F21B7" }, // Purple
      { x: canvas.width, y: 0, color: "#1A1A2E" }, // Dark blue
      { x: 0, y: canvas.height, color: "#2A0E4F" }, // Deep purple
      { x: canvas.width, y: canvas.height, color: "#0D0D14" }, // Very dark blue
    ]

    // Animation variables
    let tick = 0
    const noise = new Array(points.length).fill(0).map(() => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    }))

    // Simplex noise approximation for smooth movement
    function noise2D(x: number, y: number) {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255

      const sin = Math.sin(X * 0.01 + Y * 0.005 + tick * 0.002) * 0.5 + 0.5
      const cos = Math.cos(X * 0.005 + Y * 0.01 + tick * 0.001) * 0.5 + 0.5

      return (sin + cos) / 2
    }

    function animate() {
      tick++

      // Update point positions with noise
      points.forEach((point, i) => {
        const nx = noise[i].x + tick * 0.005
        const ny = noise[i].y + tick * 0.005

        const dx = noise2D(nx, ny) * 40 - 20
        const dy = noise2D(ny, nx) * 40 - 20

        point.x += dx * 0.05
        point.y += dy * 0.05

        // Keep points within bounds with some overflow allowed
        const margin = 200
        point.x = Math.max(-margin, Math.min(canvas.width + margin, point.x))
        point.y = Math.max(-margin, Math.min(canvas.height + margin, point.y))
      })

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width,
      )

      gradient.addColorStop(0, "#2A0E4F")
      gradient.addColorStop(0.5, "#14082A")
      gradient.addColorStop(1, "#0D0D14")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the moving gradient overlay
      drawGradientMesh(ctx, points)

      requestAnimationFrame(animate)
    }

    function drawGradientMesh(ctx: CanvasRenderingContext2D, points: any[]) {
      const width = canvas.width
      const height = canvas.height
      const resolution = 20
      const cellWidth = width / resolution
      const cellHeight = height / resolution

      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const px = x * cellWidth
          const py = y * cellHeight

          // Calculate color based on distance to each point
          let totalWeight = 0
          const color = { r: 0, g: 0, b: 0 }

          points.forEach((point) => {
            const dx = point.x - px
            const dy = point.y - py
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Inverse square weight
            const weight = 1 / (1 + distance * 0.001)
            totalWeight += weight

            // Parse color
            const hex = point.color.replace("#", "")
            const r = Number.parseInt(hex.substring(0, 2), 16)
            const g = Number.parseInt(hex.substring(2, 4), 16)
            const b = Number.parseInt(hex.substring(4, 6), 16)

            color.r += r * weight
            color.g += g * weight
            color.b += b * weight
          })

          // Normalize color
          color.r = Math.floor(color.r / totalWeight)
          color.g = Math.floor(color.g / totalWeight)
          color.b = Math.floor(color.b / totalWeight)

          const alpha = 0.05 + (Math.sin(tick * 0.01 + x * 0.2 + y * 0.1) * 0.5 + 0.5) * 0.1

          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
          ctx.fillRect(px, py, cellWidth + 1, cellHeight + 1)
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
}

