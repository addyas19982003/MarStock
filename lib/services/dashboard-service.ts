import { executeQuery } from '../database'

export interface DashboardStats {
  marches: {
    total: number
    actifs: number
    termines: number
    budget_total: number
    progress_moyen: number
  }
  employes: {
    total: number
    actifs: number
    departements: { [key: string]: number }
    salaire_moyen: number
  }
  stock: {
    total_materiels: number
    disponibles: number
    affectes: number
    valeur_totale: number
    alertes_critiques: number
  }
  personnes: {
    total_grades: number
    total_directions: number
    total_divisions: number
    total_bureaux: number
    total_etages: number
    budget_total: number
  }
  alertes: {
    stock_critique: number
    livraisons_retard: number
    maintenances_requises: number
    nouvelles_affectations: number
  }
}

export class DashboardService {
  // Récupérer toutes les statistiques du dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        marchesStats,
        employesStats,
        stockStats,
        personnesStats,
        alertesStats
      ] = await Promise.all([
        this.getMarchesStats(),
        this.getEmployesStats(),
        this.getStockStats(),
        this.getPersonnesStats(),
        this.getAlertesStats()
      ])

      return {
        marches: marchesStats,
        employes: employesStats,
        stock: stockStats,
        personnes: personnesStats,
        alertes: alertesStats
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du dashboard:', error)
      return this.getDefaultStats()
    }
  }

  // Statistiques des marchés
  static async getMarchesStats() {
    try {
      const result = await executeQuery(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
          SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) as termines,
          SUM(budget) as budget_total,
          AVG(progress) as progress_moyen
        FROM marches
      `) as any[]

      const stats = result[0]
      return {
        total: stats.total || 0,
        actifs: stats.actifs || 0,
        termines: stats.termines || 0,
        budget_total: parseFloat(stats.budget_total) || 0,
        progress_moyen: parseFloat(stats.progress_moyen) || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des marchés:', error)
      return { total: 0, actifs: 0, termines: 0, budget_total: 0, progress_moyen: 0 }
    }
  }

  // Statistiques des employés
  static async getEmployesStats() {
    try {
      const [countResult, departementsResult] = await Promise.all([
        executeQuery(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
            AVG(salaire) as salaire_moyen
          FROM employes
        `),
        executeQuery(`
          SELECT departement, COUNT(*) as count
          FROM employes
          WHERE statut = 'actif'
          GROUP BY departement
        `)
      ])

      const stats = (countResult as any[])[0]
      const departements = (departementsResult as any[]).reduce((acc, row) => {
        acc[row.departement] = row.count
        return acc
      }, {})

      return {
        total: stats.total || 0,
        actifs: stats.actifs || 0,
        departements,
        salaire_moyen: parseFloat(stats.salaire_moyen) || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des employés:', error)
      return { total: 0, actifs: 0, departements: {}, salaire_moyen: 0 }
    }
  }

  // Statistiques du stock
  static async getStockStats() {
    try {
      const result = await executeQuery(`
        SELECT 
          COUNT(*) as total_materiels,
          SUM(CASE WHEN statut = 'disponible' THEN 1 ELSE 0 END) as disponibles,
          SUM(CASE WHEN statut = 'affecte' THEN 1 ELSE 0 END) as affectes,
          SUM(quantite * prix_unitaire) as valeur_totale
        FROM materiels
      `) as any[]

      const alertesResult = await executeQuery(`
        SELECT COUNT(*) as alertes_critiques
        FROM alertes_stock
        WHERE niveau = 'critical' AND is_resolved = FALSE
      `) as any[]

      const stats = result[0]
      const alertes = (alertesResult as any[])[0]

      return {
        total_materiels: stats.total_materiels || 0,
        disponibles: stats.disponibles || 0,
        affectes: stats.affectes || 0,
        valeur_totale: parseFloat(stats.valeur_totale) || 0,
        alertes_critiques: alertes.alertes_critiques || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du stock:', error)
      return { total_materiels: 0, disponibles: 0, affectes: 0, valeur_totale: 0, alertes_critiques: 0 }
    }
  }

  // Statistiques des personnes
  static async getPersonnesStats() {
    try {
      const result = await executeQuery(`
        SELECT 
          (SELECT COUNT(*) FROM grades) as total_grades,
          (SELECT COUNT(*) FROM directions) as total_directions,
          (SELECT COUNT(*) FROM divisions) as total_divisions,
          (SELECT COUNT(*) FROM bureaux) as total_bureaux,
          (SELECT COUNT(*) FROM etages) as total_etages,
          (SELECT SUM(budget) FROM directions) as budget_total
      `) as any[]

      const stats = result[0]
      return {
        total_grades: stats.total_grades || 0,
        total_directions: stats.total_directions || 0,
        total_divisions: stats.total_divisions || 0,
        total_bureaux: stats.total_bureaux || 0,
        total_etages: stats.total_etages || 0,
        budget_total: parseFloat(stats.budget_total) || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des personnes:', error)
      return { total_grades: 0, total_directions: 0, total_divisions: 0, total_bureaux: 0, total_etages: 0, budget_total: 0 }
    }
  }

  // Statistiques des alertes
  static async getAlertesStats() {
    try {
      const [stockResult, livraisonsResult, maintenancesResult, affectationsResult] = await Promise.all([
        executeQuery(`
          SELECT COUNT(*) as count
          FROM alertes_stock
          WHERE type = 'stock_critique' AND is_resolved = FALSE
        `),
        executeQuery(`
          SELECT COUNT(*) as count
          FROM bandes_livraison
          WHERE statut = 'retard'
        `),
        executeQuery(`
          SELECT COUNT(*) as count
          FROM alertes_stock
          WHERE type = 'maintenance_requise' AND is_resolved = FALSE
        `),
        executeQuery(`
          SELECT COUNT(*) as count
          FROM materiels
          WHERE employe_id IS NULL AND statut = 'disponible'
        `)
      ])

      return {
        stock_critique: (stockResult as any[])[0].count || 0,
        livraisons_retard: (livraisonsResult as any[])[0].count || 0,
        maintenances_requises: (maintenancesResult as any[])[0].count || 0,
        nouvelles_affectations: (affectationsResult as any[])[0].count || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des alertes:', error)
      return { stock_critique: 0, livraisons_retard: 0, maintenances_requises: 0, nouvelles_affectations: 0 }
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