"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info, Eye, EyeOff, Lock, Mail, Crown, UserCheck, Users, Loader2 } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import Image from "next/image"
import Link from "next/link"

function LoginForm() {
  // États pour la gestion du formulaire
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Hooks personnalisés
  const { signIn } = useAuth()
  const { toast } = useToast()

  // Charger les données sauvegardées au montage du composant
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validation côté client
      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs")
      }

      if (password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères")
      }

      // Tentative de connexion
      await signIn(email, password)

      // Sauvegarder l'email si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      // Notification de succès
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le système de gestion",
      })
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour remplir automatiquement les identifiants de démonstration
  const fillDemoCredentials = (role: "admin" | "manager" | "user") => {
    const credentials = {
      admin: { email: "admin@ministere.gov.ma", password: "password123" },
      manager: { email: "manager@ministere.gov.ma", password: "password123" },
      user: { email: "user@ministere.gov.ma", password: "password123" },
    }
    setEmail(credentials[role].email)
    setPassword(credentials[role].password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative">
      {/* Éléments décoratifs d'arrière-plan simplifiés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* En-tête avec logo officiel */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/logo-ministere.png"
                alt="Royaume du Maroc - Ministère TNRA"
                width={300}
                height={120}
                className="rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                priority
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full shadow-lg"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-800 bg-clip-text text-transparent mb-3">
            Système de Gestion Intégré
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Plateforme sécurisée pour la gestion des marchés, stocks et ressources humaines
          </p>
        </div>

        {/* Carte de connexion principale */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 hover:shadow-3xl transition-all duration-300">
          <CardHeader className="space-y-1 pb-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Connexion Sécurisée</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Accédez à votre espace de travail professionnel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Adresse email professionnelle
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@ministere.gov.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-11 text-base border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 pl-11 pr-11 text-base border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Affichage des erreurs */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Bouton de connexion */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                disabled={loading}
              >
                              {loading ? (
                <LoadingSpinner size="sm" text="Connexion en cours..." />
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Se connecter
                </>
              )}
              </Button>
            </form>

            {/* Lien vers l'inscription */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Nouveau membre de l'équipe ?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Section des comptes de démonstration */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-800">Comptes de démonstration</span>
              </div>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("admin")}
                  className="w-full text-sm bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-300 rounded-lg h-10"
                >
                  <Crown className="h-4 w-4 mr-2" />👑 Administrateur Système (Accès complet)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("manager")}
                  className="w-full text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 rounded-lg h-10"
                >
                  <Users className="h-4 w-4 mr-2" />
                  🛡️ Gestionnaire (Lecture/Modification)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("user")}
                  className="w-full text-sm bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 rounded-lg h-10"
                >
                  <UserCheck className="h-4 w-4 mr-2" />👤 Utilisateur Standard (Lecture seule)
                </Button>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800 text-center">
                  <strong>Note:</strong> Ces comptes sont configurés pour la démonstration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pied de page */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-2">Système sécurisé avec chiffrement SSL/TLS</p>
          <p className="text-xs text-gray-400">
            © 2024 Royaume du Maroc - Ministère de la Transition Numérique et de la Réforme de l'Administration
          </p>
          <p className="text-xs text-gray-400 mt-1">Tous droits réservés | Version 2.1.0</p>
        </div>
      </div>


    </div>
  )
}

export default function LoginPage() {
  return <LoginForm />
}
