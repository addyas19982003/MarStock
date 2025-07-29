import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: "admin" | "user" | "manager"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: "admin" | "user" | "manager"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: "admin" | "user" | "manager"
          created_at?: string
          updated_at?: string
        }
      }
      marches: {
        Row: {
          id: string
          nom: string
          description: string
          date_debut: string
          date_fin: string
          budget: number
          statut: "actif" | "termine" | "suspendu"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          description: string
          date_debut: string
          date_fin: string
          budget: number
          statut?: "actif" | "termine" | "suspendu"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string
          date_debut?: string
          date_fin?: string
          budget?: number
          statut?: "actif" | "termine" | "suspendu"
          created_at?: string
          updated_at?: string
        }
      }
      materiels: {
        Row: {
          id: string
          nom: string
          description: string
          quantite: number
          prix_unitaire: number
          statut: "disponible" | "affecte" | "maintenance"
          marche_id: string | null
          employe_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          description: string
          quantite: number
          prix_unitaire: number
          statut?: "disponible" | "affecte" | "maintenance"
          marche_id?: string | null
          employe_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string
          quantite?: number
          prix_unitaire?: number
          statut?: "disponible" | "affecte" | "maintenance"
          marche_id?: string | null
          employe_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employes: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          prenom: string
          email: string
          telephone: string
          poste: string
          departement: string
          date_embauche: string
          salaire: number
          statut?: "actif" | "inactif" | "conge"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          prenom?: string
          email?: string
          telephone?: string
          poste?: string
          departement?: string
          date_embauche?: string
          salaire?: number
          statut?: "actif" | "inactif" | "conge"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
