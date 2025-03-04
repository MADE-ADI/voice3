"use client"

import { Mic } from "lucide-react"

interface AnimatedMicButtonProps {
  isActive: boolean
  onClick: () => void
}

export default function AnimatedMicButton({ isActive, onClick }: AnimatedMicButtonProps) {
  return (
    <button className="relative w-20 h-20 flex items-center justify-center" onClick={onClick}>
      {/* Pulsating rings */}
      {isActive && (
        <>
          <div className="absolute w-full h-full rounded-full border-4 border-purple-500 animate-ping-slow"></div>
          <div className="absolute w-full h-full rounded-full border-4 border-purple-500 animate-ping-slow animation-delay-300"></div>
          <div className="absolute w-full h-full rounded-full border-4 border-purple-500 animate-ping-slow animation-delay-600"></div>
        </>
      )}

      {/* Main button */}
      <div
        className={`relative z-10 w-20 h-20 rounded-full ${isActive ? "bg-purple-600" : "bg-gray-800/40"} flex items-center justify-center transition-colors duration-300`}
      >
        <Mic size={32} className="text-white" />
      </div>
    </button>
  )
}

