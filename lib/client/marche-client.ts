export interface Marche {
  id: number
  nom: string
  description: string
  date_debut: string
  date_fin: string
  budget: number
  statut: 'actif' | 'termine' | 'suspendu'
  priority: 'low' | 'medium' | 'high'
  progress: number
  created_by?: number
  created_at: string
  updated_at: string
}

export interface BandeLivraison {
  id: number
  nom: string
  description: string
  marche_id: number
  date_livraison: string
  statut: 'en_attente' | 'en_cours' | 'livree' | 'retard'
  montant: number
  fournisseur: string
  created_by?: number
  created_at: string
  updated_at: string
}

export class MarcheClient {
  // Récupérer tous les marchés
  static async getAllMarches(): Promise<Marche[]> {
    try {
      const response = await fetch('/api/marches')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des marchés')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des marchés:', error)
      return []
    }
  }

  // Récupérer un marché par ID
  static async getMarcheById(id: number): Promise<Marche | null> {
    try {
      const response = await fetch(`/api/marches/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération du marché')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération du marché:', error)
      return null
    }
  }

  // Créer un nouveau marché
  static async createMarche(marcheData: Omit<Marche, 'id' | 'created_at' | 'updated_at'>): Promise<Marche | null> {
    try {
      const response = await fetch('/api/marches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marcheData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du marché')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création du marché:', error)
      throw error
    }
  }

  // Mettre à jour un marché
  static async updateMarche(id: number, updates: Partial<Marche>): Promise<Marche | null> {
    try {
      const response = await fetch(`/api/marches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du marché')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du marché:', error)
      throw error
    }
  }

  // Supprimer un marché
  static async deleteMarche(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/marches/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression du marché')
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du marché:', error)
      return false
    }
  }

  // Récupérer les bandes de livraison d'un marché
  static async getBandesByMarche(marcheId: number): Promise<BandeLivraison[]> {
    try {
      const response = await fetch(`/api/marches/${marcheId}/bandes`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des bandes de livraison')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des bandes de livraison:', error)
      return []
    }
  }

  // Créer une bande de livraison
  static async createBandeLivraison(bandeData: Omit<BandeLivraison, 'id' | 'created_at' | 'updated_at'>): Promise<BandeLivraison | null> {
    try {
      const response = await fetch('/api/bandes-livraison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bandeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la bande de livraison')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la bande de livraison:', error)
      throw error
    }
  }

  // Récupérer une bande de livraison par ID
  static async getBandeById(id: number): Promise<BandeLivraison | null> {
    try {
      const response = await fetch(`/api/bandes-livraison/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération de la bande de livraison')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la bande de livraison:', error)
      return null
    }
  }

  // Mettre à jour une bande de livraison
  static async updateBandeLivraison(id: number, updates: Partial<BandeLivraison>): Promise<BandeLivraison | null> {
    try {
      const response = await fetch(`/api/bandes-livraison/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la bande de livraison')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bande de livraison:', error)
      throw error
    }
  }

  // Supprimer une bande de livraison
  static async deleteBandeLivraison(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/bandes-livraison/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de la bande de livraison')
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la bande de livraison:', error)
      return false
    }
  }

  // Récupérer les statistiques des marchés
  static async getMarcheStats(): Promise<any> {
    try {
      const response = await fetch('/api/marches/stats')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des marchés:', error)
      return {
        total: 0,
        actifs: 0,
        termines: 0,
        suspendus: 0,
        budget_total: 0,
        budget_moyen: 0
      }
    }
  }

  // Vérifier les alertes de marché
  static async checkMarcheAlertes(): Promise<any[]> {
    try {
      const response = await fetch('/api/marches/alertes')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des alertes')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes:', error)
      return []
    }
  }
} 