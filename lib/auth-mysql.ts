import { executeQuery } from './database'

export interface User {
  id: number
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'user'
  department?: string
  phone?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export class AuthMySQLService {
  // Authentifier un utilisateur
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // Récupérer l'utilisateur par email avec une requête optimisée
      const users = await executeQuery(
        'SELECT id, email, password, full_name, role, department, phone, is_active, last_login, created_at, updated_at FROM users WHERE email = ? AND is_active = 1 LIMIT 1',
        [email]
      ) as any[]

      if (users.length === 0) {
        return null
      }

      const user = users[0]

      // Vérifier le mot de passe (sans hachage)
      if (user.password !== password) {
        return null
      }

      // Mettre à jour la dernière connexion de manière asynchrone
      executeQuery(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      ).catch(error => {
        console.error('Erreur lors de la mise à jour de last_login:', error)
      })

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error)
      return null
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(userData: {
    email: string
    password: string
    full_name: string
    role?: 'admin' | 'manager' | 'user'
    department?: string
    phone?: string
  }): Promise<User | null> {
    try {
      // Vérifier si l'email existe déjà
      const existingUsers = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      ) as any[]

      if (existingUsers.length > 0) {
        throw new Error('Un utilisateur avec cet email existe déjà')
      }

      // Insérer le nouvel utilisateur (sans hachage)
      const result = await executeQuery(
        `INSERT INTO users (email, password, full_name, role, department, phone) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userData.email,
          userData.password, // Mot de passe en clair
          userData.full_name,
          userData.role || 'user',
          userData.department,
          userData.phone
        ]
      ) as any

      // Récupérer l'utilisateur créé
      const newUser = await executeQuery(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      ) as any[]

      if (newUser.length === 0) {
        return null
      }

      const { password, ...userWithoutPassword } = newUser[0]
      return userWithoutPassword as User
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      throw error
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id: number): Promise<User | null> {
    try {
      const users = await executeQuery(
        'SELECT * FROM users WHERE id = ? AND is_active = 1',
        [id]
      ) as any[]

      if (users.length === 0) {
        return null
      }

      const { password, ...userWithoutPassword } = users[0]
      return userWithoutPassword as User
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    try {
      const updateFields = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'password')
        .map(key => `${key} = ?`)
        .join(', ')

      const updateValues = Object.values(updates).filter((_, index) => 
        Object.keys(updates)[index] !== 'id' && Object.keys(updates)[index] !== 'password'
      )

      await executeQuery(
        `UPDATE users SET ${updateFields}, updated_at = NOW() WHERE id = ?`,
        [...updateValues, id]
      )

      return await this.getUserById(id)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      return null
    }
  }

  // Changer le mot de passe
  static async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Récupérer l'utilisateur avec le mot de passe
      const users = await executeQuery(
        'SELECT password FROM users WHERE id = ?',
        [id]
      ) as any[]

      if (users.length === 0) {
        return false
      }

      // Vérifier l'ancien mot de passe
      if (users[0].password !== currentPassword) {
        return false
      }

      // Mettre à jour le mot de passe (sans hachage)
      await executeQuery(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
        [newPassword, id]
      )

      return true
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      return false
    }
  }

  // Désactiver un utilisateur
  static async deactivateUser(id: number): Promise<boolean> {
    try {
      await executeQuery(
        'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [id]
      )
      return true
    } catch (error) {
      console.error('Erreur lors de la désactivation de l\'utilisateur:', error)
      return false
    }
  }

  // Récupérer tous les utilisateurs (pour l'admin)
  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await executeQuery(
        'SELECT * FROM users WHERE is_active = 1 ORDER BY created_at DESC'
      ) as any[]

      return users.map(user => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword as User
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return []
    }
  }

  // Vérifier les permissions
  static hasPermission(user: User, resource: string, action: string): boolean {
    const permissions = {
      admin: {
        user: ['create', 'read', 'update', 'delete'],
        employe: ['create', 'read', 'update', 'delete'],
        marche: ['create', 'read', 'update', 'delete'],
        stock: ['create', 'read', 'update', 'delete'],
        audit: ['read']
      },
      manager: {
        user: ['read'],
        employe: ['create', 'read', 'update'],
        marche: ['create', 'read', 'update'],
        stock: ['create', 'read', 'update'],
        audit: ['read']
      },
      user: {
        user: ['read'],
        employe: ['read'],
        marche: ['read'],
        stock: ['read'],
        audit: ['read']
      }
    }

    const userPermissions = permissions[user.role]
    if (!userPermissions) return false

    const resourcePermissions = userPermissions[resource as keyof typeof userPermissions]
    if (!resourcePermissions) return false

    return resourcePermissions.includes(action as any)
  }
}

// Fonction utilitaire pour l'authentification
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  return await AuthMySQLService.authenticateUser(email, password)
}

// Fonction utilitaire pour vérifier les permissions
export function hasPermission(user: User, resource: string, action: string): boolean {
  return AuthMySQLService.hasPermission(user, resource, action)
}
