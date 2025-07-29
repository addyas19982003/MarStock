import type { DashboardStats } from '../services/dashboard-service'

export class DashboardClient {
  // Récupérer toutes les statistiques du dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du dashboard:', error)
      return this.getDefaultStats()
    }
  }

  // Statistiques par défaut en cas d'erreur
  private static getDefaultStats(): DashboardStats {
    return {
      marches: { total: 0, actifs: 0, termines: 0, budget_total: 0, progress_moyen: 0 },
      employes: { total: 0, actifs: 0, departements: {}, salaire_moyen: 0 },
      stock: { total_materiels: 0, disponibles: 0, affectes: 0, valeur_totale: 0, alertes_critiques: 0 },
      personnes: { total_grades: 0, total_directions: 0, total_divisions: 0, total_bureaux: 0, total_etages: 0, budget_total: 0 },
      alertes: { stock_critique: 0, livraisons_retard: 0, maintenances_requises: 0, nouvelles_affectations: 0 }
    }
  }
} 