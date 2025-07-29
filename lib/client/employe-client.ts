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

export class EmployeClient {
  // Récupérer tous les employés
  static async getAllEmployes(): Promise<Employe[]> {
    try {
      const response = await fetch('/api/employes')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des employés')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error)
      return []
    }
  }

  // Récupérer un employé par ID
  static async getEmployeById(id: number): Promise<Employe | null> {
    try {
      const response = await fetch(`/api/employes/${id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération de l\'employé')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'employé:', error)
      return null
    }
  }

  // Créer un nouvel employé
  static async createEmploye(employeData: Omit<Employe, 'id' | 'created_at' | 'updated_at'>): Promise<Employe | null> {
    try {
      const response = await fetch('/api/employes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de l\'employé')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error)
      throw error
    }
  }

  // Mettre à jour un employé
  static async updateEmploye(id: number, updates: Partial<Employe>): Promise<Employe | null> {
    try {
      const response = await fetch(`/api/employes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'employé')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error)
      throw error
    }
  }

  // Supprimer un employé
  static async deleteEmploye(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/employes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'employé')
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error)
      return false
    }
  }

  // Récupérer les employés par département
  static async getEmployesByDepartment(departement: string): Promise<Employe[]> {
    try {
      const response = await fetch(`/api/employes?departement=${encodeURIComponent(departement)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des employés')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des employés par département:', error)
      return []
    }
  }

  // Récupérer les employés par statut
  static async getEmployesByStatus(statut: string): Promise<Employe[]> {
    try {
      const response = await fetch(`/api/employes?statut=${encodeURIComponent(statut)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des employés')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des employés par statut:', error)
      return []
    }
  }

  // Récupérer les statistiques des employés
  static async getEmployeStats(): Promise<any> {
    try {
      const response = await fetch('/api/employes/stats')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
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
      const response = await fetch('/api/employes/departements')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des départements')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error)
      return []
    }
  }

  // Récupérer les postes uniques
  static async getPostes(): Promise<string[]> {
    try {
      const response = await fetch('/api/employes/postes')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des postes')
      }

      const data = await response.json()
      return data
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