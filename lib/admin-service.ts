import type { AuditLog, SystemSettings, Notification } from "./types"

// Mock data for admin features
const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    user_id: "1",
    user_name: "Administrateur Système",
    action: "create",
    resource: "marche",
    resource_id: "1",
    details: "Création du marché 'Marché Informatique 2024'",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0...",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user_id: "2",
    user_name: "Gestionnaire Principal",
    action: "update",
    resource: "employe",
    resource_id: "1",
    details: "Modification des informations de Ahmed Alami",
    ip_address: "192.168.1.101",
    user_agent: "Mozilla/5.0...",
    timestamp: "2024-01-15T11:15:00Z",
  },
  {
    id: "3",
    user_id: "1",
    user_name: "Administrateur Système",
    action: "delete",
    resource: "materiel",
    resource_id: "5",
    details: "Suppression du matériel 'Ancien serveur'",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0...",
    timestamp: "2024-01-15T14:20:00Z",
  },
]

const mockSystemSettings: SystemSettings[] = [
  {
    id: "1",
    key: "app_name",
    value: "Gestion Marché & Stock",
    description: "Nom de l'application",
    category: "general",
    updated_by: "1",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    key: "max_login_attempts",
    value: "5",
    description: "Nombre maximum de tentatives de connexion",
    category: "security",
    updated_by: "1",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    key: "session_timeout",
    value: "30",
    description: "Durée de session en minutes",
    category: "security",
    updated_by: "1",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    key: "email_notifications",
    value: "true",
    description: "Activer les notifications par email",
    category: "notifications",
    updated_by: "1",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    key: "auto_backup",
    value: "true",
    description: "Sauvegarde automatique quotidienne",
    category: "backup",
    updated_by: "1",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouveau marché créé",
    message: "Le marché 'Marché Informatique 2024' a été créé avec succès",
    type: "success",
    user_id: "1",
    is_read: false,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Stock critique",
    message: "Le stock d'ordinateurs portables est critique (2 restants)",
    type: "warning",
    is_read: false,
    created_at: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    title: "Sauvegarde terminée",
    message: "La sauvegarde automatique s'est terminée avec succès",
    type: "info",
    is_read: true,
    created_at: "2024-01-15T02:00:00Z",
  },
]

export const adminService = {
  // Audit Logs
  async getAuditLogs(page = 1, limit = 50): Promise<{ logs: AuditLog[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return {
      logs: mockAuditLogs.slice(startIndex, endIndex),
      total: mockAuditLogs.length,
    }
  },

  async addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    const newLog: AuditLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    mockAuditLogs.unshift(newLog)
  },

  // System Settings
  async getSystemSettings(): Promise<SystemSettings[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockSystemSettings]
  },

  async updateSystemSetting(id: string, value: string, updatedBy: string): Promise<SystemSettings> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockSystemSettings.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Paramètre non trouvé")

    mockSystemSettings[index] = {
      ...mockSystemSettings[index],
      value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    }
    return mockSystemSettings[index]
  },

  // Notifications
  async getNotifications(userId?: string): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return userId ? mockNotifications.filter((n) => !n.user_id || n.user_id === userId) : mockNotifications
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const notification = mockNotifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.is_read = true
    }
  },

  async createNotification(notification: Omit<Notification, "id" | "created_at">): Promise<Notification> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    mockNotifications.unshift(newNotification)
    return newNotification
  },

  // System Statistics
  async getSystemStats(): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      totalUsers: 25,
      activeUsers: 23,
      totalMarches: 12,
      activeMarches: 8,
      totalMateriels: 156,
      availableMateriels: 89,
      totalEmployes: 45,
      activeEmployes: 42,
      systemUptime: "15 jours, 8 heures",
      lastBackup: "2024-01-15T02:00:00Z",
      diskUsage: 65,
      memoryUsage: 42,
      cpuUsage: 28,
    }
  },

  // Export/Import
  async exportData(type: string): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const data = JSON.stringify({ type, exported_at: new Date().toISOString(), data: [] })
    return new Blob([data], { type: "application/json" })
  },
}
