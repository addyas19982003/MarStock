"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import MinistryHeader from "@/components/layout/ministry-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Search, 
  Building, 
  Calendar, 
  Filter,
  TrendingUp,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  BarChart3,
  MapPin
} from "lucide-react"
import Link from "next/link"
import type { Employe } from "@/lib/client/employe-client"
import { EmployeClient } from "@/lib/client/employe-client"
import { useToast } from "@/components/ui/toast"
import { hasPermission } from "@/lib/auth"

function EmployesContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [employes, setEmployes] = useState<Employe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null)
  const [stats, setStats] = useState<any>({})
  const [departements, setDepartements] = useState<string[]>([])
  const [postes, setPostes] = useState<string[]>([])

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    poste: "",
    departement: "",
    date_embauche: "",
    salaire: "",
    statut: "actif" as "actif" | "inactif" | "conge",
    skills: [] as string[],
  })

  const [filters, setFilters] = useState({
    search: "",
    departement: "all",
    statut: "all",
    poste: "all",
  })

  const canCreate = hasPermission(user, "employe", "create")
  const canUpdate = hasPermission(user, "employe", "update")
  const canDelete = hasPermission(user, "employe", "delete")

  // Charger les données
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [employesData, statsData, departementsData, postesData] = await Promise.all([
        EmployeClient.getAllEmployes(),
        EmployeClient.getEmployeStats(),
        EmployeClient.getDepartements(),
        EmployeClient.getPostes()
      ])
      
      setEmployes(employesData)
      setStats(statsData)
      setDepartements(departementsData)
      setPostes(postesData)
    } catch (error) {
      setError("Erreur lors du chargement des données")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const employeData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        poste: formData.poste,
        departement: formData.departement,
        date_embauche: formData.date_embauche,
        salaire: parseFloat(formData.salaire),
        statut: formData.statut,
        skills: formData.skills,
      }

      if (editingEmploye) {
        await EmployeClient.updateEmploye(editingEmploye.id, employeData)
        toast({
          title: "Employé mis à jour",
          description: `${formData.prenom} ${formData.nom} a été mis à jour avec succès`,
        })
      } else {
        await EmployeClient.createEmploye(employeData)
        toast({
          title: "Employé créé",
          description: `${formData.prenom} ${formData.nom} a été créé avec succès`,
        })
      }

      setDialogOpen(false)
      resetForm()
      loadData() // Recharger les données
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      poste: "",
      departement: "",
      date_embauche: "",
      salaire: "",
      statut: "actif",
      skills: [],
    })
    setEditingEmploye(null)
  }

  const handleEdit = (employe: Employe) => {
    setEditingEmploye(employe)
    setFormData({
      nom: employe.nom,
      prenom: employe.prenom,
      email: employe.email,
      telephone: employe.telephone,
      poste: employe.poste,
      departement: employe.departement,
      date_embauche: employe.date_embauche,
      salaire: employe.salaire.toString(),
      statut: employe.statut,
      skills: employe.skills || [],
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number, nom: string, prenom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ${nom} ?`)) {
      return
    }

    try {
      await EmployeClient.deleteEmploye(id)
      toast({
        title: "Employé supprimé",
        description: `${prenom} ${nom} a été supprimé avec succès`,
      })
      loadData() // Recharger les données
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      departement: "all",
      statut: "all",
      poste: "all",
    })
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
      case "conge":
        return <Badge className="bg-orange-100 text-orange-800">Congé</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const filteredEmployes = employes.filter((employe) => {
    const searchMatch = !filters.search || 
      employe.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
      employe.prenom.toLowerCase().includes(filters.search.toLowerCase()) ||
      employe.email.toLowerCase().includes(filters.search.toLowerCase())
    
    const departementMatch = filters.departement === "all" || employe.departement === filters.departement
    const statutMatch = filters.statut === "all" || employe.statut === filters.statut
    const posteMatch = filters.poste === "all" || employe.poste === filters.poste

    return searchMatch && departementMatch && statutMatch && posteMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des employés...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadData} className="mt-4">Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MinistryHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="text-gray-600 mt-2">Gérez votre personnel et leurs informations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hover:shadow-lg transition-all duration-300 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            {canCreate && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un employé
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEmploye ? "Modifier l'employé" : "Ajouter un nouvel employé"}
                    </DialogTitle>
                    <DialogDescription>
                      Remplissez les informations de l'employé
                    </DialogDescription>
                  </DialogHeader>
                
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="poste">Poste</Label>
                        <Input
                          id="poste"
                          value={formData.poste}
                          onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="departement">Département</Label>
                        <Input
                          id="departement"
                          value={formData.departement}
                          onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date_embauche">Date d'embauche</Label>
                        <Input
                          id="date_embauche"
                          type="date"
                          value={formData.date_embauche}
                          onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="salaire">Salaire (MAD)</Label>
                        <Input
                          id="salaire"
                          type="number"
                          value={formData.salaire}
                          onChange={(e) => setFormData({ ...formData, salaire: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="statut">Statut</Label>
                      <Select
                        value={formData.statut}
                        onValueChange={(value: "actif" | "inactif" | "conge") => 
                          setFormData({ ...formData, statut: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                          <SelectItem value="conge">Congé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">
                        {editingEmploye ? "Mettre à jour" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Recherche</Label>
                <Input
                  id="search"
                  placeholder="Nom, prénom, email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="departement-filter">Département</Label>
                <Select
                  value={filters.departement}
                  onValueChange={(value) => setFilters({ ...filters, departement: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les départements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {departements.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="statut-filter">Statut</Label>
                <Select
                  value={filters.statut}
                  onValueChange={(value) => setFilters({ ...filters, statut: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="conge">Congé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="poste-filter">Poste</Label>
                <Select
                  value={filters.poste}
                  onValueChange={(value) => setFilters({ ...filters, poste: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les postes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les postes</SelectItem>
                    {postes.map((poste) => (
                      <SelectItem key={poste} value={poste}>{poste}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Tous les employés confondus
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employés Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.actifs || 0}</div>
              <p className="text-xs text-muted-foreground">
                En service actuellement
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salaire Moyen</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.salaire_moyen ? `${Math.round(stats.salaire_moyen).toLocaleString()} MAD` : '0 MAD'}</div>
              <p className="text-xs text-muted-foreground">
                Salaire moyen par employé
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Départements</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departements_count || 0}</div>
              <p className="text-xs text-muted-foreground">
                Nombre de départements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des employés */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Employés ({filteredEmployes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Salaire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployes.map((employe) => (
                  <TableRow key={employe.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employe.prenom} {employe.nom}</div>
                        <div className="text-sm text-gray-500">
                          {EmployeClient.calculateAnciennete(employe.date_embauche)} ans d'ancienneté
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {employe.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {employe.telephone}
                      </div>
                    </TableCell>
                    <TableCell>{employe.poste}</TableCell>
                    <TableCell>{employe.departement}</TableCell>
                    <TableCell>{getStatusBadge(employe.statut)}</TableCell>
                    <TableCell>{employe.salaire.toLocaleString()} MAD</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {canUpdate && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employe)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(employe.id, employe.nom, employe.prenom)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function EmployesPage() {
  return (
    <ProtectedRoute>
      <EmployesContent />
    </ProtectedRoute>
  )
}
