"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, ArrowUpRight, MoreVertical, Brain, MessageSquare, Image } from "lucide-react"
import { Button } from "@/components/ui-home/button"
import ShootingStars from "@/components/ShootingStars"
import Link from "next/link"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const typingTextRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const typingText = typingTextRef.current
    if (typingText) {
      const text = "How may I help you today?"
      let currentIndex = 0

      const typeText = () => {
        if (currentIndex < text.length) {
          typingText.textContent = text.slice(0, currentIndex + 1)
          currentIndex++
          setTimeout(typeText, 100) // Adjust typing speed here
        } else {
          setTimeout(resetTyping, 3000) // 3 seconds pause before restarting
        }
      }

      const resetTyping = () => {
        currentIndex = 0
        typingText.textContent = ""
        setTimeout(typeText, 500) // Short pause before restarting
      }

      typeText()
    }
    
    // Force document and html to be scrollable on all devices
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "auto";
    document.body.style.height = "100%";
    document.body.style.minHeight = "100vh";
    
    // Apply background to the body element to ensure it covers the entire viewport
    document.body.classList.add("bg-gradient-animated");
    
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.minHeight = "";
      document.body.classList.remove("bg-gradient-animated");
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background elements as fixed position overlays */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none z-0"></div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShootingStars />
      </div>
      
      {/* Main content - fully scrollable */}
      <div className="relative z-10 text-white flex-grow">
        <div className="container mx-auto px-4 py-6 md:py-12 lg:max-w-6xl">
          {/* Header with menu button */}
          <header className="mb-4 md:mb-8 sticky top-0 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </header>

          {/* Content layout - column on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row md:gap-12 md:items-start">
            {/* Main content section */}
            <div className="flex-1 mb-8 md:mb-0">
              {/* Main heading with typing animation */}
              <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                <span ref={typingTextRef} className="typing-text"></span>
                <span className="typing-cursor">|</span>
              </h1>

              {/* Action cards grid */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Talk with Bot */}
                <Link href="/ai-conversation" className="block col-span-1 md:col-span-2">
                  <div className="morphglass-card laser-border rounded-3xl p-6 text-white hover-lift relative group cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                      <div className="rounded-full bg-white/20 backdrop-blur-md p-3">
                        <Brain className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-medium mt-auto">Talk with Zhorra</h2>
                    <p className="mt-2 text-sm md:text-base text-gray-300">Have a conversation with our AI assistant</p>
                  </div>
                </Link>

                {/* Chat with Bot */}
                <Link href="https://t.me/+vRnu1S8CmJE5MWRl" className="block">
                  <div className="morphglass-card laser-border rounded-3xl p-6 text-white hover-lift relative group cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                      <div className="rounded-full bg-white/20 backdrop-blur-md p-3">
                        <MessageSquare className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-medium">Chat with Zhorra</h2>
                    <p className="mt-2 text-sm md:text-base text-gray-300">Quick text-based interactions</p>
                  </div>
                </Link>

                {/* Search by Image */}
                <div className="morphglass-card laser-border rounded-3xl p-6 text-white hover-lift relative group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="rounded-full bg-white/20 backdrop-blur-md p-3">
                      <Image className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-medium">Zhorra Terminal</h2>
                  <p className="mt-2 text-sm md:text-base text-gray-300">Upload an image to search</p>
                </div>
              </div>
            </div>

            {/* History sidebar - full width on mobile, right aligned on desktop */}
            <div className="w-full md:w-1/3 lg:w-1/4 mb-12 md:mb-0">
              {/* History section */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-medium text-purple-200">History</h3>
                <Button variant="link" className="text-purple-400 hover:text-white">
                  See all
                </Button>
              </div>

              {/* History items */}
              <div className="space-y-3">
                {historyItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-full bg-purple-900/30 backdrop-blur-md px-4 py-3 border border-purple-700/30 hover-lift"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${item.bgColor}`}>{item.icon}</div>
                      <p className="text-sm md:text-base text-purple-200 line-clamp-1">{item.text}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                      <MoreVertical className="h-5 w-5" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Extra padding at bottom to ensure scroll space */}
        <div className="h-32"></div>
      </div>
    </div>
  )
}

const historyItems = [
  {
    icon: <Brain className="h-4 w-4 text-purple-200" />,
    text: "I need some UI inspiration for dark...",
    bgColor: "bg-gradient-to-br from-purple-800/40 to-purple-900/40",
  },
  {
    icon: <MessageSquare className="h-4 w-4 text-purple-200" />,
    text: "Show me some color palettes for AI...",
    bgColor: "bg-gradient-to-br from-purple-700/40 to-purple-800/40",
  },
  {
    icon: <Image className="h-4 w-4 text-purple-200" />,
    text: "What are the best mobile apps 2023...",
    bgColor: "bg-gradient-to-br from-purple-600/40 to-purple-700/40",
  },
]

