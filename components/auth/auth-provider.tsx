"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

// Interface User compatible avec le service d'authentification
interface User {
  id: number
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'user'
  department?: string
  phone?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const user = await authService.signIn(email, password)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const user = await authService.signUp(email, password, fullName)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      throw error
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
