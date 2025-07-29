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

export class PersonnesClient {
  // ===== GRADES =====

  // Récupérer tous les grades
  static async getAllGrades(): Promise<Grade[]> {
    try {
      const response = await fetch('/api/personnes/grades')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des grades')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des grades:', error)
      return []
    }
  }

  // Créer un nouveau grade
  static async createGrade(gradeData: Omit<Grade, 'id' | 'created_at' | 'updated_at'>): Promise<Grade | null> {
    try {
      const response = await fetch('/api/personnes/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du grade')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création du grade:', error)
      throw error
    }
  }

  // Mettre à jour un grade
  static async updateGrade(id: number, updates: Partial<Grade>): Promise<Grade | null> {
    try {
      const response = await fetch(`/api/personnes/grades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du grade')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du grade:', error)
      throw error
    }
  }

  // Supprimer un grade
  static async deleteGrade(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/personnes/grades/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression du grade')
      }

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
      const response = await fetch('/api/personnes/directions')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des directions')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des directions:', error)
      return []
    }
  }

  // Créer une nouvelle direction
  static async createDirection(directionData: Omit<Direction, 'id' | 'created_at' | 'updated_at'>): Promise<Direction | null> {
    try {
      const response = await fetch('/api/personnes/directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(directionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la direction')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la direction:', error)
      throw error
    }
  }

  // Mettre à jour une direction
  static async updateDirection(id: number, updates: Partial<Direction>): Promise<Direction | null> {
    try {
      const response = await fetch(`/api/personnes/directions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la direction')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la direction:', error)
      throw error
    }
  }

  // Supprimer une direction
  static async deleteDirection(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/personnes/directions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de la direction')
      }

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
      const response = await fetch('/api/personnes/divisions')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des divisions')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des divisions:', error)
      return []
    }
  }

  // Créer une nouvelle division
  static async createDivision(divisionData: Omit<Division, 'id' | 'created_at' | 'updated_at'>): Promise<Division | null> {
    try {
      const response = await fetch('/api/personnes/divisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(divisionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la division')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la division:', error)
      throw error
    }
  }

  // Mettre à jour une division
  static async updateDivision(id: number, updates: Partial<Division>): Promise<Division | null> {
    try {
      const response = await fetch(`/api/personnes/divisions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la division')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la division:', error)
      throw error
    }
  }

  // Supprimer une division
  static async deleteDivision(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/personnes/divisions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de la division')
      }

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
      const response = await fetch('/api/personnes/bureaux')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des bureaux')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des bureaux:', error)
      return []
    }
  }

  // Créer un nouveau bureau
  static async createBureau(bureauData: Omit<Bureau, 'id' | 'created_at' | 'updated_at'>): Promise<Bureau | null> {
    try {
      const response = await fetch('/api/personnes/bureaux', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bureauData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du bureau')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création du bureau:', error)
      throw error
    }
  }

  // Mettre à jour un bureau
  static async updateBureau(id: number, updates: Partial<Bureau>): Promise<Bureau | null> {
    try {
      const response = await fetch(`/api/personnes/bureaux/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du bureau')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bureau:', error)
      throw error
    }
  }

  // Supprimer un bureau
  static async deleteBureau(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/personnes/bureaux/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression du bureau')
      }

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
      const response = await fetch('/api/personnes/etages')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des étages')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des étages:', error)
      return []
    }
  }

  // Créer un nouvel étage
  static async createEtage(etageData: Omit<Etage, 'id' | 'created_at' | 'updated_at'>): Promise<Etage | null> {
    try {
      const response = await fetch('/api/personnes/etages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(etageData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de l\'étage')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la création de l\'étage:', error)
      throw error
    }
  }

  // Mettre à jour un étage
  static async updateEtage(id: number, updates: Partial<Etage>): Promise<Etage | null> {
    try {
      const response = await fetch(`/api/personnes/etages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'étage')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étage:', error)
      throw error
    }
  }

  // Supprimer un étage
  static async deleteEtage(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/personnes/etages/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'étage')
      }

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
      const response = await fetch('/api/personnes/stats')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
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