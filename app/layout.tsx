import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Assistant - Purple Morphglass",
  description: "AI Assistant interface with purple morphglass gradient theme",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/noise.png" as="image" />
      </head>
      <body className={`${inter.className} overflow-hidden animate-subtle-gradient`}>{children}</body>
    </html>
  )
}



import './globals.css'