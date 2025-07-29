-- Script SQL pour insérer les données de test dans la base de données 'ms'

-- Insérer des grades de test
INSERT IGNORE INTO grades (nom, niveau, salaire_base, description) VALUES
('Agent', 'A1', 8000.00, 'Grade de base pour les agents administratifs'),
('Agent Principal', 'A2', 10000.00, 'Grade intermédiaire pour les agents expérimentés'),
('Chef de Bureau', 'B1', 15000.00, 'Grade de supervision pour les chefs de bureau'),
('Chef de Service', 'B2', 20000.00, 'Grade de direction pour les chefs de service'),
('Directeur', 'C1', 30000.00, 'Grade de direction générale');

-- Insérer des étages de test
INSERT IGNORE INTO etages (numero, nom, description, superficie) VALUES
(1, 'Rez-de-chaussée', 'Étage d''accueil et services publics', 1500.00),
(2, 'Premier étage', 'Étage administratif et bureaux', 1200.00),
(3, 'Deuxième étage', 'Étage des services techniques', 1200.00),
(4, 'Troisième étage', 'Étage de direction', 1000.00);

-- Insérer des directions de test
INSERT IGNORE INTO directions (nom, code, budget, description) VALUES
('Direction des Ressources Humaines', 'DRH', 500000.00, 'Gestion du personnel et des ressources humaines'),
('Direction Administrative et Financière', 'DAF', 800000.00, 'Gestion administrative et financière'),
('Direction Technique', 'DT', 1200000.00, 'Gestion technique et maintenance'),
('Direction de la Communication', 'DC', 300000.00, 'Communication et relations publiques');

-- Insérer des divisions de test
INSERT IGNORE INTO divisions (nom, code, direction_id, description) VALUES
('Division Recrutement', 'DRH-REC', 1, 'Recrutement et sélection du personnel'),
('Division Formation', 'DRH-FORM', 1, 'Formation et développement des compétences'),
('Division Comptabilité', 'DAF-COMP', 2, 'Comptabilité et gestion financière'),
('Division Budget', 'DAF-BUDG', 2, 'Gestion budgétaire et contrôle'),
('Division Maintenance', 'DT-MAINT', 3, 'Maintenance des équipements'),
('Division Informatique', 'DT-INFO', 3, 'Gestion informatique et systèmes');

-- Insérer des bureaux de test
INSERT IGNORE INTO bureaux (nom, numero, etage, division_id, capacite, equipements) VALUES
('Bureau Accueil', 'A01', 1, 1, 4, 'Ordinateurs, imprimantes, téléphones'),
('Bureau RH', 'A02', 1, 1, 6, 'Ordinateurs, imprimantes, classeurs'),
('Bureau Comptabilité', 'B01', 2, 3, 8, 'Ordinateurs, imprimantes, logiciels comptables'),
('Bureau Budget', 'B02', 2, 4, 6, 'Ordinateurs, imprimantes, logiciels Excel'),
('Bureau Maintenance', 'C01', 3, 5, 4, 'Ordinateurs, outils, équipements techniques'),
('Bureau Informatique', 'C02', 3, 6, 6, 'Ordinateurs, serveurs, équipements réseau');

-- Insérer des employés de test (si pas déjà présents)
INSERT IGNORE INTO employes (nom, prenom, email, telephone, poste, departement, date_embauche, salaire, statut) VALUES
('Alaoui', 'Fatima', 'fatima.alaoui@ministere.gov.ma', '+212661111111', 'Directrice RH', 'Ressources Humaines', '2020-01-15', 25000.00, 'actif'),
('Benali', 'Ahmed', 'ahmed.benali@ministere.gov.ma', '+212662222222', 'Chef de Service', 'Administration', '2019-03-20', 22000.00, 'actif'),
('Tazi', 'Karima', 'karima.tazi@ministere.gov.ma', '+212663333333', 'Assistante', 'Support', '2021-06-10', 15000.00, 'actif'),
('Mansouri', 'Omar', 'omar.mansouri@ministere.gov.ma', '+212664444444', 'Technicien', 'Informatique', '2020-09-05', 18000.00, 'actif'),
('Bennani', 'Sara', 'sara.bennani@ministere.gov.ma', '+212665555555', 'Analyste', 'Finance', '2021-11-12', 20000.00, 'actif');

-- Insérer des marchés de test (si pas déjà présents)
INSERT IGNORE INTO marches (nom, description, date_debut, date_fin, budget, statut, priority, created_by) VALUES
('Fourniture de matériel informatique', 'Acquisition d''ordinateurs et périphériques pour les services', '2024-01-01', '2024-12-31', 500000.00, 'actif', 'high', 1),
('Maintenance des bâtiments', 'Rénovation et entretien des locaux administratifs', '2024-03-01', '2024-08-31', 300000.00, 'actif', 'medium', 1),
('Formation du personnel', 'Programme de formation continue pour les employés', '2024-02-01', '2024-06-30', 150000.00, 'actif', 'low', 2);

-- Insérer des bandes de livraison de test (si pas déjà présents)
INSERT IGNORE INTO bandes_livraison (nom, description, marche_id, date_livraison, statut, montant, fournisseur) VALUES
('Livraison PC Bureau', '50 ordinateurs de bureau', 1, '2024-04-15', 'en_cours', 250000.00, 'TechMaroc SARL'),
('Livraison Imprimantes', '20 imprimantes multifonctions', 1, '2024-05-20', 'en_attente', 80000.00, 'PrintTech'),
('Matériaux Construction', 'Ciment, peinture, carrelage', 2, '2024-04-30', 'livree', 120000.00, 'BatiMaroc');

-- Insérer des matériels de test (si pas déjà présents)
INSERT IGNORE INTO materiels (nom, description, quantite, prix_unitaire, statut, category, location, created_by) VALUES
('Ordinateur Dell OptiPlex', 'Ordinateur de bureau Dell OptiPlex 7090', 50, 8000.00, 'disponible', 'Informatique', 'Entrepôt A', 1),
('Imprimante HP LaserJet', 'Imprimante laser HP LaserJet Pro M404n', 20, 4000.00, 'disponible', 'Informatique', 'Entrepôt B', 1),
('Bureau métallique', 'Bureau de travail métallique 140x70cm', 100, 2500.00, 'disponible', 'Mobilier', 'Entrepôt C', 1),
('Chaise de bureau', 'Chaise de bureau ergonomique', 100, 1500.00, 'disponible', 'Mobilier', 'Entrepôt C', 1);

-- Insérer des utilisateurs de test (si pas déjà présents)
INSERT IGNORE INTO users (email, password, full_name, role, department, phone) VALUES
('admin@ministere.gov.ma', 'password123', 'Administrateur Système', 'admin', 'Informatique', '+212661234567'),
('manager@ministere.gov.ma', 'password123', 'Gestionnaire Principal', 'manager', 'Gestion', '+212662345678'),
('user@ministere.gov.ma', 'password123', 'Utilisateur Standard', 'user', 'Support', '+212663456789');

-- Afficher un message de confirmation
SELECT 'Données de test insérées avec succès!' as message; 