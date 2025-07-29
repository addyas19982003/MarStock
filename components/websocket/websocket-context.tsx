"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WebSocketContextType {
  isConnected: boolean
  sendMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected] = useState(true) // Mock connection
  const { toast } = useToast()

  const sendMessage = (message: any) => {
    // Mock WebSocket message sending
    console.log("WebSocket message:", message)

    if (message.type === "notification") {
      toast({
        title: message.title,
        description: message.message,
        variant: message.variant || "default",
      })
    }
  }

  return <WebSocketContext.Provider value={{ isConnected, sendMessage }}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
