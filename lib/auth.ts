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

class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      return data.user
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  async signOut(): Promise<void> {
    // La déconnexion est gérée côté client
    localStorage.removeItem('user')
  }

  async signUp(email: string, password: string, fullName: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      return data.user
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        return null
      }

      const user = JSON.parse(userStr) as User
      return user
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      return data.user
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      return null
    }
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe')
      }

      return data.success
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      return false
    }
  }
}

export const authService = new AuthService()

// Fonction pour vérifier les permissions
export function hasPermission(user: User | null, resource: string, action: string): boolean {
  if (!user) return false

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

// Fonction pour vérifier l'accès par rôle
export function canAccess(user: User | null, requiredRole: 'admin' | 'manager' | 'user'): boolean {
  if (!user) return false

  const roleHierarchy: Record<'admin' | 'manager' | 'user', number> = {
    user: 1,
    manager: 2,
    admin: 3,
  }

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}
