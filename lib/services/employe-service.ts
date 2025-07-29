import { executeQuery } from '../database'

export interface Employe {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  poste: string
  departement: string
  date_embauche: string
  salaire: number
  statut: 'actif' | 'inactif' | 'conge'
  skills?: string[]
  manager_id?: number
  created_by?: number
  created_at: string
  updated_at: string
}

export class EmployeService {
  // Récupérer tous les employés
  static async getAllEmployes(): Promise<Employe[]> {
    try {
      const employes = await executeQuery(`
        SELECT e.*, 
               CONCAT(e.prenom, ' ', e.nom) as nom_complet,
               m.nom as manager_nom,
               m.prenom as manager_prenom
        FROM employes e
        LEFT JOIN employes m ON e.manager_id = m.id
        ORDER BY e.created_at DESC
      `) as Employe[]
      
      return employes
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error)
      return []
    }
  }

  // Récupérer un employé par ID
  static async getEmployeById(id: number): Promise<Employe | null> {
    try {
      const employes = await executeQuery(`
        SELECT e.*, 
               CONCAT(e.prenom, ' ', e.nom) as nom_complet,
               m.nom as manager_nom,
               m.prenom as manager_prenom
        FROM employes e
        LEFT JOIN employes m ON e.manager_id = m.id
        WHERE e.id = ?
      `, [id]) as Employe[]
      
      return employes.length > 0 ? employes[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'employé:', error)
      return null
    }
  }

  // Créer un nouvel employé
  static async createEmploye(employeData: Omit<Employe, 'id' | 'created_at' | 'updated_at'>, userId: number): Promise<Employe | null> {
    try {
      const result = await executeQuery(`
        INSERT INTO employes (nom, prenom, email, telephone, poste, departement, date_embauche, salaire, statut, skills, manager_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        employeData.nom,
        employeData.prenom,
        employeData.email,
        employeData.telephone,
        employeData.poste,
        employeData.departement,
        employeData.date_embauche,
        employeData.salaire,
        employeData.statut,
        JSON.stringify(employeData.skills || []),
        employeData.manager_id || null,
        userId
      ]) as any

      if (result.insertId) {
        return await this.getEmployeById(result.insertId)
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error)
      throw error
    }
  }

  // Mettre à jour un employé
  static async updateEmploye(id: number, updates: Partial<Employe>): Promise<Employe | null> {
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
        UPDATE employes SET ${updateFields}, updated_at = NOW() WHERE id = ?
      `, [...updateValues, id])

      return await this.getEmployeById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error)
      throw error
    }
  }

  // Supprimer un employé
  static async deleteEmploye(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM employes WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error)
      return false
    }
  }

  // Récupérer les employés par département
  static async getEmployesByDepartment(departement: string): Promise<Employe[]> {
    try {
      const employes = await executeQuery(`
        SELECT * FROM employes WHERE departement = ? ORDER BY nom, prenom
      `, [departement]) as Employe[]
      
      return employes
    } catch (error) {
      console.error('Erreur lors de la récupération des employés par département:', error)
      return []
    }
  }

  // Récupérer les employés par statut
  static async getEmployesByStatus(statut: string): Promise<Employe[]> {
    try {
      const employes = await executeQuery(`
        SELECT * FROM employes WHERE statut = ? ORDER BY nom, prenom
      `, [statut]) as Employe[]
      
      return employes
    } catch (error) {
      console.error('Erreur lors de la récupération des employés par statut:', error)
      return []
    }
  }

  // Calculer les statistiques des employés
  static async getEmployeStats(): Promise<any> {
    try {
      const stats = await executeQuery(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
          SUM(CASE WHEN statut = 'inactif' THEN 1 ELSE 0 END) as inactifs,
          SUM(CASE WHEN statut = 'conge' THEN 1 ELSE 0 END) as conges,
          AVG(salaire) as salaire_moyen,
          SUM(salaire) as masse_salariale,
          COUNT(DISTINCT departement) as departements_count
        FROM employes
      `) as any[]
      
      return stats[0]
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return {
        total: 0,
        actifs: 0,
        inactifs: 0,
        conges: 0,
        salaire_moyen: 0,
        masse_salariale: 0,
        departements_count: 0
      }
    }
  }

  // Récupérer les départements uniques
  static async getDepartements(): Promise<string[]> {
    try {
      const departements = await executeQuery(`
        SELECT DISTINCT departement FROM employes ORDER BY departement
      `) as any[]
      
      return departements.map(d => d.departement)
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error)
      return []
    }
  }

  // Récupérer les postes uniques
  static async getPostes(): Promise<string[]> {
    try {
      const postes = await executeQuery(`
        SELECT DISTINCT poste FROM employes ORDER BY poste
      `) as any[]
      
      return postes.map(p => p.poste)
    } catch (error) {
      console.error('Erreur lors de la récupération des postes:', error)
      return []
    }
  }

  // Calculer l'ancienneté d'un employé
  static calculateAnciennete(dateEmbauche: string): number {
    const maintenant = new Date()
    const dateEmbaucheObj = new Date(dateEmbauche)
    const differenceMs = maintenant.getTime() - dateEmbaucheObj.getTime()
    return Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 365.25))
  }
} 