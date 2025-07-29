import { executeQuery } from '../database'

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

export class MarcheService {
  // Récupérer tous les marchés
  static async getAllMarches(): Promise<Marche[]> {
    try {
      const marches = await executeQuery(`
        SELECT m.*, 
               u.full_name as created_by_name,
               COUNT(b.id) as bandes_count,
               SUM(CASE WHEN b.statut = 'livree' THEN 1 ELSE 0 END) as bandes_livrees
        FROM marches m
        LEFT JOIN users u ON m.created_by = u.id
        LEFT JOIN bandes_livraison b ON m.id = b.marche_id
        GROUP BY m.id
        ORDER BY m.created_at DESC
      `) as Marche[]
      
      return marches
    } catch (error) {
      console.error('Erreur lors de la récupération des marchés:', error)
      return []
    }
  }

  // Récupérer un marché par ID
  static async getMarcheById(id: number): Promise<Marche | null> {
    try {
      const marches = await executeQuery(`
        SELECT m.*, 
               u.full_name as created_by_name
        FROM marches m
        LEFT JOIN users u ON m.created_by = u.id
        WHERE m.id = ?
      `, [id]) as Marche[]
      
      return marches.length > 0 ? marches[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération du marché:', error)
      return null
    }
  }

  // Créer un nouveau marché
  static async createMarche(marcheData: Omit<Marche, 'id' | 'created_at' | 'updated_at'>, userId: number): Promise<Marche | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO marches (nom, description, date_debut, date_fin, budget, statut, priority, progress, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        marcheData.nom,
        marcheData.description,
        marcheData.date_debut,
        marcheData.date_fin,
        marcheData.budget,
        marcheData.statut,
        marcheData.priority,
        marcheData.progress || 0,
        userId
      ]) as any

      if (result.insertId) {
        return await this.getMarcheById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création du marché:', error)
      throw error
    }
  }

  // Mettre à jour un marché
  static async updateMarche(id: number, updates: Partial<Marche>): Promise<Marche | null> {
    try {
      const updateFields = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
        .map(key => `${key} = ?`)
        .join(', ')

      const updateValues = Object.values(updates).filter((_, index) => 
        Object.keys(updates)[index] !== 'id' && 
        Object.keys(updates)[index] !== 'created_at' && 
        Object.keys(updates)[index] !== 'updated_at'
      )

      await executeQuery(`
        UPDATE marches SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getMarcheById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du marché:', error)
      throw error
    }
  }

  // Supprimer un marché
  static async deleteMarche(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM marches WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du marché:', error)
      return false
    }
  }

  // Récupérer les bandes de livraison d'un marché
  static async getBandesByMarche(marcheId: number): Promise<BandeLivraison[]> {
    try {
      const bandes = await executeQuery(`
        SELECT b.*, u.full_name as created_by_name
        FROM bandes_livraison b
        LEFT JOIN users u ON b.created_by = u.id
        WHERE b.marche_id = ?
        ORDER BY b.date_livraison
      `, [marcheId]) as BandeLivraison[]
      
      return bandes
    } catch (error) {
      console.error('Erreur lors de la récupération des bandes de livraison:', error)
      return []
    }
  }

  // Créer une bande de livraison
  static async createBandeLivraison(bandeData: Omit<BandeLivraison, 'id' | 'created_at' | 'updated_at'>, userId: number): Promise<BandeLivraison | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO bandes_livraison (nom, description, marche_id, date_livraison, statut, montant, fournisseur, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bandeData.nom,
        bandeData.description,
        bandeData.marche_id,
        bandeData.date_livraison,
        bandeData.statut,
        bandeData.montant,
        bandeData.fournisseur,
        userId
      ]) as any

      if (result.insertId) {
        return await this.getBandeById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de la bande de livraison:', error)
      throw error
    }
  }

  // Récupérer une bande de livraison par ID
  static async getBandeById(id: number): Promise<BandeLivraison | null> {
    try {
      const bandes = await executeQuery(`
        SELECT b.*, u.full_name as created_by_name
        FROM bandes_livraison b
        LEFT JOIN users u ON b.created_by = u.id
        WHERE b.id = ?
      `, [id]) as BandeLivraison[]
      
      return bandes.length > 0 ? bandes[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de la bande de livraison:', error)
      return null
    }
  }

  // Mettre à jour une bande de livraison
  static async updateBandeLivraison(id: number, updates: Partial<BandeLivraison>): Promise<BandeLivraison | null> {
    try {
      const updateFields = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
        .map(key => `${key} = ?`)
        .join(', ')

      const updateValues = Object.values(updates).filter((_, index) => 
        Object.keys(updates)[index] !== 'id' && 
        Object.keys(updates)[index] !== 'created_at' && 
        Object.keys(updates)[index] !== 'updated_at'
      )

      await executeQuery(`
        UPDATE bandes_livraison SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getBandeById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bande de livraison:', error)
      throw error
    }
  }

  // Supprimer une bande de livraison
  static async deleteBandeLivraison(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM bandes_livraison WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la bande de livraison:', error)
      return false
    }
  }

  // Calculer le progrès d'un marché
  static async getMarcheProgress(marcheId: number): Promise<number> {
    try {
      const bandes = await this.getBandesByMarche(marcheId)
      if (bandes.length === 0) return 0
      
      const livrees = bandes.filter(b => b.statut === 'livree').length
      return Math.round((livrees / bandes.length) * 100)
    } catch (error) {
      console.error('Erreur lors du calcul du progrès:', error)
      return 0
    }
  }

  // Calculer le budget utilisé d'un marché
  static async getMarcheBudgetUtilise(marcheId: number): Promise<number> {
    try {
      const bandes = await this.getBandesByMarche(marcheId)
      return bandes.reduce((sum, bande) => sum + bande.montant, 0)
    } catch (error) {
      console.error('Erreur lors du calcul du budget utilisé:', error)
      return 0
    }
  }

  // Récupérer les statistiques des marchés
  static async getMarcheStats(): Promise<any> {
    try {
      const stats = await executeQuery(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
          SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) as termines,
          SUM(CASE WHEN statut = 'suspendu' THEN 1 ELSE 0 END) as suspendus,
          SUM(budget) as budget_total,
          AVG(budget) as budget_moyen
        FROM marches
      `) as any[]
      
      return stats[0]
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques des marchés:', error)
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
      const alertes = []
      const marches = await this.getAllMarches()
      
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
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes:', error)
      return []
    }
  }
} 