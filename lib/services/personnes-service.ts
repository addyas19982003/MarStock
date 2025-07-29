import { executeQuery } from '../database'

export interface Grade {
  id: number
  nom: string
  niveau: string
  salaire_base: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Direction {
  id: number
  nom: string
  code: string
  budget: number
  responsable_id?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Division {
  id: number
  nom: string
  code: string
  direction_id: number
  chef_id?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Bureau {
  id: number
  nom: string
  numero: string
  etage: number
  division_id: number
  capacite: number
  equipements?: string
  created_at: string
  updated_at: string
}

export interface Etage {
  id: number
  numero: number
  nom: string
  description?: string
  superficie: number
  created_at: string
  updated_at: string
}

export class PersonnesService {
  // ===== GRADES =====

  // Récupérer tous les grades
  static async getAllGrades(): Promise<Grade[]> {
    try {
      const grades = await executeQuery(`
        SELECT * FROM grades ORDER BY niveau ASC, nom ASC
      `) as Grade[]
      
      return grades
    } catch (error) {
      console.error('Erreur lors de la récupération des grades:', error)
      return []
    }
  }

  // Récupérer un grade par ID
  static async getGradeById(id: number): Promise<Grade | null> {
    try {
      const grades = await executeQuery(`
        SELECT * FROM grades WHERE id = ?
      `, [id]) as Grade[]
      
      return grades.length > 0 ? grades[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération du grade:', error)
      return null
    }
  }

  // Créer un nouveau grade
  static async createGrade(gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at'>): Promise<Grade | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO grades (nom, niveau, salaire_base, description)
        VALUES (?, ?, ?, ?)
      `, [
        gradeData.nom,
        gradeData.niveau,
        parseFloat(gradeData.salaire_base.toString()),
        gradeData.description || null
      ]) as any

      if (result.insertId) {
        return await this.getGradeById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création du grade:', error)
      throw error
    }
  }

  // Mettre à jour un grade
  static async updateGrade(id: number, updates: Partial<Grade>): Promise<Grade | null> {
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
        UPDATE grades SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getGradeById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du grade:', error)
      throw error
    }
  }

  // Supprimer un grade
  static async deleteGrade(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM grades WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du grade:', error)
      return false
    }
  }

  // ===== DIRECTIONS =====

  // Récupérer toutes les directions
  static async getAllDirections(): Promise<Direction[]> {
    try {
      const directions = await executeQuery(`
        SELECT d.*, e.nom as responsable_nom, e.prenom as responsable_prenom
        FROM directions d
        LEFT JOIN employes e ON d.responsable_id = e.id
        ORDER BY d.nom ASC
      `) as Direction[]
      
      return directions
    } catch (error) {
      console.error('Erreur lors de la récupération des directions:', error)
      return []
    }
  }

  // Créer une nouvelle direction
  static async createDirection(directionData: Omit<Direction, 'id' | 'created_at' | 'updated_at'>): Promise<Direction | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO directions (nom, code, budget, responsable_id, description)
        VALUES (?, ?, ?, ?, ?)
      `, [
        directionData.nom,
        directionData.code,
        parseFloat(directionData.budget.toString()),
        directionData.responsable_id || null,
        directionData.description || null
      ]) as any

      if (result.insertId) {
        return await this.getDirectionById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de la direction:', error)
      throw error
    }
  }

  // Récupérer une direction par ID
  static async getDirectionById(id: number): Promise<Direction | null> {
    try {
      const directions = await executeQuery(`
        SELECT d.*, e.nom as responsable_nom, e.prenom as responsable_prenom
        FROM directions d
        LEFT JOIN employes e ON d.responsable_id = e.id
        WHERE d.id = ?
      `, [id]) as Direction[]
      
      return directions.length > 0 ? directions[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de la direction:', error)
      return null
    }
  }

  // Mettre à jour une direction
  static async updateDirection(id: number, updates: Partial<Direction>): Promise<Direction | null> {
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
        UPDATE directions SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getDirectionById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la direction:', error)
      throw error
    }
  }

  // Supprimer une direction
  static async deleteDirection(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM directions WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la direction:', error)
      return false
    }
  }

  // ===== DIVISIONS =====

  // Récupérer toutes les divisions
  static async getAllDivisions(): Promise<Division[]> {
    try {
      const divisions = await executeQuery(`
        SELECT d.*, dir.nom as direction_nom, e.nom as chef_nom, e.prenom as chef_prenom
        FROM divisions d
        LEFT JOIN directions dir ON d.direction_id = dir.id
        LEFT JOIN employes e ON d.chef_id = e.id
        ORDER BY d.nom ASC
      `) as Division[]
      
      return divisions
    } catch (error) {
      console.error('Erreur lors de la récupération des divisions:', error)
      return []
    }
  }

  // Créer une nouvelle division
  static async createDivision(divisionData: Omit<Division, 'id' | 'created_at' | 'updated_at'>): Promise<Division | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO divisions (nom, code, direction_id, chef_id, description)
        VALUES (?, ?, ?, ?, ?)
      `, [
        divisionData.nom,
        divisionData.code,
        parseInt(divisionData.direction_id.toString()),
        divisionData.chef_id || null,
        divisionData.description || null
      ]) as any

      if (result.insertId) {
        return await this.getDivisionById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de la division:', error)
      throw error
    }
  }

  // Récupérer une division par ID
  static async getDivisionById(id: number): Promise<Division | null> {
    try {
      const divisions = await executeQuery(`
        SELECT d.*, dir.nom as direction_nom, e.nom as chef_nom, e.prenom as chef_prenom
        FROM divisions d
        LEFT JOIN directions dir ON d.direction_id = dir.id
        LEFT JOIN employes e ON d.chef_id = e.id
        WHERE d.id = ?
      `, [id]) as Division[]
      
      return divisions.length > 0 ? divisions[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de la division:', error)
      return null
    }
  }

  // Mettre à jour une division
  static async updateDivision(id: number, updates: Partial<Division>): Promise<Division | null> {
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
        UPDATE divisions SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getDivisionById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la division:', error)
      throw error
    }
  }

  // Supprimer une division
  static async deleteDivision(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM divisions WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la division:', error)
      return false
    }
  }

  // ===== BUREAUX =====

  // Récupérer tous les bureaux
  static async getAllBureaux(): Promise<Bureau[]> {
    try {
      const bureaux = await executeQuery(`
        SELECT b.*, d.nom as division_nom, e.nom as etage_nom
        FROM bureaux b
        LEFT JOIN divisions d ON b.division_id = d.id
        LEFT JOIN etages e ON b.etage = e.numero
        ORDER BY b.etage ASC, b.numero ASC
      `) as Bureau[]
      
      return bureaux
    } catch (error) {
      console.error('Erreur lors de la récupération des bureaux:', error)
      return []
    }
  }

  // Créer un nouveau bureau
  static async createBureau(bureauData: Omit<Bureau, 'id' | 'created_at' | 'updated_at'>): Promise<Bureau | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO bureaux (nom, numero, etage, division_id, capacite, equipements)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        bureauData.nom,
        bureauData.numero,
        parseInt(bureauData.etage.toString()),
        parseInt(bureauData.division_id.toString()),
        parseInt(bureauData.capacite.toString()),
        bureauData.equipements || null
      ]) as any

      if (result.insertId) {
        return await this.getBureauById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création du bureau:', error)
      throw error
    }
  }

  // Récupérer un bureau par ID
  static async getBureauById(id: number): Promise<Bureau | null> {
    try {
      const bureaux = await executeQuery(`
        SELECT b.*, d.nom as division_nom, e.nom as etage_nom
        FROM bureaux b
        LEFT JOIN divisions d ON b.division_id = d.id
        LEFT JOIN etages e ON b.etage = e.numero
        WHERE b.id = ?
      `, [id]) as Bureau[]
      
      return bureaux.length > 0 ? bureaux[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération du bureau:', error)
      return null
    }
  }

  // Mettre à jour un bureau
  static async updateBureau(id: number, updates: Partial<Bureau>): Promise<Bureau | null> {
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
        UPDATE bureaux SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getBureauById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bureau:', error)
      throw error
    }
  }

  // Supprimer un bureau
  static async deleteBureau(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM bureaux WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du bureau:', error)
      return false
    }
  }

  // ===== ETAGES =====

  // Récupérer tous les étages
  static async getAllEtages(): Promise<Etage[]> {
    try {
      const etages = await executeQuery(`
        SELECT * FROM etages ORDER BY numero ASC
      `) as Etage[]
      
      return etages
    } catch (error) {
      console.error('Erreur lors de la récupération des étages:', error)
      return []
    }
  }

  // Créer un nouvel étage
  static async createEtage(etageData: Omit<Etage, 'id' | 'created_at' | 'updated_at'>): Promise<Etage | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO etages (numero, nom, description, superficie)
        VALUES (?, ?, ?, ?)
      `, [
        parseInt(etageData.numero.toString()),
        etageData.nom,
        etageData.description || null,
        parseFloat(etageData.superficie.toString())
      ]) as any

      if (result.insertId) {
        return await this.getEtageById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de l\'étage:', error)
      throw error
    }
  }

  // Récupérer un étage par ID
  static async getEtageById(id: number): Promise<Etage | null> {
    try {
      const etages = await executeQuery(`
        SELECT * FROM etages WHERE id = ?
      `, [id]) as Etage[]
      
      return etages.length > 0 ? etages[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'étage:', error)
      return null
    }
  }

  // Mettre à jour un étage
  static async updateEtage(id: number, updates: Partial<Etage>): Promise<Etage | null> {
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
        UPDATE etages SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getEtageById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étage:', error)
      throw error
    }
  }

  // Supprimer un étage
  static async deleteEtage(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM etages WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étage:', error)
      return false
    }
  }

  // ===== STATISTIQUES =====

  // Récupérer les statistiques des personnes
  static async getPersonnesStats(): Promise<any> {
    try {
      const stats = await executeQuery(`
        SELECT 
          (SELECT COUNT(*) FROM grades) as total_grades,
          (SELECT COUNT(*) FROM directions) as total_directions,
          (SELECT COUNT(*) FROM divisions) as total_divisions,
          (SELECT COUNT(*) FROM bureaux) as total_bureaux,
          (SELECT COUNT(*) FROM etages) as total_etages,
          (SELECT SUM(budget) FROM directions) as budget_total,
          (SELECT AVG(salaire_base) FROM grades) as salaire_moyen
      `) as any[]
      
      return stats[0]
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return {
        total_grades: 0,
        total_directions: 0,
        total_divisions: 0,
        total_bureaux: 0,
        total_etages: 0,
        budget_total: 0,
        salaire_moyen: 0
      }
    }
  }
} 