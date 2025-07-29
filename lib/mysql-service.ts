import mysql from 'mysql2/promise'
import { connectDatabase } from './database'

// Configuration de la base de données avec variables d'environnement
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ms',
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: '+00:00',
}

// Pool de connexions
let pool: mysql.Pool | null = null

export class MySQLService {
  private static instance: MySQLService
  private isInitialized = false

  private constructor() {}

  static getInstance(): MySQLService {
    if (!MySQLService.instance) {
      MySQLService.instance = new MySQLService()
    }
    return MySQLService.instance
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true
    }

    try {
      console.log('🔌 Initialisation du service MySQL...')
      
      // Tester la connexion
      const isConnected = await this.testConnection()
      if (!isConnected) {
        throw new Error('Impossible de se connecter à MySQL')
      }

      // Initialiser la base de données
      await connectDatabase()
      
      this.isInitialized = true
      console.log('✅ Service MySQL initialisé avec succès')
      return true
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du service MySQL:', error)
      return false
    }
  }

  private async testConnection(): Promise<boolean> {
    try {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port,
      })

      await connection.execute(`USE \`${dbConfig.database}\``)
      await connection.end()
      
      console.log('✅ Connexion MySQL réussie')
      console.log(`📊 Base de données: ${dbConfig.database}`)
      console.log(`🌐 Hôte: ${dbConfig.host}:${dbConfig.port}`)
      
      return true
    } catch (error) {
      console.error('❌ Erreur de connexion MySQL:', error)
      return false
    }
  }

  getPool(): mysql.Pool {
    if (!pool) {
      pool = mysql.createPool({
        ...dbConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
    }
    return pool
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const pool = this.getPool()
      const [results] = await pool.execute(query, params)
      return results
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la requête:', error)
      throw error
    }
  }

  async executeTransaction(queries: Array<{ query: string; params: any[] }>): Promise<any[]> {
    const connection = await this.getPool().getConnection()
    
    try {
      await connection.beginTransaction()
      
      const results = []
      for (const { query, params } of queries) {
        const [result] = await connection.execute(query, params)
        results.push(result)
      }
      
      await connection.commit()
      return results
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  async closePool(): Promise<void> {
    if (pool) {
      await pool.end()
      pool = null
      this.isInitialized = false
    }
  }

  // Méthodes utilitaires pour les opérations courantes
  async findOne(table: string, conditions: Record<string, any>): Promise<any> {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ')
    const values = Object.values(conditions)
    
    const query = `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`
    const results = await this.executeQuery(query, values)
    
    return results.length > 0 ? results[0] : null
  }

  async findAll(table: string, conditions: Record<string, any> = {}): Promise<any[]> {
    let query = `SELECT * FROM ${table}`
    let values: any[] = []
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ')
      values = Object.values(conditions)
      query += ` WHERE ${whereClause}`
    }
    
    return await this.executeQuery(query, values)
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data)
    const placeholders = columns.map(() => '?').join(', ')
    const values = Object.values(data)
    
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
    const result = await this.executeQuery(query, values)
    
    return result
  }

  async update(table: string, data: Record<string, any>, conditions: Record<string, any>): Promise<any> {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ')
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ')
    
    const values = [...Object.values(data), ...Object.values(conditions)]
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`
    
    return await this.executeQuery(query, values)
  }

  async delete(table: string, conditions: Record<string, any>): Promise<any> {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ')
    const values = Object.values(conditions)
    
    const query = `DELETE FROM ${table} WHERE ${whereClause}`
    return await this.executeQuery(query, values)
  }

  async count(table: string, conditions: Record<string, any> = {}): Promise<number> {
    let query = `SELECT COUNT(*) as count FROM ${table}`
    let values: any[] = []
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ')
      values = Object.values(conditions)
      query += ` WHERE ${whereClause}`
    }
    
    const result = await this.executeQuery(query, values)
    return result[0].count
  }

  // Méthodes spécifiques pour les entités principales
  async getUserByEmail(email: string): Promise<any> {
    return await this.findOne('users', { email })
  }

  async getEmployeByEmail(email: string): Promise<any> {
    return await this.findOne('employes', { email })
  }

  async getMarcheById(id: number): Promise<any> {
    return await this.findOne('marches', { id })
  }

  async getBandesByMarche(marcheId: number): Promise<any[]> {
    return await this.findAll('bandes_livraison', { marche_id: marcheId })
  }

  async getMaterielsByCategory(category: string): Promise<any[]> {
    return await this.findAll('materiels', { category })
  }

  // Méthodes de statistiques
  async getStats(): Promise<any> {
    const stats = {}
    
    // Statistiques des utilisateurs
    const userStats = await this.executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as actifs,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
      FROM users
    `)
    stats.users = userStats[0]
    
    // Statistiques des employés
    const employeStats = await this.executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
        AVG(salaire) as salaire_moyen,
        COUNT(DISTINCT departement) as departements
      FROM employes
    `)
    stats.employes = employeStats[0]
    
    // Statistiques des marchés
    const marcheStats = await this.executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
        SUM(budget) as budget_total,
        AVG(budget) as budget_moyen
      FROM marches
    `)
    stats.marches = marcheStats[0]
    
    // Statistiques des matériels
    const materielStats = await this.executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'disponible' THEN 1 ELSE 0 END) as disponibles,
        SUM(quantite * prix_unitaire) as valeur_totale
      FROM materiels
    `)
    stats.materiels = materielStats[0]
    
    return stats
  }
}

// Export de l'instance singleton
export const mysqlService = MySQLService.getInstance() 