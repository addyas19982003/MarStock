"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose: () => void
}

export function Toast({ id, title, description, variant = "default", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg animate-in slide-in-from-top-2",
        variant === "destructive" ? "border-red-200 bg-red-50 text-red-900" : "border-gray-200 bg-white text-gray-900",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
        </div>
        <button
          onClick={onClose}
          className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    const handleToast = (event: CustomEvent<Omit<ToastProps, "id" | "onClose">>) => {
      const id = Date.now().toString()
      const toast: ToastProps = {
        ...event.detail,
        id,
        onClose: () => removeToast(id),
      }
      setToasts((prev) => [...prev, toast])
    }

    window.addEventListener("show-toast", handleToast as EventListener)
    return () => window.removeEventListener("show-toast", handleToast as EventListener)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  )
}

export function useToast() {
  const toast = (props: Omit<ToastProps, "id" | "onClose">) => {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: props }))
  }

  return { toast }
}
