import { useState, useEffect, useCallback } from 'react'
import { enhancedMockAPI } from '@/lib/mock-data-enhanced'
import type { Employe } from '@/lib/types'
import { useToast } from '@/components/ui/toast'

export interface EmployeFilters {
  searchTerm: string
  statusFilter: string
  departmentFilter: string
  posteFilter: string
  salaryFilter: string
  dateRange: { start: string; end: string }
}

export interface EmployeStats {
  total: number
  actif: number
  inactif: number
  conge: number
  salaire_moyen: number
  salaire_total: number
  anciennete_moyenne: number
  departements_count: number
}

export interface EmployeSkills {
  id: string
  nom: string
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert'
  categorie: string
}

export function useEmploye() {
  const { toast } = useToast()
  const [employes, setEmployes] = useState<Employe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<EmployeFilters>({
    searchTerm: '',
    statusFilter: 'all',
    departmentFilter: 'all',
    posteFilter: 'all',
    salaryFilter: 'all',
    dateRange: { start: '', end: '' }
  })

  // Charger les employés
  const fetchEmployes = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const employesData = await enhancedMockAPI.getEmployes()
      setEmployes(employesData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors du chargement des employés:', error)
      setError(errorMessage)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les employés',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Calculer les statistiques
  const getStats = useCallback((): EmployeStats => {
    const total = employes.length
    const actif = employes.filter(e => e.statut === 'actif').length
    const inactif = employes.filter(e => e.statut === 'inactif').length
    const conge = employes.filter(e => e.statut === 'conge').length
    
    const salaire_total = employes.reduce((sum, e) => sum + e.salaire, 0)
    const salaire_moyen = total > 0 ? salaire_total / total : 0
    
    const departements = new Set(employes.map(e => e.departement))
    const departements_count = departements.size
    
    // Calculer l'ancienneté moyenne
    const maintenant = new Date()
    const anciennetes = employes.map(e => {
      const dateEmbauche = new Date(e.date_embauche)
      return (maintenant.getTime() - dateEmbauche.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    })
    const anciennete_moyenne = anciennetes.length > 0 
      ? anciennetes.reduce((sum, age) => sum + age, 0) / anciennetes.length 
      : 0

    return {
      total,
      actif,
      inactif,
      conge,
      salaire_moyen,
      salaire_total,
      anciennete_moyenne,
      departements_count
    }
  }, [employes])

  // Filtrer les employés
  const getFilteredEmployes = useCallback(() => {
    if (!employes.length) return []
    
    return employes.filter(employe => {
      // Recherche textuelle
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesSearch = 
        employe.nom.toLowerCase().includes(searchLower) ||
        employe.prenom.toLowerCase().includes(searchLower) ||
        employe.email.toLowerCase().includes(searchLower) ||
        employe.poste.toLowerCase().includes(searchLower) ||
        employe.departement.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Filtres de statut et département
      const matchesStatus = filters.statusFilter === 'all' || employe.statut === filters.statusFilter
      const matchesDepartment = filters.departmentFilter === 'all' || employe.departement === filters.departmentFilter
      const matchesPoste = filters.posteFilter === 'all' || employe.poste === filters.posteFilter

      if (!matchesStatus || !matchesDepartment || !matchesPoste) return false

      // Filtre par salaire
      if (filters.salaryFilter !== 'all') {
        const salaire = employe.salaire
        let matchesSalary = false
        switch (filters.salaryFilter) {
          case 'low':
            matchesSalary = salaire < 5000
            break
          case 'medium':
            matchesSalary = salaire >= 5000 && salaire < 15000
            break
          case 'high':
            matchesSalary = salaire >= 15000
            break
        }
        if (!matchesSalary) return false
      }

      // Filtre par date d'embauche
      if (filters.dateRange.start && filters.dateRange.end) {
        const dateEmbauche = new Date(employe.date_embauche)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        const matchesDate = dateEmbauche >= startDate && dateEmbauche <= endDate
        if (!matchesDate) return false
      }

      return true
    })
  }, [employes, filters])

  // Créer un employé
  const createEmploye = useCallback(async (
    employeData: Omit<Employe, 'id' | 'created_at' | 'updated_at'>, 
    userId: string
  ): Promise<Employe> => {
    try {
      const nouvelEmploye = await enhancedMockAPI.createEmploye(employeData, userId)
      setEmployes(prev => [nouvelEmploye, ...prev])
      
      toast({
        title: 'Succès',
        description: 'Employé créé avec succès'
      })
      
      return nouvelEmploye
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la création de l\'employé:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'employé',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Mettre à jour un employé
  const updateEmploye = useCallback(async (
    id: string, 
    updates: Partial<Employe>
  ): Promise<Employe> => {
    try {
      const employeModifie = await enhancedMockAPI.updateEmploye(id, updates)
      setEmployes(prev => prev.map(e => e.id === id ? employeModifie : e))
      
      toast({
        title: 'Succès',
        description: 'Employé modifié avec succès'
      })
      
      return employeModifie
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la modification de l\'employé:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier l\'employé',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Supprimer un employé
  const deleteEmploye = useCallback(async (id: string): Promise<void> => {
    try {
      await enhancedMockAPI.deleteEmploye(id)
      setEmployes(prev => prev.filter(e => e.id !== id))
      
      toast({
        title: 'Succès',
        description: 'Employé supprimé avec succès'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la suppression de l\'employé:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'employé',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Calculer l'ancienneté
  const calculateAnciennete = useCallback((dateEmbauche: string): number => {
    const maintenant = new Date()
    const dateEmbaucheObj = new Date(dateEmbauche)
    const differenceMs = maintenant.getTime() - dateEmbaucheObj.getTime()
    return Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 365.25))
  }, [])

  // Obtenir les départements uniques
  const getDepartements = useCallback(() => {
    return [...new Set(employes.map(e => e.departement))]
  }, [employes])

  // Obtenir les postes uniques
  const getPostes = useCallback(() => {
    return [...new Set(employes.map(e => e.poste))]
  }, [employes])

  // Obtenir les employés par département
  const getEmployesByDepartment = useCallback((departement: string) => {
    return employes.filter(e => e.departement === departement)
  }, [employes])

  // Obtenir les employés par statut
  const getEmployesByStatus = useCallback((statut: string) => {
    return employes.filter(e => e.statut === statut)
  }, [employes])

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<EmployeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      departmentFilter: 'all',
      posteFilter: 'all',
      salaryFilter: 'all',
      dateRange: { start: '', end: '' }
    })
  }, [])

  // Obtenir les statistiques d'un employé
  const getEmployeStats = useCallback((employeId: string) => {
    const employe = employes.find(e => e.id === employeId)
    if (!employe) return null

    const anciennete = calculateAnciennete(employe.date_embauche)
    const employesDepartement = getEmployesByDepartment(employe.departement)
    const salaireMoyenDepartement = employesDepartement.length > 0
      ? employesDepartement.reduce((sum, e) => sum + e.salaire, 0) / employesDepartement.length
      : 0

    return {
      employe,
      anciennete,
      employesDepartement: employesDepartement.length,
      salaireMoyenDepartement,
      salaireVsMoyenne: employe.salaire - salaireMoyenDepartement
    }
  }, [employes, calculateAnciennete, getEmployesByDepartment])

  useEffect(() => {
    fetchEmployes()
  }, [fetchEmployes])

  return {
    // Données
    employes,
    loading,
    error,
    
    // Filtres et recherche
    filters,
    updateFilters,
    resetFilters,
    getFilteredEmployes,
    
    // Statistiques
    getStats,
    getEmployeStats,
    
    // Actions
    createEmploye,
    updateEmploye,
    deleteEmploye,
    
    // Utilitaires
    calculateAnciennete,
    getDepartements,
    getPostes,
    getEmployesByDepartment,
    getEmployesByStatus,
    fetchEmployes
  }
} 