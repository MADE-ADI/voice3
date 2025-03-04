"use client"

import { useState, useEffect } from "react"

export default function AnimatedTypingText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let index = 0
    const intervalId = setInterval(() => {
      setDisplayText((current) => {
        if (index < text.length) {
          index++
          return text.slice(0, index)
        } else {
          clearInterval(intervalId)
          return current
        }
      })
    }, 100) // Adjust typing speed here

    return () => clearInterval(intervalId)
  }, [text])

  return (
    <div className="text-white text-lg font-medium">
      {displayText}
      <span className="animate-blink">|</span>
    </div>
  )
}

