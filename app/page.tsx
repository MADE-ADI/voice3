"use client"

import { useState } from "react"
import { ArrowLeft, Menu, MessageCircle } from "lucide-react"
import AnimatedListeningText from "@/components/animated-listening-text"
import AnimatedMicButton from "@/components/animated-mic-button"
import AnimatedTypingText from "@/components/animated-typing-text"
import CancelButton from "@/components/cancel-button"
import MorphGlassBackground from "@/components/morph-glass-background"
// Import the new component
import AIFaceVisualization from "@/components/ai-face-visualization"


import { useConversation } from '@11labs/react';
import { useCallback } from 'react';

export default function VoiceAssistantUI() {
  const [isListening, setIsListening] = useState(false)

  // const startListening = () => {
  //   setIsListening(true)
  // }

  // const stopListening = () => {
  //   setIsListening(false)
  // }



  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });
  const startListening = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start the conversation with your agent
      setIsListening(true)
      await conversation.startSession({
        agentId: 'hrMRsPSpqEqAOOD1qflP', // Replace with your agent ID
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);
  const stopListening = useCallback(async () => {
    await conversation.endSession();
    setIsListening(false)
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
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-white text-lg font-medium">
            <AnimatedTypingText text="Can I help you today?" />
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
            <Menu size={24} />
          </button>
        </div>

        {/* Voice Visualization */}
        <div className="flex flex-col justify-center items-center h-[500px] mt-8 relative z-10">
          {/* Replace the VoiceVisualization component with AIFaceVisualization */}
          {/* Change this: */}
          {/* <VoiceVisualization isListening={isListening} /> */}
          {/* To this: */}
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
          <AnimatedMicButton isActive={isListening} onClick={startListening} />
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

