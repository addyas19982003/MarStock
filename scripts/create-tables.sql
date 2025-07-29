-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marches table
CREATE TABLE IF NOT EXISTS marches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    budget DECIMAL(15,2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'actif' CHECK (statut IN ('actif', 'termine', 'suspendu')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employes table
CREATE TABLE IF NOT EXISTS employes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    poste VARCHAR(255) NOT NULL,
    departement VARCHAR(255) NOT NULL,
    date_embauche DATE NOT NULL,
    salaire DECIMAL(10,2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'conge')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materiels table
CREATE TABLE IF NOT EXISTS materiels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'disponible' CHECK (statut IN ('disponible', 'affecte', 'maintenance')),
    marche_id UUID REFERENCES marches(id) ON DELETE SET NULL,
    employe_id UUID REFERENCES employes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marches_statut ON marches(statut);
CREATE INDEX IF NOT EXISTS idx_employes_statut ON employes(statut);
CREATE INDEX IF NOT EXISTS idx_materiels_statut ON materiels(statut);
CREATE INDEX IF NOT EXISTS idx_materiels_marche_id ON materiels(marche_id);
CREATE INDEX IF NOT EXISTS idx_materiels_employe_id ON materiels(employe_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE marches ENABLE ROW LEVEL SECURITY;
ALTER TABLE employes ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiels ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all records" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can view all marches" ON marches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert marches" ON marches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update marches" ON marches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete marches" ON marches FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all employes" ON employes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert employes" ON employes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update employes" ON employes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete employes" ON employes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all materiels" ON materiels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert materiels" ON materiels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update materiels" ON materiels FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete materiels" ON materiels FOR DELETE USING (auth.role() = 'authenticated');
