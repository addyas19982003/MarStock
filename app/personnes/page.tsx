"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Building, ArrowLeft, Users, MapPin, Briefcase, Plus, Edit, Trash2, Search, Filter, Layers } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/toast"
import { PersonnesClient, type Grade, type Direction, type Division, type Bureau, type Etage } from "@/lib/client/personnes-client"

function PersonnesContent() {
  const { toast } = useToast()
  const [grades, setGrades] = useState<Grade[]>([])
  const [directions, setDirections] = useState<Direction[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [bureaux, setBureaux] = useState<Bureau[]>([])
  const [etages, setEtages] = useState<Etage[]>([])
  const [loading, setLoading] = useState(true)

  // États pour les dialogues
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false)
  const [directionDialogOpen, setDirectionDialogOpen] = useState(false)
  const [divisionDialogOpen, setDivisionDialogOpen] = useState(false)
  const [bureauDialogOpen, setBureauDialogOpen] = useState(false)
  const [etageDialogOpen, setEtageDialogOpen] = useState(false)

  // États pour l'édition
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null)
  const [editingDivision, setEditingDivision] = useState<Division | null>(null)
  const [editingBureau, setEditingBureau] = useState<Bureau | null>(null)
  const [editingEtage, setEditingEtage] = useState<Etage | null>(null)

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("grades")

  // Formulaires
  const [gradeForm, setGradeForm] = useState({
    nom: "",
    niveau: "",
    salaire_base: "",
    description: "",
  })

  const [directionForm, setDirectionForm] = useState({
    nom: "",
    code: "",
    budget: "",
    responsable_id: "",
    description: "",
  })

  const [divisionForm, setDivisionForm] = useState({
    nom: "",
    code: "",
    direction_id: "",
    chef_id: "",
    description: "",
  })

  const [bureauForm, setBureauForm] = useState({
    nom: "",
    numero: "",
    etage: "",
    division_id: "",
    capacite: "",
    equipements: "",
  })

  const [etageForm, setEtageForm] = useState({
    numero: "",
    nom: "",
    description: "",
    superficie: "",
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [gradesData, directionsData, divisionsData, bureauxData, etagesData] = await Promise.all([
        PersonnesClient.getAllGrades(),
        PersonnesClient.getAllDirections(),
        PersonnesClient.getAllDivisions(),
        PersonnesClient.getAllBureaux(),
        PersonnesClient.getAllEtages(),
      ])

      setGrades(gradesData)
      setDirections(directionsData)
      setDivisions(divisionsData)
      setBureaux(bureauxData)
      setEtages(etagesData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Handlers pour les grades
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const gradeData = {
        nom: gradeForm.nom,
        niveau: gradeForm.niveau,
        salaire_base: Number.parseFloat(gradeForm.salaire_base),
        description: gradeForm.description,
      }

      if (editingGrade) {
        await PersonnesClient.updateGrade(editingGrade.id, gradeData)
        toast({ title: "Succès", description: "Grade modifié avec succès" })
      } else {
        await PersonnesClient.createGrade(gradeData)
        toast({ title: "Succès", description: "Grade créé avec succès" })
      }

      setGradeDialogOpen(false)
      setEditingGrade(null)
      resetGradeForm()
      fetchAllData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le grade", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDirectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const directionData = {
        nom: directionForm.nom,
        code: directionForm.code,
        budget: Number.parseFloat(directionForm.budget),
        responsable_id: directionForm.responsable_id ? Number.parseInt(directionForm.responsable_id) : undefined,
        description: directionForm.description,
      }

      if (editingDirection) {
        await PersonnesClient.updateDirection(editingDirection.id, directionData)
        toast({ title: "Succès", description: "Direction modifiée avec succès" })
      } else {
        await PersonnesClient.createDirection(directionData)
        toast({ title: "Succès", description: "Direction créée avec succès" })
      }

      setDirectionDialogOpen(false)
      setEditingDirection(null)
      resetDirectionForm()
      fetchAllData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder la direction", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDivisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const divisionData = {
        nom: divisionForm.nom,
        code: divisionForm.code,
        direction_id: Number.parseInt(divisionForm.direction_id),
        chef_id: divisionForm.chef_id ? Number.parseInt(divisionForm.chef_id) : undefined,
        description: divisionForm.description,
      }

      if (editingDivision) {
        await PersonnesClient.updateDivision(editingDivision.id, divisionData)
        toast({ title: "Succès", description: "Division modifiée avec succès" })
      } else {
        await PersonnesClient.createDivision(divisionData)
        toast({ title: "Succès", description: "Division créée avec succès" })
      }

      setDivisionDialogOpen(false)
      setEditingDivision(null)
      resetDivisionForm()
      fetchAllData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder la division", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleBureauSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bureauData = {
        nom: bureauForm.nom,
        numero: bureauForm.numero,
        etage: Number.parseInt(bureauForm.etage),
        division_id: Number.parseInt(bureauForm.division_id),
        capacite: Number.parseInt(bureauForm.capacite),
        equipements: bureauForm.equipements,
      }

      if (editingBureau) {
        await PersonnesClient.updateBureau(editingBureau.id, bureauData)
        toast({ title: "Succès", description: "Bureau modifié avec succès" })
      } else {
        await PersonnesClient.createBureau(bureauData)
        toast({ title: "Succès", description: "Bureau créé avec succès" })
      }

      setBureauDialogOpen(false)
      setEditingBureau(null)
      resetBureauForm()
      fetchAllData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le bureau", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleEtageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const etageData = {
        numero: Number.parseInt(etageForm.numero),
        nom: etageForm.nom,
        description: etageForm.description,
        superficie: Number.parseFloat(etageForm.superficie),
      }

      if (editingEtage) {
        await PersonnesClient.updateEtage(editingEtage.id, etageData)
        toast({ title: "Succès", description: "Étage modifié avec succès" })
      } else {
        await PersonnesClient.createEtage(etageData)
        toast({ title: "Succès", description: "Étage créé avec succès" })
      }

      setEtageDialogOpen(false)
      setEditingEtage(null)
      resetEtageForm()
      fetchAllData()
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder l'étage", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Reset forms
  const resetGradeForm = () => {
    setGradeForm({ nom: "", niveau: "", salaire_base: "", description: "" })
  }

  const resetDirectionForm = () => {
    setDirectionForm({ nom: "", code: "", budget: "", responsable_id: "", description: "" })
  }

  const resetDivisionForm = () => {
    setDivisionForm({ nom: "", code: "", direction_id: "", chef_id: "", description: "" })
  }

  const resetBureauForm = () => {
    setBureauForm({ nom: "", numero: "", etage: "", division_id: "", capacite: "", equipements: "" })
  }

  const resetEtageForm = () => {
    setEtageForm({ numero: "", nom: "", description: "", superficie: "" })
  }

  // Edit handlers
  const handleEditGrade = (grade: Grade) => {
    setEditingGrade(grade)
    setGradeForm({
      nom: grade.nom,
      niveau: grade.niveau.toString(),
      salaire_base: grade.salaire_base.toString(),
      description: grade.description,
    })
    setGradeDialogOpen(true)
  }

  const handleEditDirection = (direction: Direction) => {
    setEditingDirection(direction)
    setDirectionForm({
      nom: direction.nom,
      code: direction.code,
      budget: direction.budget.toString(),
      responsable_id: direction.responsable_id || "",
      description: direction.description,
    })
    setDirectionDialogOpen(true)
  }

  const handleEditDivision = (division: Division) => {
    setEditingDivision(division)
    setDivisionForm({
      nom: division.nom,
      code: division.code,
      direction_id: division.direction_id,
      chef_id: division.chef_id || "",
      description: division.description,
    })
    setDivisionDialogOpen(true)
  }

  const handleEditBureau = (bureau: Bureau) => {
    setEditingBureau(bureau)
    setBureauForm({
      nom: bureau.nom,
      numero: bureau.numero,
      etage: bureau.etage.toString(),
      division_id: bureau.division_id,
      capacite: bureau.capacite.toString(),
      equipements: bureau.equipements.join(", "),
    })
    setBureauDialogOpen(true)
  }

  const handleEditEtage = (etage: Etage) => {
    setEditingEtage(etage)
    setEtageForm({
      numero: etage.numero.toString(),
      nom: etage.nom,
      description: etage.description,
      superficie: etage.superficie.toString(),
    })
    setEtageDialogOpen(true)
  }

  // Delete handlers
  const handleDeleteGrade = async (id: number, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le grade "${nom}" ?`)) {
      try {
        await PersonnesClient.deleteGrade(id)
        toast({ title: "Succès", description: "Grade supprimé avec succès" })
        fetchAllData()
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer le grade", variant: "destructive" })
      }
    }
  }

  const handleDeleteDirection = async (id: number, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la direction "${nom}" ?`)) {
      try {
        await PersonnesClient.deleteDirection(id)
        toast({ title: "Succès", description: "Direction supprimée avec succès" })
        fetchAllData()
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer la direction", variant: "destructive" })
      }
    }
  }

  const handleDeleteDivision = async (id: number, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la division "${nom}" ?`)) {
      try {
        await PersonnesClient.deleteDivision(id)
        toast({ title: "Succès", description: "Division supprimée avec succès" })
        fetchAllData()
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer la division", variant: "destructive" })
      }
    }
  }

  const handleDeleteBureau = async (id: number, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le bureau "${nom}" ?`)) {
      try {
        await PersonnesClient.deleteBureau(id)
        toast({ title: "Succès", description: "Bureau supprimé avec succès" })
        fetchAllData()
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer le bureau", variant: "destructive" })
      }
    }
  }

  const handleDeleteEtage = async (id: number, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'étage "${nom}" ?`)) {
      try {
        await PersonnesClient.deleteEtage(id)
        toast({ title: "Succès", description: "Étage supprimé avec succès" })
        fetchAllData()
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer l'étage", variant: "destructive" })
      }
    }
  }

  // Filtrage
  const filteredGrades = grades.filter(
    (grade) =>
      grade.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDirections = directions.filter(
    (direction) =>
      direction.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direction.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDivisions = divisions.filter(
    (division) =>
      division.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBureaux = bureaux.filter(
    (bureau) =>
      bureau.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bureau.numero.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredEtages = etages.filter(
    (etage) =>
      etage.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etage.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const clearFilters = () => {
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
      <MinistryHeader />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="hover:shadow-lg transition-all duration-300 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
                <Building className="h-8 w-8 mr-3 text-orange-600" />
                Gestion des Personnes
              </h1>
              <p className="text-gray-600 mt-1">Gérez les structures organisationnelles du ministère</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="hover-lift bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Grades</p>
                  <p className="text-3xl font-bold">{grades.length}</p>
                </div>
                <Briefcase className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Directions</p>
                  <p className="text-3xl font-bold">{directions.length}</p>
                </div>
                <Building className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Divisions</p>
                  <p className="text-3xl font-bold">{divisions.length}</p>
                </div>
                <Users className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Bureaux</p>
                  <p className="text-3xl font-bold">{bureaux.length}</p>
                </div>
                <MapPin className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-100">Étages</p>
                  <p className="text-3xl font-bold">{etages.length}</p>
                </div>
                <Layers className="h-10 w-10 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans toutes les structures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Effacer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="grades" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Grades
            </TabsTrigger>
            <TabsTrigger value="directions" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Directions
            </TabsTrigger>
            <TabsTrigger value="divisions" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Divisions
            </TabsTrigger>
            <TabsTrigger value="bureaux" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Bureaux
            </TabsTrigger>
            <TabsTrigger value="etages" className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Étages
            </TabsTrigger>
          </TabsList>

          {/* Onglet Grades */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Gestion des Grades
                    </CardTitle>
                    <CardDescription>Hiérarchie et niveaux de rémunération</CardDescription>
                  </div>
                  <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Grade
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingGrade ? "Modifier le grade" : "Nouveau grade"}</DialogTitle>
                        <DialogDescription>
                          {editingGrade ? "Modifiez les informations du grade" : "Créez un nouveau grade hiérarchique"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGradeSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="grade-nom">Nom du grade</Label>
                            <Input
                              id="grade-nom"
                              value={gradeForm.nom}
                              onChange={(e) => setGradeForm({ ...gradeForm, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="grade-niveau">Niveau hiérarchique</Label>
                            <Input
                              id="grade-niveau"
                              type="number"
                              min="1"
                              max="10"
                              value={gradeForm.niveau}
                              onChange={(e) => setGradeForm({ ...gradeForm, niveau: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade-salaire">Salaire de base (MAD)</Label>
                          <Input
                            id="grade-salaire"
                            type="number"
                            step="100"
                            value={gradeForm.salaire_base}
                            onChange={(e) => setGradeForm({ ...gradeForm, salaire_base: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade-description">Description</Label>
                          <Textarea
                            id="grade-description"
                            value={gradeForm.description}
                            onChange={(e) => setGradeForm({ ...gradeForm, description: e.target.value })}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setGradeDialogOpen(false)
                              setEditingGrade(null)
                              resetGradeForm()
                            }}
                          >
                            Annuler
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {editingGrade ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredGrades.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun grade trouvé</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Salaire de base</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">{grade.nom}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">Niveau {grade.niveau}</Badge>
                          </TableCell>
                          <TableCell>{grade.salaire_base.toLocaleString("fr-FR")} MAD</TableCell>
                          <TableCell className="max-w-xs truncate">{grade.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditGrade(grade)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteGrade(grade.id, grade.nom)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Directions */}
          <TabsContent value="directions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Gestion des Directions
                    </CardTitle>
                    <CardDescription>Directions avec budgets et responsables</CardDescription>
                  </div>
                  <Dialog open={directionDialogOpen} onOpenChange={setDirectionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle Direction
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingDirection ? "Modifier la direction" : "Nouvelle direction"}</DialogTitle>
                        <DialogDescription>
                          {editingDirection
                            ? "Modifiez les informations de la direction"
                            : "Créez une nouvelle direction"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleDirectionSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="direction-nom">Nom de la direction</Label>
                            <Input
                              id="direction-nom"
                              value={directionForm.nom}
                              onChange={(e) => setDirectionForm({ ...directionForm, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="direction-code">Code</Label>
                            <Input
                              id="direction-code"
                              value={directionForm.code}
                              onChange={(e) => setDirectionForm({ ...directionForm, code: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="direction-budget">Budget annuel (MAD)</Label>
                          <Input
                            id="direction-budget"
                            type="number"
                            step="1000"
                            value={directionForm.budget}
                            onChange={(e) => setDirectionForm({ ...directionForm, budget: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="direction-description">Description</Label>
                          <Textarea
                            id="direction-description"
                            value={directionForm.description}
                            onChange={(e) => setDirectionForm({ ...directionForm, description: e.target.value })}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setDirectionDialogOpen(false)
                              setEditingDirection(null)
                              resetDirectionForm()
                            }}
                          >
                            Annuler
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {editingDirection ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                  </div>
                ) : filteredDirections.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune direction trouvée</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Direction</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDirections.map((direction) => (
                        <TableRow key={direction.id}>
                          <TableCell className="font-medium">{direction.nom}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{direction.code}</Badge>
                          </TableCell>
                          <TableCell>{direction.budget.toLocaleString("fr-FR")} MAD</TableCell>
                          <TableCell className="max-w-xs truncate">{direction.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditDirection(direction)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDirection(direction.id, direction.nom)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Divisions */}
          <TabsContent value="divisions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Gestion des Divisions
                    </CardTitle>
                    <CardDescription>Divisions par direction</CardDescription>
                  </div>
                  <Dialog open={divisionDialogOpen} onOpenChange={setDivisionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle Division
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingDivision ? "Modifier la division" : "Nouvelle division"}</DialogTitle>
                        <DialogDescription>
                          {editingDivision ? "Modifiez les informations de la division" : "Créez une nouvelle division"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleDivisionSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="division-nom">Nom de la division</Label>
                            <Input
                              id="division-nom"
                              value={divisionForm.nom}
                              onChange={(e) => setDivisionForm({ ...divisionForm, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="division-code">Code</Label>
                            <Input
                              id="division-code"
                              value={divisionForm.code}
                              onChange={(e) => setDivisionForm({ ...divisionForm, code: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="division-direction">Direction</Label>
                          <Select
                            value={divisionForm.direction_id}
                            onValueChange={(value) => setDivisionForm({ ...divisionForm, direction_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {directions.map((direction) => (
                                <SelectItem key={direction.id} value={direction.id}>
                                  {direction.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="division-description">Description</Label>
                          <Textarea
                            id="division-description"
                            value={divisionForm.description}
                            onChange={(e) => setDivisionForm({ ...divisionForm, description: e.target.value })}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setDivisionDialogOpen(false)
                              setEditingDivision(null)
                              resetDivisionForm()
                            }}
                          >
                            Annuler
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {editingDivision ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : filteredDivisions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune division trouvée</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Division</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDivisions.map((division) => {
                        const direction = directions.find((d) => d.id === division.direction_id)
                        return (
                          <TableRow key={division.id}>
                            <TableCell className="font-medium">{division.nom}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{division.code}</Badge>
                            </TableCell>
                            <TableCell>{direction?.nom || "Non assignée"}</TableCell>
                            <TableCell className="max-w-xs truncate">{division.description}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditDivision(division)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteDivision(division.id, division.nom)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Bureaux */}
          <TabsContent value="bureaux">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Gestion des Bureaux
                    </CardTitle>
                    <CardDescription>Organisation physique du bâtiment</CardDescription>
                  </div>
                  <Dialog open={bureauDialogOpen} onOpenChange={setBureauDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Bureau
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingBureau ? "Modifier le bureau" : "Nouveau bureau"}</DialogTitle>
                        <DialogDescription>
                          {editingBureau ? "Modifiez les informations du bureau" : "Créez un nouveau bureau"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleBureauSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bureau-nom">Nom du bureau</Label>
                            <Input
                              id="bureau-nom"
                              value={bureauForm.nom}
                              onChange={(e) => setBureauForm({ ...bureauForm, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bureau-numero">Numéro</Label>
                            <Input
                              id="bureau-numero"
                              value={bureauForm.numero}
                              onChange={(e) => setBureauForm({ ...bureauForm, numero: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bureau-etage">Étage</Label>
                            <Input
                              id="bureau-etage"
                              type="number"
                              min="0"
                              max="10"
                              value={bureauForm.etage}
                              onChange={(e) => setBureauForm({ ...bureauForm, etage: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bureau-capacite">Capacité</Label>
                            <Input
                              id="bureau-capacite"
                              type="number"
                              min="1"
                              value={bureauForm.capacite}
                              onChange={(e) => setBureauForm({ ...bureauForm, capacite: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bureau-division">Division</Label>
                          <Select
                            value={bureauForm.division_id}
                            onValueChange={(value) => setBureauForm({ ...bureauForm, division_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une division" />
                            </SelectTrigger>
                            <SelectContent>
                              {divisions.map((division) => (
                                <SelectItem key={division.id} value={division.id}>
                                  {division.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bureau-equipements">Équipements (séparés par des virgules)</Label>
                          <Textarea
                            id="bureau-equipements"
                            value={bureauForm.equipements}
                            onChange={(e) => setBureauForm({ ...bureauForm, equipements: e.target.value })}
                            placeholder="Ordinateur, imprimante, téléphone..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setBureauDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                            {editingBureau ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bureaux.map((bureau) => (
                    <div key={bureau.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-orange-600" />
                          <div>
                            <h4 className="font-semibold">{bureau.nom}</h4>
                            <p className="text-sm text-gray-600">
                              Numéro: {bureau.numero} | Étage: {bureau.etage} | Capacité: {bureau.capacite}
                            </p>
                            <p className="text-xs text-gray-500">
                              Division: {divisions.find(d => d.id === bureau.division_id)?.nom || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBureau(bureau)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBureau(bureau.id, bureau.nom)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Étages */}
          <TabsContent value="etages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Layers className="h-5 w-5 mr-2" />
                      Gestion des Étages
                    </CardTitle>
                    <CardDescription>Organisation verticale du bâtiment</CardDescription>
                  </div>
                  <Dialog open={etageDialogOpen} onOpenChange={setEtageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvel Étage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingEtage ? "Modifier l'étage" : "Nouvel étage"}</DialogTitle>
                        <DialogDescription>
                          {editingEtage ? "Modifiez les informations de l'étage" : "Créez un nouvel étage"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEtageSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="etage-numero">Numéro d'étage</Label>
                            <Input
                              id="etage-numero"
                              type="number"
                              min="0"
                              max="10"
                              value={etageForm.numero}
                              onChange={(e) => setEtageForm({ ...etageForm, numero: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="etage-nom">Nom de l'étage</Label>
                            <Input
                              id="etage-nom"
                              value={etageForm.nom}
                              onChange={(e) => setEtageForm({ ...etageForm, nom: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="etage-superficie">Superficie (m²)</Label>
                          <Input
                            id="etage-superficie"
                            type="number"
                            min="0"
                            value={etageForm.superficie}
                            onChange={(e) => setEtageForm({ ...etageForm, superficie: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="etage-description">Description</Label>
                          <Textarea
                            id="etage-description"
                            value={etageForm.description}
                            onChange={(e) => setEtageForm({ ...etageForm, description: e.target.value })}
                            placeholder="Description de l'étage..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setEtageDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                            {editingEtage ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {etages.map((etage) => (
                    <div key={etage.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Layers className="h-5 w-5 text-indigo-600" />
                          <div>
                            <h4 className="font-semibold">{etage.nom}</h4>
                            <p className="text-sm text-gray-600">
                              Numéro: {etage.numero} | Superficie: {etage.superficie} m²
                            </p>
                            {etage.description && (
                              <p className="text-xs text-gray-500">{etage.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditEtage(etage)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteEtage(etage.id, etage.nom)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function PersonnesPage() {
  return <PersonnesContent />
}
