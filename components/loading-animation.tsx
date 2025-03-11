"use client"

import { useEffect, useState } from "react"

interface LoadingAnimationProps {
  isLoading: boolean;
}

export default function LoadingAnimation({ isLoading }: LoadingAnimationProps) {
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-black/40 backdrop-blur-lg rounded-xl border border-white/10">
        {/* Pulsing circles */}
        <div className="flex items-center justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-4 h-4 rounded-full bg-cyan-500/80 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        
        {/* Text */}
        <div className="text-white font-medium text-center">
          <p>connecting to AI{dots}</p>
          <p className="text-xs mt-1 opacity-60">Please wait</p>
        </div>
      </div>
    </div>
  )
}