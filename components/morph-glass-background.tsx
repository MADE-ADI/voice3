"use client"

import { useEffect, useRef } from "react"

interface Blob {
  x: number
  y: number
  radius: number
  xSpeed: number
  ySpeed: number
  angle: number
  angleSpeed: number
  points: number[]
  pointsVariation: number[]
}

export default function MorphGlassBackground() {
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

    // Create blobs
    const blobCount = 5
    const blobs: Blob[] = []

    for (let i = 0; i < blobCount; i++) {
      const radius = Math.random() * 100 + 100
      const pointCount = 8
      const points: number[] = []
      const pointsVariation: number[] = []

      for (let j = 0; j < pointCount; j++) {
        points.push(Math.random() * 0.5 + 0.75) // Point distance from center (0.75-1.25)
        pointsVariation.push(Math.random() * 0.04 - 0.02) // Variation speed
      }

      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        xSpeed: (Math.random() - 0.5) * 0.3,
        ySpeed: (Math.random() - 0.5) * 0.3,
        angle: 0,
        angleSpeed: Math.random() * 0.002 + 0.001,
        points,
        pointsVariation,
      })
    }

    // Animation variables
    let time = 0

    // Draw a single blob
    function drawBlob(blob: Blob) {
      // Update blob position
      blob.x += blob.xSpeed
      blob.y += blob.ySpeed

      // Bounce off edges
      if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
      if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
      if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
      if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius

      // Update angle
      blob.angle += blob.angleSpeed

      // Update points
      for (let i = 0; i < blob.points.length; i++) {
        blob.points[i] += blob.pointsVariation[i]

        // Keep points within bounds
        if (blob.points[i] < 0.75 || blob.points[i] > 1.25) {
          blob.pointsVariation[i] *= -1
        }
      }

      // Draw blob
      ctx.save()

      // Create path
      ctx.beginPath()

      const pointCount = blob.points.length

      for (let i = 0; i <= pointCount; i++) {
        const angle = blob.angle + (i % pointCount) * ((Math.PI * 2) / pointCount)
        const point = blob.points[i % pointCount]
        const x = blob.x + Math.cos(angle) * blob.radius * point
        const y = blob.y + Math.sin(angle) * blob.radius * point

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()

      // Create gradient
      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius * 1.5)

      // Assign colors based on blob index
      const colors = [
        ["rgba(138, 43, 226, 0.2)", "rgba(138, 43, 226, 0.05)"], // Purple
        ["rgba(75, 0, 130, 0.2)", "rgba(75, 0, 130, 0.05)"], // Indigo
        ["rgba(72, 61, 139, 0.2)", "rgba(72, 61, 139, 0.05)"], // Dark Slate Blue
        ["rgba(106, 90, 205, 0.2)", "rgba(106, 90, 205, 0.05)"], // Slate Blue
        ["rgba(123, 104, 238, 0.2)", "rgba(123, 104, 238, 0.05)"], // Medium Slate Blue
      ]

      const colorIndex = Math.floor(Math.random() * colors.length)

      gradient.addColorStop(0, colors[colorIndex][0])
      gradient.addColorStop(1, colors[colorIndex][1])

      ctx.fillStyle = gradient
      ctx.shadowColor = colors[colorIndex][0]
      ctx.shadowBlur = 15
      ctx.fill()

      // Add glass effect
      ctx.globalCompositeOperation = "overlay"
      ctx.beginPath()

      // Create highlight
      const highlightGradient = ctx.createLinearGradient(
        blob.x - blob.radius,
        blob.y - blob.radius,
        blob.x + blob.radius,
        blob.y + blob.radius,
      )

      highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
      highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = highlightGradient
      ctx.fill()

      ctx.restore()
    }

    // Create background
    function drawBackground() {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f0f1e")
      gradient.addColorStop(1, "#1a1a3a")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Animation loop
    function animate() {
      time += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      drawBackground()

      // Draw blobs
      blobs.forEach(drawBlob)

      // Add noise texture
      ctx.globalCompositeOperation = "overlay"
      ctx.fillStyle = "rgba(127, 127, 127, 0.1)"

      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 1

        ctx.fillRect(x, y, size, size)
      }

      ctx.globalCompositeOperation = "source-over"

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
}

