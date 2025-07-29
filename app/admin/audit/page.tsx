"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MinistryHeader } from "@/components/layout/ministry-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  ArrowLeft,
  Search,
  Download,
  Filter,
  Eye,
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  Globe,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { adminService } from "@/lib/admin-service"
import { Toaster, useToast } from "@/components/ui/toast"
import type { AuditLog } from "@/lib/types"

function AuditLogManagement() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)

  useEffect(() => {
    fetchAuditLogs()
  }, [currentPage])

  const fetchAuditLogs = async () => {
    try {
      const { logs: auditLogs, total } = await adminService.getAuditLogs(currentPage, 50)
      setLogs(auditLogs)
      setTotalLogs(total)
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les journaux d'audit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="h-4 w-4 text-green-600" />
      case "update":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "read":
        return <Eye className="h-4 w-4 text-gray-600" />
      case "login":
        return <User className="h-4 w-4 text-purple-600" />
      case "logout":
        return <User className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-100 text-green-800">Création</Badge>
      case "update":
        return <Badge className="bg-blue-100 text-blue-800">Modification</Badge>
      case "delete":
        return <Badge className="bg-red-100 text-red-800">Suppression</Badge>
      case "read":
        return <Badge className="bg-gray-100 text-gray-800">Lecture</Badge>
      case "login":
        return <Badge className="bg-purple-100 text-purple-800">Connexion</Badge>
      case "logout":
        return <Badge className="bg-orange-100 text-orange-800">Déconnexion</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesResource = resourceFilter === "all" || log.resource === resourceFilter

    return matchesSearch && matchesAction && matchesResource
  })

  const exportLogs = async () => {
    try {
      const blob = await adminService.exportData("audit_logs")
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export réussi",
        description: "Les journaux d'audit ont été exportés",
      })
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les journaux",
        variant: "destructive",
      })
    }
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
                <Shield className="h-8 w-8 mr-3 text-green-600" />
                Journal d'Audit
              </h1>
              <p className="text-gray-600 mt-1">Traçabilité complète des actions utilisateurs</p>
            </div>
          </div>

          <Button onClick={exportLogs} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Utilisateur, action, détails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="action">Action</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                    <SelectItem value="create">Création</SelectItem>
                    <SelectItem value="update">Modification</SelectItem>
                    <SelectItem value="delete">Suppression</SelectItem>
                    <SelectItem value="read">Lecture</SelectItem>
                    <SelectItem value="login">Connexion</SelectItem>
                    <SelectItem value="logout">Déconnexion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resource">Ressource</Label>
                <Select value={resourceFilter} onValueChange={setResourceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les ressources</SelectItem>
                    <SelectItem value="marche">Marchés</SelectItem>
                    <SelectItem value="materiel">Matériels</SelectItem>
                    <SelectItem value="employe">Employés</SelectItem>
                    <SelectItem value="user">Utilisateurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Période
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Logs</p>
                  <p className="text-2xl font-bold">{totalLogs}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                  <p className="text-2xl font-bold">
                    {logs.filter((l) => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Modifications</p>
                  <p className="text-2xl font-bold">
                    {logs.filter((l) => ["create", "update", "delete"].includes(l.action)).length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connexions</p>
                  <p className="text-2xl font-bold">{logs.filter((l) => l.action === "login").length}</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Journaux d'Audit</CardTitle>
            <CardDescription>
              {filteredLogs.length} entrée{filteredLogs.length > 1 ? "s" : ""} trouvée
              {filteredLogs.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun journal d'audit trouvé</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Ressource</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Date/Heure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {log.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{log.user_name}</div>
                            <div className="text-xs text-gray-500">ID: {log.user_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.resource}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={log.details}>
                          {log.details}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Globe className="h-3 w-3 mr-1 text-gray-400" />
                          {log.ip_address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(log.timestamp).toLocaleDateString("fr-FR")}</div>
                          <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString("fr-FR")}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalLogs > 50 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 py-2 text-sm">
                Page {currentPage} sur {Math.ceil(totalLogs / 50)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(Math.ceil(totalLogs / 50), currentPage + 1))}
                disabled={currentPage === Math.ceil(totalLogs / 50)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminAuditPage() {
  return (
    <AuthProvider>
      <ProtectedRoute requiredRole="admin">
        <AuditLogManagement />
        <Toaster />
      </ProtectedRoute>
    </AuthProvider>
  )
}
