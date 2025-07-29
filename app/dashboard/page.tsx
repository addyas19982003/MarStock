"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import MinistryHeader from "@/components/layout/ministry-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  Users,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  BarChart3,
  Settings,
  Activity,
  FileText,
  Crown,
  Zap,
  Target,
  Award,
  Sparkles,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"
import Link from "next/link"
import { DashboardClient, type DashboardStats } from "@/lib/client/dashboard-client"

function DashboardContent() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null)

  // Fonction pour récupérer les statistiques
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const newStats = await DashboardClient.getDashboardStats()
      setStats(newStats)
      setLastUpdate(new Date())
      setIsOnline(true)
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      setIsOnline(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // Configuration des mises à jour automatiques
  useEffect(() => {
    // Première récupération
    fetchStats()

    // Mise à jour automatique toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000)
    setUpdateInterval(interval)

    // Nettoyage à la fermeture
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [fetchStats])

  // Vérification de la connectivité
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fonction pour forcer la mise à jour
  const handleRefresh = () => {
    fetchStats()
  }

  // Calcul du temps écoulé depuis la dernière mise à jour
  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return "Jamais"
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    return `${Math.floor(diff / 3600)}h`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <MinistryHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header avec statut temps réel */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow">
            <Sparkles className="h-5 w-5 mr-2 animate-spin" />
            Tableau de Bord Principal
            <Activity className="h-4 w-4 ml-2" />
            <Badge variant="secondary" className={`ml-3 ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} animate-bounce`}>
              <div className={`w-2 h-2 rounded-full mr-1 animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Badge>
          </div>
          
          {/* Barre de statut temps réel */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Dernière mise à jour: {getTimeSinceUpdate()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Centre de Contrôle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Gérez efficacement vos marchés, stocks et affectations avec notre solution intégrée de nouvelle génération
          </p>
        </div>

        {/* Enhanced Main Cards avec données temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="group hover-lift bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Target className="h-3 w-3 mr-1" />
                  ACTIF
                </Badge>
              </div>
              <CardTitle className="text-white text-xl font-bold">Gestion de Marché</CardTitle>
              <CardDescription className="text-blue-100">
                CRUD marchés, bandes de livraison et matériels
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <span className="flex items-center text-blue-100">
                  <FileText className="h-4 w-4 mr-2" />
                  Marchés actifs
                </span>
                <span className="font-bold text-white text-2xl">
                  {loading ? "..." : stats?.marches.actifs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-blue-100 text-sm">Budget total</span>
                <span className="font-bold text-white">
                  {loading ? "..." : `${(stats?.marches.budget_total || 0).toLocaleString()} DH`}
                </span>
              </div>
              <Link href="/marche">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Zap className="h-4 w-4 mr-2" />
                  Accéder au module
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover-lift bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Award className="h-3 w-3 mr-1" />
                  STOCK
                </Badge>
              </div>
              <CardTitle className="text-white text-xl font-bold">Gestion de Stock</CardTitle>
              <CardDescription className="text-green-100">
                Affectation, récupération et suivi des matériels
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <span className="flex items-center text-green-100">
                  <Package className="h-4 w-4 mr-2" />
                  Matériels disponibles
                </span>
                <span className="font-bold text-white text-2xl">
                  {loading ? "..." : stats?.stock.disponibles || 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-green-100 text-sm">Valeur totale</span>
                <span className="font-bold text-white">
                  {loading ? "..." : `${(stats?.stock.valeur_totale || 0).toLocaleString()} DH`}
                </span>
              </div>
              <Link href="/stock">
                <Button className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Zap className="h-4 w-4 mr-2" />
                  Accéder au module
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover-lift bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Users className="h-3 w-3 mr-1" />
                  RH
                </Badge>
              </div>
              <CardTitle className="text-white text-xl font-bold">Gestion Employés</CardTitle>
              <CardDescription className="text-purple-100">Gestion des employés et affectations</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <span className="flex items-center text-purple-100">
                  <Users className="h-4 w-4 mr-2" />
                  Employés actifs
                </span>
                <span className="font-bold text-white text-2xl">
                  {loading ? "..." : stats?.employes.actifs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-purple-100 text-sm">Salaire moyen</span>
                <span className="font-bold text-white">
                  {loading ? "..." : `${(stats?.employes.salaire_moyen || 0).toLocaleString()} DH`}
                </span>
              </div>
              <Link href="/employes">
                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Zap className="h-4 w-4 mr-2" />
                  Accéder au module
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover-lift bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Building className="h-3 w-3 mr-1" />
                  ADMIN
                </Badge>
              </div>
              <CardTitle className="text-white text-xl font-bold">Gestion Personnes</CardTitle>
              <CardDescription className="text-orange-100">Grades, directions, divisions, bureaux</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <span className="flex items-center text-orange-100">
                  <Building className="h-4 w-4 mr-2" />
                  Structures actives
                </span>
                <span className="font-bold text-white text-2xl">
                  {loading ? "..." : (stats?.personnes.total_directions || 0) + (stats?.personnes.total_divisions || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="text-orange-100 text-sm">Budget total</span>
                <span className="font-bold text-white">
                  {loading ? "..." : `${(stats?.personnes.budget_total || 0).toLocaleString()} DH`}
                </span>
              </div>
              <Link href="/personnes">
                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Zap className="h-4 w-4 mr-2" />
                  Accéder au module
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Statistics and Actions avec données temps réel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Statistics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
              <CardTitle className="text-lg font-bold flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Statistiques Générales
                <TrendingUp className="h-4 w-4 text-green-300 ml-auto animate-bounce" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
                <span className="text-gray-700 font-medium flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2 text-blue-500" />
                  Marchés actifs
                </span>
                <span className="font-bold text-blue-600 text-2xl">
                  {loading ? "..." : stats?.marches.actifs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-all duration-300">
                <span className="text-gray-700 font-medium flex items-center">
                  <Package className="h-4 w-4 mr-2 text-green-500" />
                  Matériels disponibles
                </span>
                <span className="font-bold text-green-600 text-2xl">
                  {loading ? "..." : stats?.stock.disponibles || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl border-l-4 border-purple-500 hover:shadow-md transition-all duration-300">
                <span className="text-gray-700 font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-500" />
                  Employés actifs
                </span>
                <span className="font-bold text-purple-600 text-2xl">
                  {loading ? "..." : stats?.employes.actifs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-100 rounded-xl border-l-4 border-orange-500 hover:shadow-md transition-all duration-300">
                <span className="text-gray-700 font-medium flex items-center">
                  <Building className="h-4 w-4 mr-2 text-orange-500" />
                  Directions
                </span>
                <span className="font-bold text-orange-600 text-2xl">
                  {loading ? "..." : stats?.personnes.total_directions || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Alerts avec données temps réel */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift">
            <CardHeader className="pb-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-xl">
              <CardTitle className="text-lg font-bold flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
                </div>
                Alertes & Notifications
                <Badge variant="destructive" className="ml-auto bg-red-500 animate-bounce">
                  {loading ? "..." : (stats?.alertes.stock_critique || 0) + (stats?.alertes.livraisons_retard || 0)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-red-50 to-pink-100 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-all duration-300">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800">Stock critique</p>
                  <p className="text-xs text-red-600">
                    {loading ? "..." : `${stats?.alertes.stock_critique || 0} matériels en alerte`}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl border-l-4 border-amber-500 hover:shadow-md transition-all duration-300">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5 animate-spin" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-800">Livraisons en retard</p>
                  <p className="text-xs text-amber-600">
                    {loading ? "..." : `${stats?.alertes.livraisons_retard || 0} livraisons en retard`}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 animate-bounce" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-800">Maintenances requises</p>
                  <p className="text-xs text-blue-600">
                    {loading ? "..." : `${stats?.alertes.maintenances_requises || 0} maintenances à effectuer`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-xl">
              <CardTitle className="text-lg font-bold flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Settings className="h-5 w-5 text-white animate-spin" />
                </div>
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <Link href="/marche">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-medium h-12 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Nouveau Marché
                </Button>
              </Link>
              <Link href="/stock">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 hover:from-green-100 hover:to-emerald-200 text-green-700 font-medium h-12 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Package className="h-5 w-5 mr-3" />
                  Nouvelle Affectation
                </Button>
              </Link>
              <Link href="/employes">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gradient-to-r from-purple-50 to-violet-100 border-purple-200 hover:from-purple-100 hover:to-violet-200 text-purple-700 font-medium h-12 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Ajouter Employé
                </Button>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-red-50 to-pink-100 border-red-200 hover:from-red-100 hover:to-pink-200 text-red-700 font-medium h-12 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Crown className="h-5 w-5 mr-3 animate-pulse" />
                    Panneau Admin
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
