"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface AIFaceVisualizationProps {
  isListening: boolean;
  isInitiating?: boolean;
}

export default function AIFaceVisualization({ isListening, isInitiating = false }: AIFaceVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!isListening) return

    let direction = 1
    let currentScale = 1
    const minScale = 0.98
    const maxScale = 1.02
    const scaleStep = 0.001

    const interval = setInterval(() => {
      if (currentScale >= maxScale) direction = -1
      if (currentScale <= minScale) direction = 1

      currentScale += scaleStep * direction
      setScale(currentScale)
    }, 50)

    return () => {
      clearInterval(interval)
      setScale(1)
    }
  }, [isListening])

  return (
    <div ref={containerRef} className="relative w-[300px] h-[300px] flex items-center justify-center">
      {/* Show immediate visual feedback when initiating */}
      {(isListening || isInitiating) && (
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
      )}
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl"></div>

      {/* Main AI face image */}
      <div
        className={`relative transition-transform duration-300 ease-in-out ${isListening ? "animate-float" : ""}`}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="relative w-[280px] h-[280px]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250304_140625_0000-XBV7sEo8gK5KYnC9qRZWEFjUGkJpM3.png"
            alt="AI Assistant Face"
            fill
            priority={true}
            sizes="280px"
            className="drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          />
        </div>
      </div>

      {/* Pulsing rings when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping-slow"></div>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/15 animate-ping-slow animation-delay-300"></div>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/10 animate-ping-slow animation-delay-600"></div>
        </>
      )}

      {/* Enhanced glow effect when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
        </>
      )}
    </div>
  )
}

