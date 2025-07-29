"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
import { Plus, Edit, Trash2, Package, ArrowLeft, UserX, Search, AlertTriangle, Filter, User } from "lucide-react"
import Link from "next/link"
import { StockClient, type Materiel } from "@/lib/client/stock-client"
import { EmployeClient, type Employe } from "@/lib/client/employe-client"
import { useToast } from "@/components/ui/toast"
import { hasPermission } from "@/lib/auth"

function StockContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [materiels, setMateriels] = useState<Materiel[]>([])
  const [employes, setEmployes] = useState<Employe[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMateriel, setEditingMateriel] = useState<Materiel | null>(null)

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [employeeFilter, setEmployeeFilter] = useState("all")

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    quantite: "",
    prix_unitaire: "",
    statut: "disponible" as "disponible" | "affecte" | "maintenance" | "hors_service" | "en_transit",
    category: "",
    location: "",
    serial_number: "",
    warranty_date: "",
    employe_id: "none",
    seuil_alerte: "",
    unite: "",
    code_barre: "",
  })

  const canCreate = hasPermission(user, "stock", "create")
  const canUpdate = hasPermission(user, "stock", "update")
  const canDelete = hasPermission(user, "stock", "delete")

  useEffect(() => {
    fetchMateriels()
    fetchEmployes()
  }, [])

  const fetchMateriels = async () => {
    try {
      const data = await StockClient.getAllMateriels()
      setMateriels(data)
    } catch (error) {
      console.error("Error fetching materiels:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les matériels",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployes = async () => {
    try {
      const data = await EmployeClient.getAllEmployes()
      setEmployes(data.filter((e) => e.statut === "actif"))
    } catch (error) {
      console.error("Error fetching employes:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const materielData = {
        nom: formData.nom,
        description: formData.description,
        quantite: parseInt(formData.quantite),
        prix_unitaire: parseFloat(formData.prix_unitaire),
        statut: formData.statut,
        category: formData.category,
        location: formData.location,
        serial_number: formData.serial_number || undefined,
        warranty_date: formData.warranty_date || undefined,
        employe_id: formData.employe_id === "none" ? undefined : parseInt(formData.employe_id),
        seuil_alerte: parseInt(formData.seuil_alerte) || 0,
        unite: formData.unite || "unité",
        code_barre: formData.code_barre || undefined,
      }

      if (editingMateriel) {
        await StockClient.updateMateriel(editingMateriel.id, materielData)
        toast({
          title: "Succès",
          description: "Matériel mis à jour avec succès",
        })
      } else {
        await StockClient.createMateriel(materielData)
        toast({
          title: "Succès",
          description: "Matériel créé avec succès",
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchMateriels()
    } catch (error) {
      console.error("Error saving materiel:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le matériel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      quantite: "",
      prix_unitaire: "",
      statut: "disponible",
      category: "",
      location: "",
      serial_number: "",
      warranty_date: "",
      employe_id: "none",
      seuil_alerte: "",
      unite: "",
      code_barre: "",
    })
    setEditingMateriel(null)
  }

  const handleEdit = (materiel: Materiel) => {
    setEditingMateriel(materiel)
    setFormData({
      nom: materiel.nom,
      description: materiel.description,
      quantite: materiel.quantite.toString(),
      prix_unitaire: materiel.prix_unitaire.toString(),
      statut: materiel.statut,
      category: materiel.category,
      location: materiel.location,
      serial_number: materiel.serial_number || "",
      warranty_date: materiel.warranty_date || "",
      employe_id: materiel.employe_id?.toString() || "none",
      seuil_alerte: materiel.seuil_alerte.toString(),
      unite: materiel.unite,
      code_barre: materiel.code_barre || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le matériel "${nom}" ?`)) {
      return
    }

    try {
      const success = await StockClient.deleteMateriel(id)
      if (success) {
        toast({
          title: "Succès",
          description: "Matériel supprimé avec succès",
        })
        fetchMateriels()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le matériel",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting materiel:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le matériel",
        variant: "destructive",
      })
    }
  }

  const handleAffectation = async (materielId: number, employeId: number | null, action: "affecter" | "recuperer") => {
    try {
      const updates = {
        employe_id: action === "affecter" ? employeId : null,
        statut: action === "affecter" ? "affecte" as const : "disponible" as const,
      }

      await StockClient.updateMateriel(materielId, updates)
      
      toast({
        title: "Succès",
        description: action === "affecter" ? "Matériel affecté avec succès" : "Matériel récupéré avec succès",
      })
      
      fetchMateriels()
    } catch (error) {
      console.error("Error updating materiel affectation:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'affectation",
        variant: "destructive",
      })
    }
  }

  // Filtrer les matériels
  const filteredMateriels = materiels.filter((materiel) => {
    const searchMatch = materiel.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.category.toLowerCase().includes(searchTerm.toLowerCase())

    const statusMatch = statusFilter === "all" || materiel.statut === statusFilter
    const categoryMatch = categoryFilter === "all" || materiel.category === categoryFilter
    const locationMatch = locationFilter === "all" || materiel.location === locationFilter
    const employeeMatch = employeeFilter === "all" || 
      (employeeFilter === "affecte" && materiel.employe_id) ||
      (employeeFilter === "disponible" && !materiel.employe_id)

    return searchMatch && statusMatch && categoryMatch && locationMatch && employeeMatch
  })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setLocationFilter("all")
    setEmployeeFilter("all")
  }

  const getStatusBadge = (statut: string) => {
    const statusConfig = StockClient.getStatutBadge({ statut } as Materiel)
    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    )
  }

  const isWarrantyExpiring = (warrantyDate: string) => {
    if (!warrantyDate) return false
    const warranty = new Date(warrantyDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((warranty.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isWarrantyExpired = (warrantyDate: string) => {
    if (!warrantyDate) return false
    const warranty = new Date(warrantyDate)
    const now = new Date()
    return warranty < now
  }

  // Statistiques
  const totalMateriels = materiels.length
  const totalValue = materiels.reduce((sum, m) => sum + (m.quantite * m.prix_unitaire), 0)
  const availableMateriels = materiels.filter(m => m.statut === "disponible").length
  const assignedMateriels = materiels.filter(m => m.statut === "affecte").length
  const maintenanceMateriels = materiels.filter(m => m.statut === "maintenance").length
  const lowStockMateriels = materiels.filter(m => m.quantite <= m.seuil_alerte && m.quantite > 0).length
  const outOfStockMateriels = materiels.filter(m => m.quantite === 0).length

  // Obtenir les catégories et emplacements uniques
  const categories = [...new Set(materiels.map(m => m.category))]
  const locations = [...new Set(materiels.map(m => m.location))]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de Stock</h1>
          <p className="text-gray-600 mt-2">Gérez votre inventaire de matériels</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          {canCreate && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un matériel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingMateriel ? "Modifier le matériel" : "Ajouter un nouveau matériel"}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du matériel
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom du matériel *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quantite">Quantité *</Label>
                      <Input
                        id="quantite"
                        type="number"
                        value={formData.quantite}
                        onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prix_unitaire">Prix unitaire (DH) *</Label>
                      <Input
                        id="prix_unitaire"
                        type="number"
                        step="0.01"
                        value={formData.prix_unitaire}
                        onChange={(e) => setFormData({ ...formData, prix_unitaire: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unite">Unité</Label>
                      <Input
                        id="unite"
                        value={formData.unite}
                        onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                        placeholder="unité"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="statut">Statut *</Label>
                      <Select
                        value={formData.statut}
                        onValueChange={(value) => setFormData({ ...formData, statut: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="affecte">Affecté</SelectItem>
                          <SelectItem value="maintenance">En maintenance</SelectItem>
                          <SelectItem value="hors_service">Hors service</SelectItem>
                          <SelectItem value="en_transit">En transit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Emplacement *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serial_number">Numéro de série</Label>
                      <Input
                        id="serial_number"
                        value={formData.serial_number}
                        onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="warranty_date">Date de garantie</Label>
                      <Input
                        id="warranty_date"
                        type="date"
                        value={formData.warranty_date}
                        onChange={(e) => setFormData({ ...formData, warranty_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seuil_alerte">Seuil d'alerte</Label>
                      <Input
                        id="seuil_alerte"
                        type="number"
                        value={formData.seuil_alerte}
                        onChange={(e) => setFormData({ ...formData, seuil_alerte: e.target.value })}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="code_barre">Code-barres</Label>
                      <Input
                        id="code_barre"
                        value={formData.code_barre}
                        onChange={(e) => setFormData({ ...formData, code_barre: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="employe_id">Employé affecté</Label>
                    <Select
                      value={formData.employe_id}
                      onValueChange={(value) => setFormData({ ...formData, employe_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun employé</SelectItem>
                        {employes.map((employe) => (
                          <SelectItem key={employe.id} value={employe.id.toString()}>
                            {employe.prenom} {employe.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {editingMateriel ? "Modifier" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matériels</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMateriels}</div>
            <p className="text-xs text-muted-foreground">
              Valeur totale: {totalValue.toLocaleString()} DH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableMateriels}</div>
            <p className="text-xs text-muted-foreground">
              {((availableMateriels / totalMateriels) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affectés</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assignedMateriels}</div>
            <p className="text-xs text-muted-foreground">
              {((assignedMateriels / totalMateriels) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockMateriels + outOfStockMateriels}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockMateriels} en rupture, {outOfStockMateriels} épuisés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="affecte">Affecté</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="hors_service">Hors service</SelectItem>
                  <SelectItem value="en_transit">En transit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Catégorie</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location-filter">Emplacement</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les emplacements</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employee-filter">Affectation</Label>
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les affectations</SelectItem>
                  <SelectItem value="affecte">Affectés</SelectItem>
                  <SelectItem value="disponible">Disponibles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Effacer les filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des matériels */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des matériels</CardTitle>
          <CardDescription>
            {filteredMateriels.length} matériel(s) trouvé(s) sur {totalMateriels}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matériel</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Valeur totale</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Emplacement</TableHead>
                    <TableHead>Affecté à</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMateriels.map((materiel) => {
                    const assignedEmployee = employes.find(e => e.id === materiel.employe_id)
                    const isLowStock = materiel.quantite <= materiel.seuil_alerte && materiel.quantite > 0
                    const isOutOfStock = materiel.quantite === 0

                    return (
                      <TableRow key={materiel.id} className={isOutOfStock ? "bg-red-50" : isLowStock ? "bg-yellow-50" : ""}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{materiel.nom}</div>
                            <div className="text-sm text-muted-foreground">{materiel.description}</div>
                            {materiel.serial_number && (
                              <div className="text-xs text-muted-foreground">
                                S/N: {materiel.serial_number}
                              </div>
                            )}
                            {materiel.warranty_date && (
                              <div className="text-xs text-muted-foreground">
                                Garantie: {new Date(materiel.warranty_date).toLocaleDateString()}
                                {isWarrantyExpiring(materiel.warranty_date) && (
                                  <Badge variant="destructive" className="ml-1">Expire bientôt</Badge>
                                )}
                                {isWarrantyExpired(materiel.warranty_date) && (
                                  <Badge variant="destructive" className="ml-1">Expirée</Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{materiel.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={isLowStock ? "text-yellow-600 font-medium" : isOutOfStock ? "text-red-600 font-medium" : ""}>
                              {materiel.quantite} {materiel.unite}
                            </span>
                            {isLowStock && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                            {isOutOfStock && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          </div>
                        </TableCell>
                        <TableCell>{materiel.prix_unitaire.toLocaleString()} DH</TableCell>
                        <TableCell className="font-medium">
                          {(materiel.quantite * materiel.prix_unitaire).toLocaleString()} DH
                        </TableCell>
                        <TableCell>{getStatusBadge(materiel.statut)}</TableCell>
                        <TableCell>{materiel.location}</TableCell>
                        <TableCell>
                          {assignedEmployee ? (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{assignedEmployee.prenom} {assignedEmployee.nom}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Non affecté</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {canUpdate && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Modifier le matériel</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Affecter à un employé</Label>
                                      <Select
                                        onValueChange={(value) => {
                                          if (value) {
                                            handleAffectation(materiel.id, parseInt(value), "affecter")
                                          }
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Sélectionner un employé" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {employes.map((employe) => (
                                            <SelectItem key={employe.id} value={employe.id.toString()}>
                                              {employe.prenom} {employe.nom}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Button
                                        variant="outline"
                                        onClick={() => handleAffectation(materiel.id, null, "recuperer")}
                                        className="w-full"
                                      >
                                        <UserX className="h-4 w-4 mr-2" />
                                        Récupérer le matériel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            {canUpdate && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(materiel)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(materiel.id, materiel.nom)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function StockPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <MinistryHeader />
        <StockContent />
      </div>
    </ProtectedRoute>
  )
}
