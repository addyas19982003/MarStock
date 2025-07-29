import type { Marche, Materiel, Employe } from "./types"

// Types étendus pour les nouvelles entités
export interface BandeLivraison {
  id: string
  nom: string
  description: string
  marche_id: string
  date_livraison: string
  statut: "en_attente" | "en_cours" | "livree" | "retard"
  montant: number
  fournisseur: string
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  nom: string
  niveau: number
  salaire_base: number
  description: string
  created_at: string
  updated_at: string
}

export interface Direction {
  id: string
  nom: string
  code: string
  budget: number
  responsable_id: string | null
  description: string
  created_at: string
  updated_at: string
}

export interface Division {
  id: string
  nom: string
  code: string
  direction_id: string
  chef_id: string | null
  description: string
  created_at: string
  updated_at: string
}

export interface Bureau {
  id: string
  nom: string
  numero: string
  etage: number
  division_id: string
  capacite: number
  equipements: string[]
  created_at: string
  updated_at: string
}

export interface Etage {
  id: string
  numero: number
  nom: string
  description: string
  superficie: number
  bureaux_count: number
  created_at: string
  updated_at: string
}

// Nouvelles interfaces pour la gestion avancée du stock
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

// Données mock étendues
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
    statut: "suspendu",
    priority: "high",
    progress: 15,
    created_by: "1",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
]

let mockBandesLivraison: BandeLivraison[] = [
  {
    id: "1",
    nom: "Livraison Ordinateurs Q1",
    description: "Première livraison d'ordinateurs portables",
    marche_id: "1",
    date_livraison: "2024-03-15",
    statut: "livree",
    montant: 125000,
    fournisseur: "TechCorp Maroc",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "2",
    nom: "Livraison Imprimantes",
    description: "Livraison des imprimantes laser",
    marche_id: "1",
    date_livraison: "2024-04-20",
    statut: "en_cours",
    montant: 45000,
    fournisseur: "PrintSolutions",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "3",
    nom: "Livraison Mobilier Phase 1",
    description: "Première phase de livraison du mobilier",
    marche_id: "2",
    date_livraison: "2024-05-10",
    statut: "retard",
    montant: 75000,
    fournisseur: "MobilierPro",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-05-12T00:00:00Z",
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
  {
    id: "4",
    nom: "Drissi",
    prenom: "Aicha",
    email: "aicha.drissi@ministere.gov.ma",
    telephone: "+212664567890",
    poste: "Comptable",
    departement: "Finance",
    date_embauche: "2021-09-15",
    salaire: 10000,
    statut: "conge",
    skills: ["Accounting", "Finance", "Excel"],
    created_by: "1",
    created_at: "2021-09-15T00:00:00Z",
    updated_at: "2021-09-15T00:00:00Z",
  },
  {
    id: "5",
    nom: "El Fassi",
    prenom: "Omar",
    email: "omar.elfassi@ministere.gov.ma",
    telephone: "+212665678901",
    poste: "Responsable Stock",
    departement: "Logistique",
    date_embauche: "2020-11-20",
    salaire: 11000,
    statut: "actif",
    skills: ["Inventory", "Logistics", "Management"],
    created_by: "1",
    created_at: "2020-11-20T00:00:00Z",
    updated_at: "2020-11-20T00:00:00Z",
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
  {
    id: "4",
    nom: "Chaise de Bureau Ergonomique",
    description: "Chaise ergonomique avec support lombaire",
    quantite: 50,
    prix_unitaire: 1200,
    statut: "disponible",
    category: "Mobilier",
    location: "Magasin C1",
    serial_number: "CH2024001",
    warranty_date: "2026-02-01",
    marche_id: "2",
    employe_id: null,
    created_by: "1",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
]

let mockGrades: Grade[] = [
  {
    id: "1",
    nom: "Directeur Général",
    niveau: 1,
    salaire_base: 25000,
    description: "Direction générale du ministère",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nom: "Directeur",
    niveau: 2,
    salaire_base: 20000,
    description: "Direction départementale",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    nom: "Chef de Division",
    niveau: 3,
    salaire_base: 15000,
    description: "Responsable de division",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    nom: "Chef de Service",
    niveau: 4,
    salaire_base: 12000,
    description: "Responsable de service",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    nom: "Technicien",
    niveau: 5,
    salaire_base: 8000,
    description: "Personnel technique",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

let mockDirections: Direction[] = [
  {
    id: "1",
    nom: "Direction des Technologies de l'Information",
    code: "DTI",
    budget: 2000000,
    responsable_id: "1",
    description: "Gestion des systèmes informatiques et de la transformation digitale",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nom: "Direction des Ressources Humaines",
    code: "DRH",
    budget: 800000,
    responsable_id: "2",
    description: "Gestion du personnel et des carrières",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    nom: "Direction Financière",
    code: "DF",
    budget: 1500000,
    responsable_id: "4",
    description: "Gestion financière et comptable",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

let mockDivisions: Division[] = [
  {
    id: "1",
    nom: "Division Développement",
    code: "DEV",
    direction_id: "1",
    chef_id: "1",
    description: "Développement d'applications et systèmes",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nom: "Division Infrastructure",
    code: "INF",
    direction_id: "1",
    chef_id: "3",
    description: "Gestion de l'infrastructure IT",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    nom: "Division Recrutement",
    code: "REC",
    direction_id: "2",
    chef_id: "2",
    description: "Recrutement et intégration du personnel",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

let mockBureaux: Bureau[] = [
  {
    id: "1",
    nom: "Bureau Directeur DTI",
    numero: "101",
    etage: 1,
    division_id: "1",
    capacite: 1,
    equipements: ["Ordinateur", "Imprimante", "Téléphone", "Projecteur"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nom: "Bureau Développeurs",
    numero: "201",
    etage: 2,
    division_id: "1",
    capacite: 6,
    equipements: ["Ordinateurs", "Écrans doubles", "Serveur de test"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    nom: "Bureau Infrastructure",
    numero: "202",
    etage: 2,
    division_id: "2",
    capacite: 4,
    equipements: ["Serveurs", "Équipements réseau", "Outils de diagnostic"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

let mockEtages: Etage[] = [
  {
    id: "1",
    numero: 0,
    nom: "Rez-de-chaussée",
    description: "Accueil, sécurité et services généraux",
    superficie: 500,
    bureaux_count: 5,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    numero: 1,
    nom: "Premier étage",
    description: "Direction générale et services administratifs",
    superficie: 450,
    bureaux_count: 8,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    numero: 2,
    nom: "Deuxième étage",
    description: "Départements techniques et IT",
    superficie: 450,
    bureaux_count: 12,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Données mock pour les nouvelles entités
let mockMouvementsStock: MouvementStock[] = [
  {
    id: "1",
    materiel_id: "1",
    type: "entree",
    quantite: 10,
    quantite_avant: 0,
    quantite_apres: 10,
    raison: "Réception commande initiale",
    reference: "CMD-2024-001",
    fournisseur_id: "1",
    created_by: "1",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    materiel_id: "1",
    type: "sortie",
    quantite: 2,
    quantite_avant: 10,
    quantite_apres: 8,
    raison: "Affectation employé",
    employe_id: "1",
    created_by: "1",
    created_at: "2024-01-20T14:30:00Z"
  }
]

let mockAlertesStock: AlerteStock[] = [
  {
    id: "1",
    materiel_id: "1",
    type: "stock_critique",
    message: "Stock critique pour Ordinateurs portables: 3 unités restantes",
    niveau: "critical",
    is_resolved: false,
    created_at: "2024-01-25T09:00:00Z"
  }
]

let mockMaintenances: Maintenance[] = [
  {
    id: "1",
    materiel_id: "1",
    type: "preventive",
    description: "Maintenance préventive trimestrielle",
    date_debut: "2024-01-30T08:00:00Z",
    technicien: "Tech Support",
    statut: "planifie",
    created_by: "1",
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z"
  }
]

let mockInventaires: Inventaire[] = [
  {
    id: "1",
    nom: "Inventaire Q1 2024",
    description: "Inventaire trimestriel du stock",
    date_debut: "2024-03-01T08:00:00Z",
    statut: "planifie",
    responsable_id: "1",
    emplacements: ["Magasin A", "Magasin B"],
    resultats: [],
    created_by: "1",
    created_at: "2024-02-15T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z"
  }
]

let mockCategoriesMateriel: CategorieMateriel[] = [
  {
    id: "1",
    nom: "Informatique",
    description: "Équipements informatiques",
    couleur: "#3B82F6",
    icone: "laptop",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    nom: "Bureautique",
    description: "Matériel de bureau",
    couleur: "#10B981",
    icone: "printer",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    nom: "Mobilier",
    description: "Mobilier de bureau",
    couleur: "#F59E0B",
    icone: "chair",
    created_at: "2024-01-01T00:00:00Z"
  }
]

let mockFournisseurs: Fournisseur[] = [
  {
    id: "1",
    nom: "Tech Solutions SARL",
    email: "contact@techsolutions.ma",
    telephone: "+212 5 22 34 56 78",
    adresse: "123 Avenue Mohammed V",
    ville: "Rabat",
    code_postal: "10000",
    pays: "Maroc",
    siret: "MA123456789",
    statut: "actif",
    notes: "Fournisseur principal informatique",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    nom: "Office Plus",
    email: "info@officeplus.ma",
    telephone: "+212 5 24 12 34 56",
    adresse: "456 Boulevard Hassan II",
    ville: "Casablanca",
    code_postal: "20000",
    pays: "Maroc",
    siret: "MA987654321",
    statut: "actif",
    notes: "Fournisseur mobilier de bureau",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

// API Mock étendue
export const enhancedMockAPI = {
  // Marchés
  getMarches: async (): Promise<Marche[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMarches
  },

  createMarche: async (marche: Omit<Marche, "id" | "created_at" | "updated_at">, userId: string): Promise<Marche> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newMarche: Marche = {
      ...marche,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockMarches.push(newMarche)
    return newMarche
  },

  updateMarche: async (id: string, updates: Partial<Marche>): Promise<Marche> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockMarches.findIndex(m => m.id === id)
    if (index === -1) throw new Error("Marché non trouvé")
    
    mockMarches[index] = { ...mockMarches[index], ...updates, updated_at: new Date().toISOString() }
    return mockMarches[index]
  },

  deleteMarche: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockMarches.findIndex(m => m.id === id)
    if (index === -1) throw new Error("Marché non trouvé")
    mockMarches.splice(index, 1)
  },

  // Bandes de livraison
  getBandesLivraison: async (): Promise<BandeLivraison[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockBandesLivraison
  },

  getBandesLivraisonByMarche: async (marcheId: string): Promise<BandeLivraison[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockBandesLivraison.filter((b) => b.marche_id === marcheId)
  },

  createBandeLivraison: async (bande: Omit<BandeLivraison, "id" | "created_at" | "updated_at">): Promise<BandeLivraison> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newBande: BandeLivraison = {
      ...bande,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockBandesLivraison.push(newBande)
    return newBande
  },

  updateBandeLivraison: async (id: string, updates: Partial<BandeLivraison>): Promise<BandeLivraison> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBandesLivraison.findIndex(b => b.id === id)
    if (index === -1) throw new Error("Bande de livraison non trouvée")
    
    mockBandesLivraison[index] = { ...mockBandesLivraison[index], ...updates, updated_at: new Date().toISOString() }
    return mockBandesLivraison[index]
  },

  deleteBandeLivraison: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBandesLivraison.findIndex(b => b.id === id)
    if (index === -1) throw new Error("Bande de livraison non trouvée")
    mockBandesLivraison.splice(index, 1)
  },

  // Employés
  getEmployes: async (): Promise<Employe[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockEmployes
  },

  createEmploye: async (employe: Omit<Employe, "id" | "created_at" | "updated_at">, userId: string): Promise<Employe> => {
    await new Promise(resolve => setTimeout(resolve, 500))
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
    await new Promise(resolve => setTimeout(resolve, 500))
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
    await new Promise(resolve => setTimeout(resolve, 500))
    mockEmployes = mockEmployes.filter((e) => e.id !== id)
  },

  // Matériels
  getMateriels: async (): Promise<Materiel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMateriels
  },

  createMateriel: async (materiel: Omit<Materiel, "id" | "created_at" | "updated_at">, userId: string): Promise<Materiel> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newMateriel: Materiel = {
      ...materiel,
      id: Date.now().toString(),
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockMateriels.push(newMateriel)
    return newMateriel
  },

  updateMateriel: async (id: string, updates: Partial<Materiel>): Promise<Materiel> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockMateriels.findIndex(m => m.id === id)
    if (index === -1) throw new Error("Matériel non trouvé")
    
    mockMateriels[index] = { ...mockMateriels[index], ...updates, updated_at: new Date().toISOString() }
    return mockMateriels[index]
  },

  deleteMateriel: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockMateriels.findIndex(m => m.id === id)
    if (index === -1) throw new Error("Matériel non trouvé")
    mockMateriels.splice(index, 1)
  },

  // Grades
  getGrades: async (): Promise<Grade[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockGrades
  },

  createGrade: async (grade: Omit<Grade, "id" | "created_at" | "updated_at">): Promise<Grade> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newGrade: Grade = {
      ...grade,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockGrades.push(newGrade)
    return newGrade
  },

  updateGrade: async (id: string, updates: Partial<Grade>): Promise<Grade> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockGrades.findIndex(g => g.id === id)
    if (index === -1) throw new Error("Grade non trouvé")
    
    mockGrades[index] = { ...mockGrades[index], ...updates, updated_at: new Date().toISOString() }
    return mockGrades[index]
  },

  deleteGrade: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockGrades.findIndex(g => g.id === id)
    if (index === -1) throw new Error("Grade non trouvé")
    mockGrades.splice(index, 1)
  },

  // Directions
  getDirections: async (): Promise<Direction[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDirections
  },

  createDirection: async (direction: Omit<Direction, "id" | "created_at" | "updated_at">): Promise<Direction> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newDirection: Direction = {
      ...direction,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockDirections.push(newDirection)
    return newDirection
  },

  updateDirection: async (id: string, updates: Partial<Direction>): Promise<Direction> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockDirections.findIndex(d => d.id === id)
    if (index === -1) throw new Error("Direction non trouvée")
    
    mockDirections[index] = { ...mockDirections[index], ...updates, updated_at: new Date().toISOString() }
    return mockDirections[index]
  },

  deleteDirection: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockDirections.findIndex(d => d.id === id)
    if (index === -1) throw new Error("Direction non trouvée")
    mockDirections.splice(index, 1)
  },

  // Divisions
  getDivisions: async (): Promise<Division[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDivisions
  },

  getDivisionsByDirection: async (directionId: string): Promise<Division[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDivisions.filter((d) => d.direction_id === directionId)
  },

  createDivision: async (division: Omit<Division, "id" | "created_at" | "updated_at">): Promise<Division> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newDivision: Division = {
      ...division,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockDivisions.push(newDivision)
    return newDivision
  },

  updateDivision: async (id: string, updates: Partial<Division>): Promise<Division> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockDivisions.findIndex(d => d.id === id)
    if (index === -1) throw new Error("Division non trouvée")
    
    mockDivisions[index] = { ...mockDivisions[index], ...updates, updated_at: new Date().toISOString() }
    return mockDivisions[index]
  },

  deleteDivision: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockDivisions.findIndex(d => d.id === id)
    if (index === -1) throw new Error("Division non trouvée")
    mockDivisions.splice(index, 1)
  },

  // Bureaux
  getBureaux: async (): Promise<Bureau[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockBureaux
  },

  getBureauxByDivision: async (divisionId: string): Promise<Bureau[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockBureaux.filter((b) => b.division_id === divisionId)
  },

  createBureau: async (bureau: Omit<Bureau, "id" | "created_at" | "updated_at">): Promise<Bureau> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newBureau: Bureau = {
      ...bureau,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockBureaux.push(newBureau)
    return newBureau
  },

  updateBureau: async (id: string, updates: Partial<Bureau>): Promise<Bureau> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBureaux.findIndex(b => b.id === id)
    if (index === -1) throw new Error("Bureau non trouvé")
    
    mockBureaux[index] = { ...mockBureaux[index], ...updates, updated_at: new Date().toISOString() }
    return mockBureaux[index]
  },

  deleteBureau: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBureaux.findIndex(b => b.id === id)
    if (index === -1) throw new Error("Bureau non trouvé")
    mockBureaux.splice(index, 1)
  },

  // Étages
  getEtages: async (): Promise<Etage[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockEtages
  },

  createEtage: async (etage: Omit<Etage, "id" | "created_at" | "updated_at">): Promise<Etage> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newEtage: Etage = {
      ...etage,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockEtages.push(newEtage)
    return newEtage
  },

  updateEtage: async (id: string, updates: Partial<Etage>): Promise<Etage> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockEtages.findIndex(e => e.id === id)
    if (index === -1) throw new Error("Étage non trouvé")
    
    mockEtages[index] = { ...mockEtages[index], ...updates, updated_at: new Date().toISOString() }
    return mockEtages[index]
  },

  deleteEtage: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockEtages.findIndex(e => e.id === id)
    if (index === -1) throw new Error("Étage non trouvé")
    mockEtages.splice(index, 1)
  },

  // Nouvelles méthodes pour la gestion avancée du stock
  getMouvementsStock: async (): Promise<MouvementStock[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMouvementsStock
  },

  createMouvementStock: async (mouvement: Omit<MouvementStock, "id" | "created_at">): Promise<MouvementStock> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newMouvement: MouvementStock = {
      ...mouvement,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    mockMouvementsStock.unshift(newMouvement)
    return newMouvement
  },

  getAlertesStock: async (): Promise<AlerteStock[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockAlertesStock
  },

  resolveAlerteStock: async (alerteId: string, resolvedBy: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const alerte = mockAlertesStock.find(a => a.id === alerteId)
    if (alerte) {
      alerte.is_resolved = true
      alerte.resolved_by = resolvedBy
      alerte.resolved_at = new Date().toISOString()
    }
  },

  getMaintenances: async (): Promise<Maintenance[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMaintenances
  },

  createMaintenance: async (maintenance: Omit<Maintenance, "id" | "created_at" | "updated_at">): Promise<Maintenance> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newMaintenance: Maintenance = {
      ...maintenance,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockMaintenances.push(newMaintenance)
    return newMaintenance
  },

  getInventaires: async (): Promise<Inventaire[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockInventaires
  },

  createInventaire: async (inventaire: Omit<Inventaire, "id" | "created_at" | "updated_at">): Promise<Inventaire> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newInventaire: Inventaire = {
      ...inventaire,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockInventaires.push(newInventaire)
    return newInventaire
  },

  getCategoriesMateriel: async (): Promise<CategorieMateriel[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockCategoriesMateriel
  },

  createCategorieMateriel: async (categorie: Omit<CategorieMateriel, "id" | "created_at">): Promise<CategorieMateriel> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newCategorie: CategorieMateriel = {
      ...categorie,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    mockCategoriesMateriel.push(newCategorie)
    return newCategorie
  },

  getFournisseurs: async (): Promise<Fournisseur[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockFournisseurs
  },

  createFournisseur: async (fournisseur: Omit<Fournisseur, "id" | "created_at" | "updated_at">): Promise<Fournisseur> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newFournisseur: Fournisseur = {
      ...fournisseur,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockFournisseurs.push(newFournisseur)
    return newFournisseur
  },
}
