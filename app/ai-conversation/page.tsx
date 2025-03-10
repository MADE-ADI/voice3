"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, Menu, MessageCircle } from "lucide-react"
import AnimatedListeningText from "@/components/animated-listening-text"
import AnimatedMicButton from "@/components/animated-mic-button"
import AnimatedTypingText from "@/components/animated-typing-text"
import CancelButton from "@/components/cancel-button"
import MorphGlassBackground from "@/components/morph-glass-background"
import AIFaceVisualization from "@/components/ai-face-visualization"
import Link from "next/link"

import { useConversation } from '@11labs/react';

export default function VoiceAssistantUI() {
  const [isListening, setIsListening] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const sessionInitialized = useRef(false)

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      sessionInitialized.current = true;
    },
    onDisconnect: () => {
      console.log('Disconnected');
      sessionInitialized.current = false;
    },
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  // Only request microphone permission early, but don't initialize session
  useEffect(() => {
    const prepareVoiceAssistant = async () => {
      try {
        // Pre-request microphone permission when component loads
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsReady(true);
        // Don't pre-initialize session here
      } catch (error) {
        console.error('Failed to get microphone permission:', error);
      }
    };
    
    prepareVoiceAssistant();
    
    // Cleanup function
    return () => {
      if (sessionInitialized.current) {
        conversation.endSession();
      }
    };
  }, []);

  const startListening = useCallback((e) => {
    // Prevent any default animations or behaviors
    if (e) e.stopPropagation();
    
    // Update UI state synchronously for immediate feedback
    setIsListening(true);
    
    // Always start session for immediate response
    conversation.startSession({
      agentId: 'hrMRsPSpqEqAOOD1qflP',
    }).catch(error => {
      console.error('Failed to start conversation:', error);
      setIsListening(false);y
    });
  }, [conversation]);

  const stopListening = useCallback(() => {
    // Update UI immediately
    setIsListening(false);
    
    // End session completely when done
    conversation.endSession().catch(error => {
      console.error('Failed to end conversation:', error);
    });
    sessionInitialized.current = false;
  }, [conversation]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f1e] overflow-hidden">
      <MorphGlassBackground />

      <div className="relative w-full max-w-md h-[800px] overflow-hidden rounded-3xl backdrop-blur-xl border border-white/10">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/10"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 pt-6 relative z-10">
          <Link href="/">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div className="text-white text-lg font-medium">
            <AnimatedTypingText text="Can I help you today?" />
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
            <Menu size={24} />
          </button>
        </div>

        {/* Voice Visualization */}
        <div className="flex flex-col justify-center items-center h-[500px] mt-8 relative z-10">
          <AIFaceVisualization isListening={isListening} />
          {isListening && (
            <div className="mt-8">
              <AnimatedListeningText />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center gap-8 px-8 z-10">
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
            <MessageCircle size={24} />
          </button>
          {/* Use native button element for maximum responsiveness */}
          <div 
            onMouseDown={startListening} 
            onTouchStart={startListening} 
            className="touch-manipulation" // Add touch-action manipulation for faster mobile touch response
          >
            <AnimatedMicButton 
              isActive={isListening} 
              onClick={null} 
              disabled={!isReady} 
            />
          </div>
          <CancelButton onClick={stopListening} />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
          <div className="w-32 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </main>
  )
}

