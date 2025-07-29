import { useState, useEffect, useCallback } from 'react'
import { enhancedMockAPI } from '@/lib/mock-data-enhanced'
import type { 
  Materiel, 
  MouvementStock, 
  AlerteStock, 
  Maintenance, 
  Inventaire,
  CategorieMateriel,
  Fournisseur 
} from '@/lib/types'
import { useToast } from '@/components/ui/toast'

export interface StockFilters {
  searchTerm: string
  statusFilter: string
  categoryFilter: string
  locationFilter: string
  employeeFilter: string
  fournisseurFilter: string
  dateRange: { start: string; end: string }
}

export interface StockStats {
  total: number
  disponible: number
  affecte: number
  maintenance: number
  hors_service: number
  en_transit: number
  critique: number
  valeur_totale: number
  alertes_actives: number
}

export function useStock() {
  const { toast } = useToast()
  const [materiels, setMateriels] = useState<Materiel[]>([])
  const [mouvements, setMouvements] = useState<MouvementStock[]>([])
  const [alertes, setAlertes] = useState<AlerteStock[]>([])
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [inventaires, setInventaires] = useState<Inventaire[]>([])
  const [categories, setCategories] = useState<CategorieMateriel[]>([])
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<StockFilters>({
    searchTerm: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    locationFilter: 'all',
    employeeFilter: 'all',
    fournisseurFilter: 'all',
    dateRange: { start: '', end: '' }
  })

  // Charger toutes les données
  const fetchAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [
        materielsData,
        mouvementsData,
        alertesData,
        maintenancesData,
        inventairesData,
        categoriesData,
        fournisseursData
      ] = await Promise.all([
        enhancedMockAPI.getMateriels(),
        enhancedMockAPI.getMouvementsStock(),
        enhancedMockAPI.getAlertesStock(),
        enhancedMockAPI.getMaintenances(),
        enhancedMockAPI.getInventaires(),
        enhancedMockAPI.getCategoriesMateriel(),
        enhancedMockAPI.getFournisseurs()
      ])

      setMateriels(materielsData)
      setMouvements(mouvementsData)
      setAlertes(alertesData)
      setMaintenances(maintenancesData)
      setInventaires(inventairesData)
      setCategories(categoriesData)
      setFournisseurs(fournisseursData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données de stock',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Calculer les statistiques
  const getStats = useCallback((): StockStats => {
    const total = materiels.length
    const disponible = materiels.filter(m => m.statut === 'disponible').length
    const affecte = materiels.filter(m => m.statut === 'affecte').length
    const maintenance = materiels.filter(m => m.statut === 'maintenance').length
    const hors_service = materiels.filter(m => m.statut === 'hors_service').length
    const en_transit = materiels.filter(m => m.statut === 'en_transit').length
    const critique = materiels.filter(m => m.quantite <= (m.seuil_alerte || 5)).length
    const valeur_totale = materiels.reduce((sum, m) => sum + (m.quantite * m.prix_unitaire), 0)
    const alertes_actives = alertes.filter(a => !a.is_resolved).length

    return {
      total,
      disponible,
      affecte,
      maintenance,
      hors_service,
      en_transit,
      critique,
      valeur_totale,
      alertes_actives
    }
  }, [materiels, alertes])

  // Filtrer les matériels
  const getFilteredMateriels = useCallback(() => {
    return materiels.filter(materiel => {
      const matchesSearch = 
        materiel.nom.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        materiel.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (materiel.serial_number && materiel.serial_number.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (materiel.code_barre && materiel.code_barre.toLowerCase().includes(filters.searchTerm.toLowerCase()))

      const matchesStatus = filters.statusFilter === 'all' || materiel.statut === filters.statusFilter
      const matchesCategory = filters.categoryFilter === 'all' || materiel.category === filters.categoryFilter
      const matchesLocation = filters.locationFilter === 'all' || materiel.location === filters.locationFilter
      const matchesFournisseur = filters.fournisseurFilter === 'all' || materiel.fournisseur_id === filters.fournisseurFilter

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation && matchesFournisseur
    })
  }, [materiels, filters])

  // Créer un mouvement de stock
  const createMouvement = useCallback(async (mouvementData: Omit<MouvementStock, 'id' | 'created_at'>) => {
    try {
      const nouveauMouvement = await enhancedMockAPI.createMouvementStock(mouvementData)
      setMouvements(prev => [nouveauMouvement, ...prev])
      
      // Mettre à jour la quantité du matériel
      const materiel = materiels.find(m => m.id === mouvementData.materiel_id)
      if (materiel) {
        const updatedMateriel = { ...materiel, quantite: mouvementData.quantite_apres }
        setMateriels(prev => prev.map(m => m.id === materiel.id ? updatedMateriel : m))
      }

      toast({
        title: 'Succès',
        description: 'Mouvement de stock enregistré'
      })
    } catch (error) {
      console.error('Erreur lors de la création du mouvement:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer le mouvement de stock',
        variant: 'destructive'
      })
    }
  }, [materiels, toast])

  // Vérifier les alertes
  const checkAlertes = useCallback(() => {
    const nouvellesAlertes: Omit<AlerteStock, 'id' | 'created_at'>[] = []

    materiels.forEach(materiel => {
      // Alerte stock critique
      if (materiel.quantite <= (materiel.seuil_alerte || 5)) {
        nouvellesAlertes.push({
          materiel_id: materiel.id,
          type: 'stock_critique',
          message: `Stock critique pour ${materiel.nom}: ${materiel.quantite} unités restantes`,
          niveau: 'critical',
          is_resolved: false
        })
      }

      // Alerte garantie
      if (materiel.warranty_date) {
        const warrantyDate = new Date(materiel.warranty_date)
        const now = new Date()
        const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
        
        if (warrantyDate <= threeMonthsFromNow) {
          nouvellesAlertes.push({
            materiel_id: materiel.id,
            type: 'garantie_expire',
            message: `Garantie expire bientôt pour ${materiel.nom}`,
            niveau: 'warning',
            is_resolved: false
          })
        }
      }
    })

    return nouvellesAlertes
  }, [materiels])

  // Résoudre une alerte
  const resolveAlerte = useCallback(async (alerteId: string, resolvedBy: string) => {
    try {
      await enhancedMockAPI.resolveAlerteStock(alerteId, resolvedBy)
      setAlertes(prev => prev.map(a => 
        a.id === alerteId 
          ? { ...a, is_resolved: true, resolved_by: resolvedBy, resolved_at: new Date().toISOString() }
          : a
      ))
      
      toast({
        title: 'Succès',
        description: 'Alerte résolue'
      })
    } catch (error) {
      console.error('Erreur lors de la résolution de l\'alerte:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de résoudre l\'alerte',
        variant: 'destructive'
      })
    }
  }, [toast])

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<StockFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'all',
      categoryFilter: 'all',
      locationFilter: 'all',
      employeeFilter: 'all',
      fournisseurFilter: 'all',
      dateRange: { start: '', end: '' }
    })
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    // Données
    materiels,
    mouvements,
    alertes,
    maintenances,
    inventaires,
    categories,
    fournisseurs,
    loading,
    
    // Filtres et recherche
    filters,
    updateFilters,
    resetFilters,
    getFilteredMateriels,
    
    // Statistiques
    getStats,
    
    // Actions
    createMouvement,
    resolveAlerte,
    checkAlertes,
    fetchAllData
  }
} 