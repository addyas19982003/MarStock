"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  full_name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock authentication for demo purposes
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call your API
    if (email && password) {
      const mockUser = {
        id: "1",
        email,
        full_name: "Utilisateur Test",
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } else {
      throw new Error("Email et mot de passe requis")
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    // Mock registration
    if (email && password && fullName) {
      const mockUser = {
        id: "1",
        email,
        full_name: fullName,
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } else {
      throw new Error("Tous les champs sont requis")
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
