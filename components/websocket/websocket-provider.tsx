"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WebSocketContextType {
  socket: WebSocket | null
  isConnected: boolean
  sendMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => {
      setIsConnected(true)
      setSocket(ws)
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      // Handle real-time notifications
      if (data.type === "notification") {
        toast({
          title: data.title,
          description: data.message,
          variant: data.variant || "default",
        })
      }

      // Handle data updates
      if (data.type === "update") {
        // Trigger re-fetch of data
        window.dispatchEvent(new CustomEvent("data-update", { detail: data }))
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      setSocket(null)
      console.log("WebSocket disconnected")
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    return () => {
      ws.close()
    }
  }, [toast])

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message))
    }
  }

  return <WebSocketContext.Provider value={{ socket, isConnected, sendMessage }}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
