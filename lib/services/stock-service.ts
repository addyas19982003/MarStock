import { executeQuery } from '../database'

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

export class StockService {
  // ===== MATERIELS =====
  
  // Récupérer tous les matériels
  static async getAllMateriels(): Promise<Materiel[]> {
    try {
      const materiels = await executeQuery(`
        SELECT m.*, 
               c.nom as categorie_nom,
               f.nom as fournisseur_nom,
               e.nom as employe_nom,
               e.prenom as employe_prenom,
               mar.nom as marche_nom
        FROM materiels m
        LEFT JOIN categories_materiel c ON m.category = c.nom
        LEFT JOIN fournisseurs f ON m.fournisseur_id = f.id
        LEFT JOIN employes e ON m.employe_id = e.id
        LEFT JOIN marches mar ON m.marche_id = mar.id
        ORDER BY m.created_at DESC
      `) as Materiel[]
      
      return materiels
    } catch (error) {
      console.error('Erreur lors de la récupération des matériels:', error)
      return []
    }
  }

  // Récupérer un matériel par ID
  static async getMaterielById(id: number): Promise<Materiel | null> {
    try {
      const materiels = await executeQuery(`
        SELECT m.*, 
               c.nom as categorie_nom,
               f.nom as fournisseur_nom,
               e.nom as employe_nom,
               e.prenom as employe_prenom,
               mar.nom as marche_nom
        FROM materiels m
        LEFT JOIN categories_materiel c ON m.category = c.nom
        LEFT JOIN fournisseurs f ON m.fournisseur_id = f.id
        LEFT JOIN employes e ON m.employe_id = e.id
        LEFT JOIN marches mar ON m.marche_id = mar.id
        WHERE m.id = ?
      `, [id]) as Materiel[]
      
      return materiels.length > 0 ? materiels[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération du matériel:', error)
      return null
    }
  }

  // Créer un nouveau matériel
  static async createMateriel(materielData: Omit<Materiel, 'id' | 'created_at' | 'updated_at'>, userId: number): Promise<Materiel | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO materiels (nom, description, quantite, prix_unitaire, statut, category, location, serial_number, warranty_date, fournisseur_id, seuil_alerte, unite, code_barre, marche_id, employe_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        materielData.nom,
        materielData.description,
        materielData.quantite,
        materielData.prix_unitaire,
        materielData.statut,
        materielData.category,
        materielData.location,
        materielData.serial_number || null,
        materielData.warranty_date || null,
        materielData.fournisseur_id || null,
        materielData.seuil_alerte || 0,
        materielData.unite || 'unité',
        materielData.code_barre || null,
        materielData.marche_id || null,
        materielData.employe_id || null,
        userId
      ]) as any

      if (result.insertId) {
        return await this.getMaterielById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création du matériel:', error)
      throw error
    }
  }

  // Mettre à jour un matériel
  static async updateMateriel(id: number, updates: Partial<Materiel>): Promise<Materiel | null> {
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
        UPDATE materiels SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getMaterielById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du matériel:', error)
      throw error
    }
  }

  // Supprimer un matériel
  static async deleteMateriel(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM materiels WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du matériel:', error)
      return false
    }
  }

  // ===== MOUVEMENTS DE STOCK =====

  // Créer un mouvement de stock
  static async createMouvementStock(mouvementData: Omit<MouvementStock, 'id' | 'created_at'>, userId: number): Promise<MouvementStock | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO mouvements_stock (materiel_id, type, quantite, quantite_avant, quantite_apres, raison, reference, employe_id, fournisseur_id, marche_id, location_source, location_destination, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        mouvementData.materiel_id,
        mouvementData.type,
        mouvementData.quantite,
        mouvementData.quantite_avant,
        mouvementData.quantite_apres,
        mouvementData.raison,
        mouvementData.reference || null,
        mouvementData.employe_id || null,
        mouvementData.fournisseur_id || null,
        mouvementData.marche_id || null,
        mouvementData.location_source || null,
        mouvementData.location_destination || null,
        userId
      ]) as any

      if (result.insertId) {
        return await this.getMouvementStockById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création du mouvement de stock:', error)
      throw error
    }
  }

  // Récupérer un mouvement de stock par ID
  static async getMouvementStockById(id: number): Promise<MouvementStock | null> {
    try {
      const mouvements = await executeQuery(`
        SELECT ms.*, m.nom as materiel_nom, e.nom as employe_nom, f.nom as fournisseur_nom
        FROM mouvements_stock ms
        LEFT JOIN materiels m ON ms.materiel_id = m.id
        LEFT JOIN employes e ON ms.employe_id = e.id
        LEFT JOIN fournisseurs f ON ms.fournisseur_id = f.id
        WHERE ms.id = ?
      `, [id]) as MouvementStock[]
      
      return mouvements.length > 0 ? mouvements[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération du mouvement de stock:', error)
      return null
    }
  }

  // Récupérer tous les mouvements de stock
  static async getAllMouvementsStock(): Promise<MouvementStock[]> {
    try {
      const mouvements = await executeQuery(`
        SELECT ms.*, m.nom as materiel_nom, e.nom as employe_nom, f.nom as fournisseur_nom
        FROM mouvements_stock ms
        LEFT JOIN materiels m ON ms.materiel_id = m.id
        LEFT JOIN employes e ON ms.employe_id = e.id
        LEFT JOIN fournisseurs f ON ms.fournisseur_id = f.id
        ORDER BY ms.created_at DESC
      `) as MouvementStock[]
      
      return mouvements
    } catch (error) {
      console.error('Erreur lors de la récupération des mouvements de stock:', error)
      return []
    }
  }

  // ===== ALERTES DE STOCK =====

  // Créer une alerte de stock
  static async createAlerteStock(alerteData: Omit<AlerteStock, 'id' | 'created_at'>, userId: number): Promise<AlerteStock | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO alertes_stock (materiel_id, type, message, niveau, is_resolved, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        alerteData.materiel_id,
        alerteData.type,
        alerteData.message,
        alerteData.niveau,
        alerteData.is_resolved || false,
        userId
      ]) as any

      if (result.insertId) {
        return await this.getAlerteStockById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte de stock:', error)
      throw error
    }
  }

  // Récupérer une alerte de stock par ID
  static async getAlerteStockById(id: number): Promise<AlerteStock | null> {
    try {
      const alertes = await executeQuery(`
        SELECT a.*, m.nom as materiel_nom
        FROM alertes_stock a
        LEFT JOIN materiels m ON a.materiel_id = m.id
        WHERE a.id = ?
      `, [id]) as AlerteStock[]
      
      return alertes.length > 0 ? alertes[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'alerte de stock:', error)
      return null
    }
  }

  // Récupérer toutes les alertes de stock
  static async getAllAlertesStock(): Promise<AlerteStock[]> {
    try {
      const alertes = await executeQuery(`
        SELECT a.*, m.nom as materiel_nom
        FROM alertes_stock a
        LEFT JOIN materiels m ON a.materiel_id = m.id
        ORDER BY a.created_at DESC
      `) as AlerteStock[]
      
      return alertes
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes de stock:', error)
      return []
    }
  }

  // Résoudre une alerte de stock
  static async resolveAlerteStock(id: number, userId: number): Promise<boolean> {
    try {
      await executeQuery(`
        UPDATE alertes_stock SET is_resolved = true, resolved_by = ?, resolved_at = NOW() WHERE id = ?
      `, [userId, id])
      return true
    } catch (error) {
      console.error('Erreur lors de la résolution de l\'alerte de stock:', error)
      return false
    }
  }

  // ===== CATEGORIES =====

  // Récupérer toutes les catégories
  static async getAllCategories(): Promise<CategorieMateriel[]> {
    try {
      const categories = await executeQuery(`
        SELECT * FROM categories_materiel ORDER BY nom
      `) as CategorieMateriel[]
      
      return categories
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      return []
    }
  }

  // Créer une catégorie
  static async createCategorie(categorieData: Omit<CategorieMateriel, 'id' | 'created_at'>): Promise<CategorieMateriel | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO categories_materiel (nom, description, couleur, icone, parent_id)
        VALUES (?, ?, ?, ?, ?)
      `, [
        categorieData.nom,
        categorieData.description || null,
        categorieData.couleur || '#3B82F6',
        categorieData.icone || null,
        categorieData.parent_id || null
      ]) as any

      if (result.insertId) {
        return await this.getCategorieById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      throw error
    }
  }

  // Récupérer une catégorie par ID
  static async getCategorieById(id: number): Promise<CategorieMateriel | null> {
    try {
      const categories = await executeQuery(`
        SELECT * FROM categories_materiel WHERE id = ?
      `, [id]) as CategorieMateriel[]
      
      return categories.length > 0 ? categories[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error)
      return null
    }
  }

  // ===== FOURNISSEURS =====

  // Récupérer tous les fournisseurs
  static async getAllFournisseurs(): Promise<Fournisseur[]> {
    try {
      const fournisseurs = await executeQuery(`
        SELECT * FROM fournisseurs ORDER BY nom
      `) as Fournisseur[]
      
      return fournisseurs
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error)
      return []
    }
  }

  // Créer un fournisseur
  static async createFournisseur(fournisseurData: Omit<Fournisseur, 'id' | 'created_at' | 'updated_at'>): Promise<Fournisseur | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO fournisseurs (nom, email, telephone, adresse, ville, code_postal, pays, siret, statut, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fournisseurData.nom,
        fournisseurData.email,
        fournisseurData.telephone,
        fournisseurData.adresse,
        fournisseurData.ville,
        fournisseurData.code_postal,
        fournisseurData.pays,
        fournisseurData.siret || null,
        fournisseurData.statut || 'actif',
        fournisseurData.notes || null
      ]) as any

      if (result.insertId) {
        return await this.getFournisseurById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création du fournisseur:', error)
      throw error
    }
  }

  // Récupérer un fournisseur par ID
  static async getFournisseurById(id: number): Promise<Fournisseur | null> {
    try {
      const fournisseurs = await executeQuery(`
        SELECT * FROM fournisseurs WHERE id = ?
      `, [id]) as Fournisseur[]
      
      return fournisseurs.length > 0 ? fournisseurs[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération du fournisseur:', error)
      return null
    }
  }

  // ===== STATISTIQUES =====

  // Récupérer les statistiques de stock
  static async getStockStats(): Promise<any> {
    try {
      const stats = await executeQuery(`
        SELECT 
          COUNT(*) as total_materiels,
          SUM(quantite) as total_quantite,
          SUM(quantite * prix_unitaire) as valeur_totale,
          COUNT(CASE WHEN quantite <= seuil_alerte THEN 1 END) as alertes_stock,
          COUNT(CASE WHEN statut = 'disponible' THEN 1 END) as disponibles,
          COUNT(CASE WHEN statut = 'affecte' THEN 1 END) as affectes,
          COUNT(CASE WHEN statut = 'maintenance' THEN 1 END) as en_maintenance,
          COUNT(DISTINCT category) as categories_count
        FROM materiels
      `) as any[]
      
      return stats[0]
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques de stock:', error)
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
      const materiels = await this.getAllMateriels()
      const alertes: AlerteStock[] = []

      for (const materiel of materiels) {
        // Alerte stock critique
        if (materiel.quantite <= materiel.seuil_alerte && materiel.quantite > 0) {
          alertes.push({
            id: 0,
            materiel_id: materiel.id,
            type: 'stock_critique',
            message: `Stock critique pour ${materiel.nom}: ${materiel.quantite} ${materiel.unite} restantes`,
            niveau: 'critical',
            is_resolved: false,
            created_at: new Date().toISOString()
          })
        }

        // Alerte stock épuisé
        if (materiel.quantite === 0) {
          alertes.push({
            id: 0,
            materiel_id: materiel.id,
            type: 'stock_critique',
            message: `Stock épuisé pour ${materiel.nom}`,
            niveau: 'critical',
            is_resolved: false,
            created_at: new Date().toISOString()
          })
        }

        // Alerte garantie expirée
        if (materiel.warranty_date) {
          const warrantyDate = new Date(materiel.warranty_date)
          const maintenant = new Date()
          const joursRestants = Math.ceil((warrantyDate.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24))
          
          if (joursRestants <= 30 && joursRestants > 0) {
            alertes.push({
              id: 0,
              materiel_id: materiel.id,
              type: 'garantie_expire',
              message: `Garantie de ${materiel.nom} expire dans ${joursRestants} jours`,
              niveau: 'warning',
              is_resolved: false,
              created_at: new Date().toISOString()
            })
          }
        }
      }

      return alertes
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes de stock:', error)
      return []
    }
  }
} 