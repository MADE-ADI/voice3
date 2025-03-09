import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zhorra - Your AI Assistant",
  description: "Talk, chat, and interact with Zhorra, your intelligent AI assistant for conversations and information.",
  keywords: ["AI assistant", "Zhorra", "voice chat", "AI conversation", "AI terminal"],
  authors: [{ name: "Zhorra Team" }],
  openGraph: {
    title: "Zhorra - Your AI Assistant",
    description: "Talk, chat, and interact with Zhorra, your intelligent AI assistant for conversations and information.",
    url: "https://app.zhorra-ai.com/",
    siteName: "Zhorra",
    // images: [
    //   {
    //     url: "/og-image.jpg", // You'll need to create this image
    //     width: 1200,
    //     height: 630,
    //     alt: "Zhorra AI Assistant",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Zhorra - Your AI Assistant",
  //   description: "Talk, chat, and interact with Zhorra, your intelligent AI assistant for conversations and information.",
  //   images: ["/og-image.jpg"], // Same as OpenGraph image
  // },
  // icons: {
  //   icon: "/favicon.ico",
  //   apple: "/apple-icon.png",
  //   shortcut: "/shortcut-icon.png",
  // },
  // manifest: "/site.webmanifest",
  // themeColor: "#3a0647",
  // viewport: "width=device-width, initial-scale=1.0",
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