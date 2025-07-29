"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import MinistryHeader from "@/components/layout/ministry-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Users,
  Shield,
  Database,
  FileText,
  Activity,
  Bell,
  Download,
  Upload,
  BarChart3,
  Server,
  HardDrive,
  Clock,
  ArrowLeft,
  Crown,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { adminService } from "@/lib/admin-service"

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemStats()
  }, [])

  const fetchSystemStats = async () => {
    try {
      const systemStats = await adminService.getSystemStats()
      setStats(systemStats)
    } catch (error) {
      console.error("Error fetching system stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MinistryHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Crown className="h-8 w-8 mr-3 text-red-600" />
                Panneau d'Administration
              </h1>
              <p className="text-gray-600 mt-1">Gestion avancée du système et des utilisateurs</p>
            </div>
          </div>
          <Badge className="bg-red-100 text-red-800 px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            Accès Administrateur
          </Badge>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers}</div>
              <p className="text-blue-100 text-sm">{stats?.activeUsers} actifs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">En ligne</div>
              <p className="text-green-100 text-sm">{stats?.systemUptime}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalMateriels}</div>
              <p className="text-purple-100 text-sm">Matériels total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Stockage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.diskUsage}%</div>
              <p className="text-orange-100 text-sm">Espace utilisé</p>
            </CardContent>
          </Card>
        </div>

        {/* System Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Performance du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">CPU</span>
                  <span className="text-sm text-gray-500">{stats?.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats?.cpuUsage}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Mémoire</span>
                  <span className="text-sm text-gray-500">{stats?.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats?.memoryUsage}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Disque</span>
                  <span className="text-sm text-gray-500">{stats?.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${stats?.diskUsage}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/users">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-6 w-6 mr-3 text-blue-600" />
                  Gestion des Utilisateurs
                </CardTitle>
                <CardDescription>Gérer les comptes, rôles et permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers}</div>
                  <Badge className="bg-blue-100 text-blue-800">{stats?.activeUsers} actifs</Badge>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/audit">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="h-6 w-6 mr-3 text-green-600" />
                  Journal d'Audit
                </CardTitle>
                <CardDescription>Traçabilité des actions utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Dernière activité</div>
                  <Badge className="bg-green-100 text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Temps réel
                  </Badge>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/settings">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Settings className="h-6 w-6 mr-3 text-purple-600" />
                  Paramètres Système
                </CardTitle>
                <CardDescription>Configuration générale de l'application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Configuration</div>
                  <Badge className="bg-purple-100 text-purple-800">5 catégories</Badge>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Database className="h-6 w-6 mr-3 text-orange-600" />
                Sauvegardes
              </CardTitle>
              <CardDescription>Gestion des sauvegardes système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Dernière sauvegarde</div>
                <Badge className="bg-orange-100 text-orange-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Réussie
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-6 w-6 mr-3 text-indigo-600" />
                Rapports & Analytics
              </CardTitle>
              <CardDescription>Génération de rapports détaillés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Rapports disponibles</div>
                <Badge className="bg-indigo-100 text-indigo-800">
                  <TrendingUp className="h-3 w-3 mr-1" />4 types
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Bell className="h-6 w-6 mr-3 text-yellow-600" />
                Notifications
              </CardTitle>
              <CardDescription>Centre de notifications système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Notifications actives</div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />3 nouvelles
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Raccourcis vers les tâches administratives courantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Download className="h-6 w-6 mb-2" />
                <span className="text-sm">Exporter Données</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Importer Données</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Database className="h-6 w-6 mb-2" />
                <span className="text-sm">Nouvelle Sauvegarde</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Générer Rapport</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
