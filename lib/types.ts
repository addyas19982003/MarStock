export type UserRole = "admin" | "manager" | "user"
export type ActionType = "create" | "read" | "update" | "delete" | "login" | "logout" | "export" | "import"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  permissions: Permission[]
  avatar?: string
  phone?: string
  department?: string
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

export interface AuditLog {
  id: string
  user_id: string
  user_name: string
  action: ActionType
  resource: string
  resource_id?: string
  details: string
  ip_address?: string
  user_agent?: string
  timestamp: string
}

export interface SystemSettings {
  id: string
  key: string
  value: string
  description: string
  category: "general" | "security" | "notifications" | "backup"
  updated_by: string
  updated_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  user_id?: string
  is_read: boolean
  created_at: string
}

export interface BackupInfo {
  id: string
  filename: string
  size: number
  type: "manual" | "automatic"
  status: "completed" | "in_progress" | "failed"
  created_by: string
  created_at: string
}

export interface Marche {
  id: string
  nom: string
  description: string
  date_debut: string
  date_fin: string
  budget: number
  statut: "actif" | "termine" | "suspendu"
  priority?: "low" | "medium" | "high"
  progress?: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface Materiel {
  id: string
  nom: string
  description: string
  quantite: number
  prix_unitaire: number
  statut: "disponible" | "affecte" | "maintenance" | "hors_service" | "en_transit"
  category?: string
  location?: string
  serial_number?: string
  warranty_date?: string
  marche_id: string | null
  employe_id: string | null
  fournisseur_id?: string
  seuil_alerte?: number
  unite?: string
  code_barre?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface CategorieMateriel {
  id: string
  nom: string
  description: string
  couleur: string
  icone: string
  parent_id?: string
  created_at: string
}

export interface Fournisseur {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
  ville: string
  code_postal: string
  pays: string
  siret?: string
  statut: "actif" | "inactif"
  notes?: string
  created_at: string
  updated_at: string
}

export interface MouvementStock {
  id: string
  materiel_id: string
  type: "entree" | "sortie" | "transfert" | "ajustement" | "affectation" | "retour"
  quantite: number
  quantite_avant: number
  quantite_apres: number
  raison: string
  reference?: string
  employe_id?: string
  fournisseur_id?: string
  marche_id?: string
  location_source?: string
  location_destination?: string
  created_by: string
  created_at: string
}

export interface AlerteStock {
  id: string
  materiel_id: string
  type: "stock_critique" | "garantie_expire" | "maintenance_requise" | "stock_surplus"
  message: string
  niveau: "info" | "warning" | "critical"
  is_resolved: boolean
  resolved_by?: string
  resolved_at?: string
  created_at: string
}

export interface Maintenance {
  id: string
  materiel_id: string
  type: "preventive" | "corrective" | "inspection"
  description: string
  date_debut: string
  date_fin?: string
  cout?: number
  technicien?: string
  statut: "planifie" | "en_cours" | "termine" | "annule"
  resultat?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Inventaire {
  id: string
  nom: string
  description: string
  date_debut: string
  date_fin?: string
  statut: "planifie" | "en_cours" | "termine" | "annule"
  responsable_id: string
  emplacements: string[]
  resultats: InventaireResultat[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface InventaireResultat {
  id: string
  inventaire_id: string
  materiel_id: string
  quantite_theorique: number
  quantite_reelle: number
  difference: number
  notes?: string
  verifie_par: string
  verifie_at: string
}

export interface Employe {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  poste: string
  departement: string
  date_embauche: string
  salaire: number
  statut: "actif" | "inactif" | "conge"
  manager_id?: string
  skills?: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  description: string
  manager_id?: string
  budget: number
  employee_count: number
  created_at: string
}

export interface Report {
  id: string
  title: string
  type: "marches" | "stock" | "employees" | "financial"
  data: any
  generated_by: string
  generated_at: string
}
