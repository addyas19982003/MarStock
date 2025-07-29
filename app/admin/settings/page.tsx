"use client"

import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MinistryHeader } from "@/components/layout/ministry-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, ArrowLeft, Save, Shield, Bell, Database, Globe, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { adminService } from "@/lib/admin-service"
import { Toaster, useToast } from "@/components/ui/toast"
import type { SystemSettings } from "@/lib/types"

function SystemSettingsManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState<SystemSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const systemSettings = await adminService.getSystemSettings()
      setSettings(systemSettings)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (id: string, value: string) => {
    try {
      setSaving(true)
      await adminService.updateSystemSetting(id, value, user!.id)
      await adminService.addAuditLog({
        user_id: user!.id,
        user_name: user!.full_name,
        action: "update",
        resource: "system_settings",
        resource_id: id,
        details: `Paramètre système modifié: ${settings.find((s) => s.id === id)?.key} = ${value}`,
        ip_address: "192.168.1.100",
        user_agent: navigator.userAgent,
      })

      setSettings(settings.map((s) => (s.id === id ? { ...s, value, updated_at: new Date().toISOString() } : s)))
      toast({
        title: "Succès",
        description: "Paramètre mis à jour",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paramètre",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getSettingsByCategory = (category: string) => {
    return settings.filter((s) => s.category === category)
  }

  const SettingItem = ({ setting }: { setting: SystemSettings }) => {
    const [localValue, setLocalValue] = useState(setting.value)

    const handleSave = () => {
      if (localValue !== setting.value) {
        updateSetting(setting.id, localValue)
      }
    }

    const renderInput = () => {
      if (setting.value === "true" || setting.value === "false") {
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={localValue === "true"}
              onCheckedChange={(checked) => {
                const newValue = checked.toString()
                setLocalValue(newValue)
                updateSetting(setting.id, newValue)
              }}
            />
            <span className="text-sm text-gray-600">{localValue === "true" ? "Activé" : "Désactivé"}</span>
          </div>
        )
      }

      if (setting.key.includes("timeout") || setting.key.includes("attempts")) {
        return (
          <div className="flex space-x-2">
            <Input type="number" value={localValue} onChange={(e) => setLocalValue(e.target.value)} className="w-24" />
            <Button onClick={handleSave} size="sm" disabled={localValue === setting.value || saving}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )
      }

      return (
        <div className="flex space-x-2">
          <Input value={localValue} onChange={(e) => setLocalValue(e.target.value)} className="flex-1" />
          <Button onClick={handleSave} size="sm" disabled={localValue === setting.value || saving}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-base font-medium">{setting.key.replace(/_/g, " ").toUpperCase()}</Label>
              <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
              <div className="mt-3">{renderInput()}</div>
              <div className="mt-2 text-xs text-gray-500">
                Dernière modification: {new Date(setting.updated_at).toLocaleString("fr-FR")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MinistryHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-purple-600" />
                Paramètres Système
              </h1>
              <p className="text-gray-600 mt-1">Configuration générale de l'application</p>
            </div>
          </div>

          <Badge className="bg-purple-100 text-purple-800">
            <Settings className="h-4 w-4 mr-2" />
            {settings.length} paramètres
          </Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Général
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Sauvegarde
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Paramètres Généraux
                  </CardTitle>
                  <CardDescription>Configuration de base de l'application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory("general").map((setting) => (
                    <SettingItem key={setting.id} setting={setting} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Paramètres de Sécurité
                  </CardTitle>
                  <CardDescription>Configuration de la sécurité et de l'authentification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory("security").map((setting) => (
                    <SettingItem key={setting.id} setting={setting} />
                  ))}

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <h4 className="font-medium text-yellow-800">Attention</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Les modifications des paramètres de sécurité peuvent affecter l'accès des utilisateurs.
                      Assurez-vous de tester les changements avant de les appliquer en production.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Paramètres de Notifications
                  </CardTitle>
                  <CardDescription>Configuration des notifications système</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory("notifications").map((setting) => (
                    <SettingItem key={setting.id} setting={setting} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Paramètres de Sauvegarde
                  </CardTitle>
                  <CardDescription>Configuration des sauvegardes automatiques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory("backup").map((setting) => (
                    <SettingItem key={setting.id} setting={setting} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* System Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Informations Système</CardTitle>
            <CardDescription>Détails techniques de l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Version de l'application:</span>
                  <Badge>v2.1.0</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Base de données:</span>
                  <Badge variant="outline">PostgreSQL 14.2</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Serveur:</span>
                  <Badge variant="outline">Node.js 18.17.0</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Environnement:</span>
                  <Badge className="bg-green-100 text-green-800">Production</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dernière mise à jour:</span>
                  <span className="text-sm text-gray-600">15/01/2024 10:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Temps de fonctionnement:</span>
                  <span className="text-sm text-gray-600">15 jours, 8 heures</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <AuthProvider>
      <ProtectedRoute requiredRole="admin">
        <SystemSettingsManagement />
        <Toaster />
      </ProtectedRoute>
    </AuthProvider>
  )
}
