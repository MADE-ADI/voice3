"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AudioVisualizerProps {
  isListening: boolean
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    const barCount = 180
    const barWidth = (2 * Math.PI * radius) / barCount
    let animationFrameId: number

    const drawVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw outer circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * 2 * Math.PI
        const height = isListening ? Math.random() * 50 + 10 : 5

        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius
        const x2 = centerX + Math.cos(angle) * (radius + height)
        const y2 = centerY + Math.sin(angle) * (radius + height)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = `hsl(${(i / barCount) * 360}, 100%, 50%)`
        ctx.lineWidth = barWidth
        ctx.lineCap = "round"
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(drawVisualizer)
    }

    drawVisualizer()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isListening])

  return <canvas ref={canvasRef} width={300} height={300} className="w-[300px] h-[300px]" />
}

export default AudioVisualizer

