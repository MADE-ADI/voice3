"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface CancelButtonProps {
  onClick: () => void
}

export default function CancelButton({ onClick }: CancelButtonProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    onClick()

    // Reset the button state after a short delay
    setTimeout(() => {
      setIsClicked(false)
    }, 300)
  }

  return (
    <button
      className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-300 ${
        isClicked ? "bg-red-500" : "bg-gray-800/40"
      }`}
      onClick={handleClick}
    >
      <X size={24} className="text-white" />
    </button>
  )
}

