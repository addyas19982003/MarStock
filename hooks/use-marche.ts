import { useState, useEffect, useCallback } from 'react'
import { enhancedMockAPI } from '@/lib/mock-data-enhanced'
import type { Marche, Materiel, Employe } from '@/lib/types'
import type { BandeLivraison } from '@/lib/mock-data-enhanced'
import { useToast } from '@/components/ui/toast'

export interface MarcheFilters {
  searchTerm: string
  statusFilter: string
  priorityFilter: string
  budgetFilter: string
  dateRange: { start: string; end: string }
  responsableFilter: string
}

export interface MarcheStats {
  total: number
  actif: number
  termine: number
  suspendu: number
  budget_total: number
  budget_utilise: number
  budget_restant: number
  livraisons_en_cours: number
  livraisons_terminees: number
  livraisons_en_retard: number
}

export interface MarcheAlerte {
  type: 'warning' | 'critical'
  message: string
  marcheId: string
}

export interface MarcheTimeline {
  id: string
  date: string
  action: string
  description: string
  user: string
  type: 'creation' | 'modification' | 'livraison' | 'validation' | 'annulation'
}

export function useMarche() {
  const { toast } = useToast()
  const [marches, setMarches] = useState<Marche[]>([])
  const [bandesLivraison, setBandesLivraison] = useState<BandeLivraison[]>([])
  const [materiels, setMateriels] = useState<Materiel[]>([])
  const [employes, setEmployes] = useState<Employe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MarcheFilters>({
    searchTerm: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    budgetFilter: 'all',
    dateRange: { start: '', end: '' },
    responsableFilter: 'all'
  })

  // Charger toutes les données
  const fetchAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [marchesData, bandesData, materielsData, employesData] = await Promise.all([
        enhancedMockAPI.getMarches(),
        enhancedMockAPI.getBandesLivraison(),
        enhancedMockAPI.getMateriels(),
        enhancedMockAPI.getEmployes()
      ])

      setMarches(marchesData)
      setBandesLivraison(bandesData)
      setMateriels(materielsData)
      setEmployes(employesData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors du chargement des données:', error)
      setError(errorMessage)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données des marchés',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Calculer les statistiques
  const getStats = useCallback((): MarcheStats => {
    const total = marches.length
    const actif = marches.filter(m => m.statut === 'actif').length
    const termine = marches.filter(m => m.statut === 'termine').length
    const suspendu = marches.filter(m => m.statut === 'suspendu').length
    
    const budget_total = marches.reduce((sum, m) => sum + m.budget, 0)
    const budget_utilise = bandesLivraison
      .filter(b => b.statut === 'livree')
      .reduce((sum, b) => sum + b.montant, 0)
    const budget_restant = Math.max(0, budget_total - budget_utilise)
    
    const livraisons_en_cours = bandesLivraison.filter(b => b.statut === 'en_cours').length
    const livraisons_terminees = bandesLivraison.filter(b => b.statut === 'livree').length
    const livraisons_en_retard = bandesLivraison.filter(b => b.statut === 'retard').length

    return {
      total,
      actif,
      termine,
      suspendu,
      budget_total,
      budget_utilise,
      budget_restant,
      livraisons_en_cours,
      livraisons_terminees,
      livraisons_en_retard
    }
  }, [marches, bandesLivraison])

  // Filtrer les marchés avec optimisation
  const getFilteredMarches = useCallback(() => {
    if (!marches.length) return []
    
    return marches.filter(marche => {
      // Recherche textuelle
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesSearch = 
        marche.nom.toLowerCase().includes(searchLower) ||
        marche.description.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Filtres de statut et priorité
      const matchesStatus = filters.statusFilter === 'all' || marche.statut === filters.statusFilter
      const matchesPriority = filters.priorityFilter === 'all' || marche.priority === filters.priorityFilter
      const matchesResponsable = filters.responsableFilter === 'all' || marche.created_by === filters.responsableFilter

      if (!matchesStatus || !matchesPriority || !matchesResponsable) return false

      // Filtre par budget
      if (filters.budgetFilter !== 'all') {
        const budget = marche.budget
        let matchesBudget = false
        switch (filters.budgetFilter) {
          case 'low':
            matchesBudget = budget < 100000
            break
          case 'medium':
            matchesBudget = budget >= 100000 && budget < 500000
            break
          case 'high':
            matchesBudget = budget >= 500000
            break
        }
        if (!matchesBudget) return false
      }

      // Filtre par date
      if (filters.dateRange.start && filters.dateRange.end) {
        const marcheDate = new Date(marche.date_debut)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        const matchesDate = marcheDate >= startDate && marcheDate <= endDate
        if (!matchesDate) return false
      }

      return true
    })
  }, [marches, filters])

  // Obtenir les bandes de livraison d'un marché
  const getBandesByMarche = useCallback((marcheId: string): BandeLivraison[] => {
    return bandesLivraison.filter(bande => bande.marche_id === marcheId)
  }, [bandesLivraison])

  // Calculer le progrès d'un marché
  const getMarcheProgress = useCallback((marcheId: string): number => {
    const bandes = getBandesByMarche(marcheId)
    if (bandes.length === 0) return 0
    
    const livrees = bandes.filter(b => b.statut === 'livree').length
    return Math.round((livrees / bandes.length) * 100)
  }, [getBandesByMarche])

  // Calculer le budget utilisé d'un marché
  const getMarcheBudgetUtilise = useCallback((marcheId: string): number => {
    const bandes = getBandesByMarche(marcheId)
    return bandes.reduce((sum, bande) => sum + bande.montant, 0)
  }, [getBandesByMarche])

  // Créer un marché
  const createMarche = useCallback(async (
    marcheData: Omit<Marche, 'id' | 'created_at' | 'updated_at'>, 
    userId: string
  ): Promise<Marche> => {
    try {
      const nouveauMarche = await enhancedMockAPI.createMarche(marcheData, userId)
      setMarches(prev => [nouveauMarche, ...prev])
      
      toast({
        title: 'Succès',
        description: 'Marché créé avec succès'
      })
      
      return nouveauMarche
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la création du marché:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le marché',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Mettre à jour un marché
  const updateMarche = useCallback(async (
    id: string, 
    updates: Partial<Marche>
  ): Promise<Marche> => {
    try {
      const marcheModifie = await enhancedMockAPI.updateMarche(id, updates)
      setMarches(prev => prev.map(m => m.id === id ? marcheModifie : m))
      
      toast({
        title: 'Succès',
        description: 'Marché modifié avec succès'
      })
      
      return marcheModifie
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la modification du marché:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le marché',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Supprimer un marché
  const deleteMarche = useCallback(async (id: string): Promise<void> => {
    try {
      await enhancedMockAPI.deleteMarche(id)
      setMarches(prev => prev.filter(m => m.id !== id))
      
      toast({
        title: 'Succès',
        description: 'Marché supprimé avec succès'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la suppression du marché:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le marché',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Créer une bande de livraison
  const createBandeLivraison = useCallback(async (
    bandeData: Omit<BandeLivraison, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BandeLivraison> => {
    try {
      const nouvelleBande = await enhancedMockAPI.createBandeLivraison(bandeData)
      setBandesLivraison(prev => [nouvelleBande, ...prev])
      
      toast({
        title: 'Succès',
        description: 'Bande de livraison créée avec succès'
      })
      
      return nouvelleBande
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la création de la bande de livraison:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la bande de livraison',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Mettre à jour une bande de livraison
  const updateBandeLivraison = useCallback(async (
    id: string, 
    updates: Partial<BandeLivraison>
  ): Promise<BandeLivraison> => {
    try {
      const bandeModifiee = await enhancedMockAPI.updateBandeLivraison(id, updates)
      setBandesLivraison(prev => prev.map(b => b.id === id ? bandeModifiee : b))
      
      toast({
        title: 'Succès',
        description: 'Bande de livraison modifiée avec succès'
      })
      
      return bandeModifiee
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la modification de la bande de livraison:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la bande de livraison',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Supprimer une bande de livraison
  const deleteBandeLivraison = useCallback(async (id: string): Promise<void> => {
    try {
      await enhancedMockAPI.deleteBandeLivraison(id)
      setBandesLivraison(prev => prev.filter(b => b.id !== id))
      
      toast({
        title: 'Succès',
        description: 'Bande de livraison supprimée avec succès'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur lors de la suppression de la bande de livraison:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la bande de livraison',
        variant: 'destructive'
      })
      throw new Error(errorMessage)
    }
  }, [toast])

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<MarcheFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      priorityFilter: 'all',
      budgetFilter: 'all',
      dateRange: { start: '', end: '' },
      responsableFilter: 'all'
    })
  }, [])

  // Vérifier les alertes de marché
  const checkMarcheAlertes = useCallback((): MarcheAlerte[] => {
    const alertes: MarcheAlerte[] = []
    
    marches.forEach(marche => {
      const dateFin = new Date(marche.date_fin)
      const maintenant = new Date()
      const joursRestants = Math.ceil((dateFin.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24))
      
      // Alerte si le marché se termine bientôt
      if (joursRestants <= 30 && joursRestants > 0) {
        alertes.push({
          type: 'warning',
          message: `Le marché "${marche.nom}" se termine dans ${joursRestants} jours`,
          marcheId: marche.id
        })
      }
      
      // Alerte si le marché est en retard
      if (joursRestants < 0 && marche.statut === 'actif') {
        alertes.push({
          type: 'critical',
          message: `Le marché "${marche.nom}" est en retard de ${Math.abs(joursRestants)} jours`,
          marcheId: marche.id
        })
      }
    })
    
    return alertes
  }, [marches])

  // Obtenir les statistiques d'un marché spécifique
  const getMarcheStats = useCallback((marcheId: string) => {
    const marche = marches.find(m => m.id === marcheId)
    if (!marche) return null

    const bandes = getBandesByMarche(marcheId)
    const budgetUtilise = getMarcheBudgetUtilise(marcheId)
    const progress = getMarcheProgress(marcheId)

    return {
      marche,
      bandes,
      budgetUtilise,
      budgetRestant: Math.max(0, marche.budget - budgetUtilise),
      progress,
      livraisonsEnCours: bandes.filter(b => b.statut === 'en_cours').length,
      livraisonsTerminees: bandes.filter(b => b.statut === 'livree').length,
      livraisonsEnRetard: bandes.filter(b => b.statut === 'retard').length
    }
  }, [marches, getBandesByMarche, getMarcheBudgetUtilise, getMarcheProgress])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    // Données
    marches,
    bandesLivraison,
    materiels,
    employes,
    loading,
    error,
    
    // Filtres et recherche
    filters,
    updateFilters,
    resetFilters,
    getFilteredMarches,
    
    // Statistiques
    getStats,
    getMarcheStats,
    
    // Actions sur les marchés
    createMarche,
    updateMarche,
    deleteMarche,
    
    // Actions sur les bandes de livraison
    createBandeLivraison,
    updateBandeLivraison,
    deleteBandeLivraison,
    
    // Utilitaires
    getBandesByMarche,
    getMarcheProgress,
    getMarcheBudgetUtilise,
    checkMarcheAlertes,
    fetchAllData
  }
} 