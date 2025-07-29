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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShoppingCart, 
  ArrowLeft, 
  Search, 
  Truck, 
  Package, 
  Eye, 
  Filter,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import type { Marche, BandeLivraison } from "@/lib/client/marche-client"
import { MarcheClient } from "@/lib/client/marche-client"
import { useToast } from "@/components/ui/toast"
import { hasPermission } from "@/lib/auth"

function MarcheContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [marches, setMarches] = useState<Marche[]>([])
  const [bandesLivraison, setBandesLivraison] = useState<BandeLivraison[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bandeDialogOpen, setBandeDialogOpen] = useState(false)
  const [editingMarche, setEditingMarche] = useState<Marche | null>(null)
  const [editingBande, setEditingBande] = useState<BandeLivraison | null>(null)
  const [stats, setStats] = useState<any>({})
  const [alertes, setAlertes] = useState<any[]>([])

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    date_debut: "",
    date_fin: "",
    budget: "",
    statut: "actif" as "actif" | "termine" | "suspendu",
    priority: "medium" as "low" | "medium" | "high",
  })

  const [bandeFormData, setBandeFormData] = useState({
    nom: "",
    description: "",
    marche_id: "",
    date_livraison: "",
    statut: "en_attente" as "en_attente" | "en_cours" | "livree" | "retard",
    montant: "",
    fournisseur: "",
  })

  const [filters, setFilters] = useState({
    search: "",
    statut: "all",
    priority: "all",
  })

  const canCreate = hasPermission(user, "marche", "create")
  const canUpdate = hasPermission(user, "marche", "update")
  const canDelete = hasPermission(user, "marche", "delete")

  // Charger les données
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [marchesData, statsData, alertesData] = await Promise.all([
        MarcheClient.getAllMarches(),
        MarcheClient.getMarcheStats(),
        MarcheClient.checkMarcheAlertes()
      ])
      
      setMarches(marchesData)
      setStats(statsData)
      setAlertes(alertesData)
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
      const marcheData = {
        nom: formData.nom,
        description: formData.description,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        budget: parseFloat(formData.budget),
        statut: formData.statut,
        priority: formData.priority,
        progress: 0,
      }

      if (editingMarche) {
        await MarcheClient.updateMarche(editingMarche.id, marcheData)
        toast({
          title: "Marché mis à jour",
          description: `${formData.nom} a été mis à jour avec succès`,
        })
      } else {
        await MarcheClient.createMarche(marcheData)
        toast({
          title: "Marché créé",
          description: `${formData.nom} a été créé avec succès`,
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

  const handleBandeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const bandeData = {
        nom: bandeFormData.nom,
        description: bandeFormData.description,
        marche_id: parseInt(bandeFormData.marche_id),
        date_livraison: bandeFormData.date_livraison,
        statut: bandeFormData.statut,
        montant: parseFloat(bandeFormData.montant),
        fournisseur: bandeFormData.fournisseur,
      }

      if (editingBande) {
        await MarcheClient.updateBandeLivraison(editingBande.id, bandeData)
        toast({
          title: "Bande de livraison mise à jour",
          description: `${bandeFormData.nom} a été mise à jour avec succès`,
        })
      } else {
        await MarcheClient.createBandeLivraison(bandeData)
        toast({
          title: "Bande de livraison créée",
          description: `${bandeFormData.nom} a été créée avec succès`,
        })
      }

      setBandeDialogOpen(false)
      resetBandeForm()
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
      description: "",
      date_debut: "",
      date_fin: "",
      budget: "",
      statut: "actif",
      priority: "medium",
    })
    setEditingMarche(null)
  }

  const resetBandeForm = () => {
    setBandeFormData({
      nom: "",
      description: "",
      marche_id: "",
      date_livraison: "",
      statut: "en_attente",
      montant: "",
      fournisseur: "",
    })
    setEditingBande(null)
  }

  const handleEdit = (marche: Marche) => {
    setEditingMarche(marche)
    setFormData({
      nom: marche.nom,
      description: marche.description,
      date_debut: marche.date_debut,
      date_fin: marche.date_fin,
      budget: marche.budget.toString(),
      statut: marche.statut,
      priority: marche.priority,
    })
    setDialogOpen(true)
  }

  const handleEditBande = (bande: BandeLivraison) => {
    setEditingBande(bande)
    setBandeFormData({
      nom: bande.nom,
      description: bande.description,
      marche_id: bande.marche_id.toString(),
      date_livraison: bande.date_livraison,
      statut: bande.statut,
      montant: bande.montant.toString(),
      fournisseur: bande.fournisseur,
    })
    setBandeDialogOpen(true)
  }

  const handleDelete = async (id: number, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le marché "${nom}" ?`)) {
      return
    }

    try {
      await MarcheClient.deleteMarche(id)
      toast({
        title: "Marché supprimé",
        description: `${nom} a été supprimé avec succès`,
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

  const handleDeleteBande = async (id: number, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la bande de livraison "${nom}" ?`)) {
      return
    }

    try {
      await MarcheClient.deleteBandeLivraison(id)
      toast({
        title: "Bande de livraison supprimée",
        description: `${nom} a été supprimée avec succès`,
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
      statut: "all",
      priority: "all",
    })
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "termine":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "suspendu":
        return <Badge className="bg-orange-100 text-orange-800">Suspendu</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Haute</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Basse</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getBandeStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>
      case "en_cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "livree":
        return <Badge className="bg-green-100 text-green-800">Livrée</Badge>
      case "retard":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const filteredMarches = marches.filter((marche) => {
    const searchMatch = !filters.search || 
      marche.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
      marche.description.toLowerCase().includes(filters.search.toLowerCase())
    
    const statutMatch = filters.statut === "all" || marche.statut === filters.statut
    const priorityMatch = filters.priority === "all" || marche.priority === filters.priority

    return searchMatch && statutMatch && priorityMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des marchés...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <MinistryHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hover:shadow-lg transition-all duration-300 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                <ShoppingCart className="h-8 w-8 mr-3 text-blue-600" />
                Gestion des Marchés
              </h1>
              <p className="text-gray-600 mt-1">Gérez les marchés publics et leurs livraisons</p>
            </div>
          </div>

          {canCreate && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Marché
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingMarche ? "Modifier le marché" : "Nouveau marché"}</DialogTitle>
                  <DialogDescription>
                    {editingMarche ? "Modifiez les informations du marché" : "Créez un nouveau marché public"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom du marché</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Basse</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">Date de début</Label>
                      <Input
                        id="date_debut"
                        type="date"
                        value={formData.date_debut}
                        onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de fin</Label>
                      <Input
                        id="date_fin"
                        type="date"
                        value={formData.date_fin}
                        onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (MAD)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statut">Statut</Label>
                      <Select
                        value={formData.statut}
                        onValueChange={(value: "actif" | "termine" | "suspendu") =>
                          setFormData({ ...formData, statut: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                          <SelectItem value="suspendu">Suspendu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingMarche ? "Mettre à jour" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Recherche</Label>
                <Input
                  id="search"
                  placeholder="Nom, description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
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
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority-filter">Priorité</Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => setFilters({ ...filters, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les priorités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
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
              <CardTitle className="text-sm font-medium">Total Marchés</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Tous les marchés confondus
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marchés Actifs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.actifs || 0}</div>
              <p className="text-xs text-muted-foreground">
                En cours d'exécution
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.budget_total ? `${(stats.budget_total / 1000000).toFixed(1)}M MAD` : '0 MAD'}</div>
              <p className="text-xs text-muted-foreground">
                Budget total alloué
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertes.length}</div>
              <p className="text-xs text-muted-foreground">
                Alertes en cours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des marchés */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Marchés ({filteredMarches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMarches.map((marche) => (
                <div key={marche.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{marche.nom}</h3>
                        {getStatusBadge(marche.statut)}
                        {getPriorityBadge(marche.priority)}
                      </div>
                      <p className="text-gray-600 mb-2">{marche.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(marche.date_debut).toLocaleDateString()} - {new Date(marche.date_fin).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {marche.budget.toLocaleString()} MAD
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {marche.progress}% terminé
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canUpdate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(marche)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(marche.id, marche.nom)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function MarchePage() {
  return (
    <ProtectedRoute>
      <MarcheContent />
    </ProtectedRoute>
  )
}
