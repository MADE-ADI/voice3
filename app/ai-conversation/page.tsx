"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Menu, MessageCircle } from "lucide-react"
import AnimatedListeningText from "@/components/animated-listening-text"
import AnimatedMicButton from "@/components/animated-mic-button"
import AnimatedTypingText from "@/components/animated-typing-text"
import CancelButton from "@/components/cancel-button"
import MorphGlassBackground from "@/components/morph-glass-background"
// Import the new component
import AIFaceVisualization from "@/components/ai-face-visualization"
import Link from "next/link" // Add this import
import LoadingAnimation from "@/components/loading-animation";

import { useConversation } from '@11labs/react';
import { useCallback } from 'react';

export default function VoiceAssistantUI() {
  const [isListening, setIsListening] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  // Pre-initialize 11labs connection
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      setSessionReady(true);
    },
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => {
      console.log('Message:', message);
      // When we get first message, stop loading
      setIsLoading(false);
      // Handle AI message response here
      if (message.content) {
        setAiResponse(message.content);
      }
    },
    onError: (error) => {
      console.error('Error:', error);
      setIsLoading(false);
    },
  });

  // Request mic permission on component mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .catch(error => console.error('Mic permission error:', error));
  }, []);

  const startListening = useCallback(() => {
    // Immediately show visual feedback and loading
    setIsListening(true);
    setIsInitiating(true);
    setIsLoading(true);
    
    // Start session with small timeout to allow UI to update first
    setTimeout(() => {
      conversation.startSession({
        agentId: 'EAcp5h44XI0gTuNmMpJG',
      }).then(() => {
        setIsInitiating(false);
        // Keep loading true until first message
      }).catch(error => {
        console.error('Session start error:', error);
        setIsListening(false);
        setIsInitiating(false);
        setIsLoading(false);
      });
    }, 50);
  }, [conversation]);

  const stopListening = useCallback(async () => {
    setIsListening(false);
    setIsLoading(false);
    await conversation.endSession();
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

        {/* Loading Animation - This appears above everything */}
        <LoadingAnimation isLoading={isLoading} />

        {/* Voice Visualization */}
        <div className="flex flex-col justify-center items-center h-[500px] mt-8 relative z-10">
          <AIFaceVisualization isListening={isListening} isInitiating={isInitiating} />
          {isListening && !isLoading && (
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
          <AnimatedMicButton 
            isActive={isListening} 
            onClick={startListening} 
            disabled={isInitiating} 
          />
          <CancelButton onClick={stopListening} disabled={isInitiating} />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
          <div className="w-32 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </main>
  )
}

