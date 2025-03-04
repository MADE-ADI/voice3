"use client"

import { useState, useEffect } from "react"

export default function AnimatedListeningText() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-white text-lg font-medium">
      Maia is listening<span className="inline-block w-8">{dots}</span>
    </div>
  )
}

