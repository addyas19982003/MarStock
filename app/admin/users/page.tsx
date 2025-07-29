"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MinistryHeader } from "@/components/layout/ministry-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  ArrowLeft,
  Edit,
  UserPlus,
  Shield,
  Crown,
  UserCheck,
  Phone,
  Mail,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth"
import { useToast } from "@/components/ui/toast"
import type { User } from "@/lib/types"

function UserManagement() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "user" as "admin" | "manager" | "user",
    department: "",
    phone: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const userData = await authService.getAllUsers()
      setUsers(userData)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8)

      const newUser = await authService.signUp(formData.email, tempPassword, formData.full_name)

      // Update user with additional info
      await authService.updateUserRole(newUser.id, formData.role)

      // Update the user object with additional fields
      const updatedUser = {
        ...newUser,
        role: formData.role,
        department: formData.department,
        phone: formData.phone,
      }

      setUsers([updatedUser, ...users])

      toast({
        title: "Utilisateur créé",
        description: `Compte créé pour ${formData.full_name}. Mot de passe temporaire: ${tempPassword}`,
      })

      setDialogOpen(false)
      setFormData({
        email: "",
        full_name: "",
        role: "user",
        department: "",
        phone: "",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await authService.updateUserRole(userId, newRole as any)
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)))
      toast({
        title: "Succès",
        description: "Rôle utilisateur mis à jour",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive",
      })
    }
  }

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      await authService.toggleUserStatus(userId, isActive)
      setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: isActive } : u)))
      toast({
        title: "Succès",
        description: `Compte ${isActive ? "activé" : "désactivé"}`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-red-600" />
      case "manager":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <UserCheck className="h-4 w-4 text-green-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800">Gestionnaire</Badge>
      default:
        return <Badge className="bg-green-100 text-green-800">Utilisateur</Badge>
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "inactive" && !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <MinistryHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="hover:shadow-lg transition-all duration-300 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600 mt-1">Gérez les comptes, rôles et permissions</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Créer un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau membre à l'équipe avec les permissions appropriées
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "admin" | "manager" | "user") => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                            Utilisateur
                          </div>
                        </SelectItem>
                        <SelectItem value="manager">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-blue-600" />
                            Gestionnaire
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center">
                            <Crown className="h-4 w-4 mr-2 text-red-600" />
                            Administrateur
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Un mot de passe temporaire sera généré automatiquement et affiché après la
                    création du compte.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="px-6">
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
                  >
                    {loading ? "Création..." : "Créer l'utilisateur"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email, département..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40 h-11">
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Administrateurs</SelectItem>
                    <SelectItem value="manager">Gestionnaires</SelectItem>
                    <SelectItem value="user">Utilisateurs</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 h-11">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Users Table */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Liste des Utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} trouvé
              {filteredUsers.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(user.role)}
                            <Select
                              value={user.role}
                              onValueChange={(value) => handleRoleChange(user.id, value)}
                              disabled={user.id === currentUser?.id}
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Utilisateur</SelectItem>
                                <SelectItem value="manager">Gestionnaire</SelectItem>
                                <SelectItem value="admin">Administrateur</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-gray-400" />
                            {user.department || "Non défini"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-2 text-gray-400" />
                            {user.last_login ? new Date(user.last_login).toLocaleDateString("fr-FR") : "Jamais"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {user.is_active ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Switch
                              checked={user.is_active}
                              onCheckedChange={(checked) => handleStatusToggle(user.id, checked)}
                              disabled={user.id === currentUser?.id}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:shadow-md transition-all duration-300 bg-transparent"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">Administrateurs</p>
                  <p className="text-3xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
                </div>
                <Crown className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Gestionnaires</p>
                  <p className="text-3xl font-bold">{users.filter((u) => u.role === "manager").length}</p>
                </div>
                <Shield className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Actifs</p>
                  <p className="text-3xl font-bold">{users.filter((u) => u.is_active).length}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  )
}
