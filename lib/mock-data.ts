import type { Marche, Materiel, Employe } from "./types"

// Mock data storage
let mockMarches: Marche[] = [
  {
    id: "1",
    nom: "Marché Informatique 2024",
    description: "Fourniture d'équipements informatiques pour le ministère",
    date_debut: "2024-01-01",
    date_fin: "2024-12-31",
    budget: 500000,
    statut: "actif",
    priority: "high",
    progress: 65,
    created_by: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nom: "Marché Mobilier Bureau",
    description: "Acquisition de mobilier de bureau moderne",
    date_debut: "2024-02-01",
    date_fin: "2024-06-30",
    budget: 150000,
    statut: "actif",
    priority: "medium",
    progress: 30,
    created_by: "1",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    nom: "Marché Véhicules Service",
    description: "Achat de véhicules de service",
    date_debut: "2024-03-01",
    date_fin: "2024-09-30",
    budget: 800000,
    statut: "actif",
    priority: "high",
    progress: 15,
    created_by: "1",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
]

let mockEmployes: Employe[] = [
  {
    id: "1",
    nom: "Alami",
    prenom: "Ahmed",
    email: "ahmed.alami@ministere.gov.ma",
    telephone: "+212661234567",
    poste: "Directeur IT",
    departement: "Informatique",
    date_embauche: "2020-01-15",
    salaire: 15000,
    statut: "actif",
    skills: ["Management", "IT Strategy", "Leadership"],
    created_by: "1",
    created_at: "2020-01-15T00:00:00Z",
    updated_at: "2020-01-15T00:00:00Z",
  },
  {
    id: "2",
    nom: "Benali",
    prenom: "Fatima",
    email: "fatima.benali@ministere.gov.ma",
    telephone: "+212662345678",
    poste: "Chef de Projet",
    departement: "Gestion",
    date_embauche: "2021-03-10",
    salaire: 12000,
    statut: "actif",
    skills: ["Project Management", "Agile", "Communication"],
    created_by: "1",
    created_at: "2021-03-10T00:00:00Z",
    updated_at: "2021-03-10T00:00:00Z",
  },
  {
    id: "3",
    nom: "Chakir",
    prenom: "Mohamed",
    email: "mohamed.chakir@ministere.gov.ma",
    telephone: "+212663456789",
    poste: "Technicien",
    departement: "Maintenance",
    date_embauche: "2022-06-01",
    salaire: 8000,
    statut: "actif",
    skills: ["Hardware", "Network", "Troubleshooting"],
    created_by: "1",
    created_at: "2022-06-01T00:00:00Z",
    updated_at: "2022-06-01T00:00:00Z",
  },
]

let mockMateriels: Materiel[] = [
  {
    id: "1",
    nom: "Ordinateur Portable Dell",
    description: "Dell Latitude 5520, Intel i7, 16GB RAM, 512GB SSD",
    quantite: 25,
    prix_unitaire: 8500,
    statut: "disponible",
    category: "Informatique",
    location: "Magasin A1",
    serial_number: "DL2024001",
    warranty_date: "2026-01-01",
    marche_id: "1",
    employe_id: null,
    created_by: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nom: "Imprimante HP LaserJet",
    description: "HP LaserJet Pro M404dn, impression recto-verso",
    quantite: 10,
    prix_unitaire: 2200,
    statut: "disponible",
    category: "Bureautique",
    location: "Magasin B2",
    serial_number: "HP2024001",
    warranty_date: "2025-06-01",
    marche_id: "1",
    employe_id: null,
    created_by: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    nom: 'Écran Samsung 24"',
    description: "Samsung F24T450FQU, Full HD, 24 pouces",
    quantite: 30,
    prix_unitaire: 1800,
    statut: "affecte",
    category: "Informatique",
    location: "Bureau 201",
    serial_number: "SM2024001",
    warranty_date: "2025-12-01",
    marche_id: "1",
    employe_id: "2",
    created_by: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Mock API functions
export const mockAPI = {
  // Marches
  getMarches: async (): Promise<Marche[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockMarches]
  },

  createMarche: async (marche: Omit<Marche, "id" | "created_at" | "updated_at">, userId: string): Promise<Marche> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newMarche: Marche = {
      ...marche,
      id: Date.now().toString(),
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockMarches.unshift(newMarche)
    return newMarche
  },

  updateMarche: async (id: string, updates: Partial<Marche>): Promise<Marche> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockMarches.findIndex((m) => m.id === id)
    if (index === -1) throw new Error("Marché non trouvé")

    mockMarches[index] = {
      ...mockMarches[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockMarches[index]
  },

  deleteMarche: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    mockMarches = mockMarches.filter((m) => m.id !== id)
  },

  // Employes
  getEmployes: async (): Promise<Employe[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockEmployes]
  },

  createEmploye: async (
    employe: Omit<Employe, "id" | "created_at" | "updated_at">,
    userId: string,
  ): Promise<Employe> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newEmploye: Employe = {
      ...employe,
      id: Date.now().toString(),
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockEmployes.unshift(newEmploye)
    return newEmploye
  },

  updateEmploye: async (id: string, updates: Partial<Employe>): Promise<Employe> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockEmployes.findIndex((e) => e.id === id)
    if (index === -1) throw new Error("Employé non trouvé")

    mockEmployes[index] = {
      ...mockEmployes[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockEmployes[index]
  },

  deleteEmploye: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    mockEmployes = mockEmployes.filter((e) => e.id !== id)
  },

  // Materiels
  getMateriels: async (): Promise<Materiel[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockMateriels]
  },

  createMateriel: async (
    materiel: Omit<Materiel, "id" | "created_at" | "updated_at">,
    userId: string,
  ): Promise<Materiel> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newMateriel: Materiel = {
      ...materiel,
      id: Date.now().toString(),
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockMateriels.unshift(newMateriel)
    return newMateriel
  },

  updateMateriel: async (id: string, updates: Partial<Materiel>): Promise<Materiel> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockMateriels.findIndex((m) => m.id === id)
    if (index === -1) throw new Error("Matériel non trouvé")

    mockMateriels[index] = {
      ...mockMateriels[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockMateriels[index]
  },

  deleteMateriel: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    mockMateriels = mockMateriels.filter((m) => m.id !== id)
  },
}
