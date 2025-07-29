export interface Materiel {
  id: number
  nom: string
  description: string
  quantite: number
  prix_unitaire: number
  statut: 'disponible' | 'affecte' | 'maintenance' | 'hors_service' | 'en_transit'
  category: string
  location: string
  serial_number?: string
  warranty_date?: string
  fournisseur_id?: number
  seuil_alerte: number
  unite: string
  code_barre?: string
  marche_id?: number
  employe_id?: number
  created_by?: number
  created_at: string
  updated_at: string
}

export interface MouvementStock {
  id: number
  materiel_id: number
  type: 'entree' | 'sortie' | 'transfert' | 'ajustement' | 'affectation' | 'retour'
  quantite: number
  quantite_avant: number
  quantite_apres: number
  raison: string
  reference?: string
  employe_id?: number
  fournisseur_id?: number
  marche_id?: number
  location_source?: string
  location_destination?: string
  created_by?: number
  created_at: string
}

export interface AlerteStock {
  id: number
  materiel_id: number
  type: 'stock_critique' | 'garantie_expire' | 'maintenance_requise' | 'stock_surplus'
  message: string
  niveau: 'info' | 'warning' | 'critical'
  is_resolved: boolean
  resolved_by?: number
  resolved_at?: string
  created_at: string
}

export interface CategorieMateriel {
  id: number
  nom: string
  description?: string
  couleur: string
  icone?: string
  parent_id?: number
  created_at: string
}

export interface Fournisseur {
  id: number
  nom: string
  email: string
  telephone: string
  adresse: string
  ville: string
  code_postal: string
  pays: string
  siret?: string
  statut: 'actif' | 'inactif'
  notes?: string
  created_at: string
  updated_at: string
}

export class StockClient {
  // ===== MATERIELS =====

  // Récupérer tous les matériels
  static async getAllMateriels(): Promise<Materiel[]> {
    try {
      const response = await fetch('/api/stock/materiels')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des matériels')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des matériels:', error)
      return []
    }
  }

  // Récupérer un matériel par ID
  static async getMaterielById(id: number): Promise<Materiel | null> {
    try {
      const response = await fetch(`/api/stock/materiels/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération du matériel')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération du matériel:', error)
      return null
    }
  }

  // Créer un nouveau matériel
  static async createMateriel(materielData: Omit<Materiel, 'id' | 'created_at' | 'updated_at'>): Promise<Materiel | null> {
    try {
      const response = await fetch('/api/stock/materiels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materielData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du matériel')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création du matériel:', error)
      throw error
    }
  }

  // Mettre à jour un matériel
  static async updateMateriel(id: number, updates: Partial<Materiel>): Promise<Materiel | null> {
    try {
      const response = await fetch(`/api/stock/materiels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du matériel')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du matériel:', error)
      throw error
    }
  }

  // Supprimer un matériel
  static async deleteMateriel(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/stock/materiels/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression du matériel')
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du matériel:', error)
      return false
    }
  }

  // ===== MOUVEMENTS DE STOCK =====

  // Récupérer tous les mouvements de stock
  static async getAllMouvementsStock(): Promise<MouvementStock[]> {
    try {
      const response = await fetch('/api/stock/mouvements')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des mouvements de stock')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des mouvements de stock:', error)
      return []
    }
  }

  // Créer un mouvement de stock
  static async createMouvementStock(mouvementData: Omit<MouvementStock, 'id' | 'created_at'>): Promise<MouvementStock | null> {
    try {
      const response = await fetch('/api/stock/mouvements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mouvementData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du mouvement de stock')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création du mouvement de stock:', error)
      throw error
    }
  }

  // ===== ALERTES DE STOCK =====

  // Récupérer toutes les alertes de stock
  static async getAllAlertesStock(): Promise<AlerteStock[]> {
    try {
      const response = await fetch('/api/stock/alertes')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des alertes de stock')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes de stock:', error)
      return []
    }
  }

  // Résoudre une alerte de stock
  static async resolveAlerteStock(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/stock/alertes/${id}/resolve`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la résolution de l\'alerte')
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la résolution de l\'alerte:', error)
      return false
    }
  }

  // ===== CATEGORIES =====

  // Récupérer toutes les catégories
  static async getAllCategories(): Promise<CategorieMateriel[]> {
    try {
      const response = await fetch('/api/stock/categories')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des catégories')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      return []
    }
  }

  // Créer une catégorie
  static async createCategorie(categorieData: Omit<CategorieMateriel, 'id' | 'created_at'>): Promise<CategorieMateriel | null> {
    try {
      const response = await fetch('/api/stock/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categorieData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la catégorie')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      throw error
    }
  }

  // ===== FOURNISSEURS =====

  // Récupérer tous les fournisseurs
  static async getAllFournisseurs(): Promise<Fournisseur[]> {
    try {
      const response = await fetch('/api/stock/fournisseurs')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des fournisseurs')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error)
      return []
    }
  }

  // Créer un fournisseur
  static async createFournisseur(fournisseurData: Omit<Fournisseur, 'id' | 'created_at' | 'updated_at'>): Promise<Fournisseur | null> {
    try {
      const response = await fetch('/api/stock/fournisseurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fournisseurData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du fournisseur')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création du fournisseur:', error)
      throw error
    }
  }

  // ===== STATISTIQUES =====

  // Récupérer les statistiques de stock
  static async getStockStats(): Promise<any> {
    try {
      const response = await fetch('/api/stock/stats')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de stock:', error)
      return {
        total_materiels: 0,
        total_quantite: 0,
        valeur_totale: 0,
        alertes_stock: 0,
        disponibles: 0,
        affectes: 0,
        en_maintenance: 0,
        categories_count: 0
      }
    }
  }

  // Vérifier les alertes de stock
  static async checkStockAlertes(): Promise<AlerteStock[]> {
    try {
      const response = await fetch('/api/stock/alertes/check')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la vérification des alertes')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes de stock:', error)
      return []
    }
  }

  // ===== UTILITAIRES =====

  // Calculer la valeur totale d'un matériel
  static calculateValeurTotale(materiel: Materiel): number {
    return materiel.quantite * materiel.prix_unitaire
  }

  // Vérifier si un matériel est en alerte de stock
  static isStockEnAlerte(materiel: Materiel): boolean {
    return materiel.quantite <= materiel.seuil_alerte
  }

  // Obtenir le statut d'un matériel
  static getStatutBadge(materiel: Materiel): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
    switch (materiel.statut) {
      case 'disponible':
        return { label: 'Disponible', variant: 'default' }
      case 'affecte':
        return { label: 'Affecté', variant: 'secondary' }
      case 'maintenance':
        return { label: 'Maintenance', variant: 'outline' }
      case 'hors_service':
        return { label: 'Hors service', variant: 'destructive' }
      case 'en_transit':
        return { label: 'En transit', variant: 'outline' }
      default:
        return { label: 'Inconnu', variant: 'secondary' }
    }
  }
} 