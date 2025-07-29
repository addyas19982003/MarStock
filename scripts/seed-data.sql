-- Insert sample marches
INSERT INTO marches (nom, description, date_debut, date_fin, budget, statut) VALUES
('Marché Informatique 2024', 'Fourniture d''équipements informatiques pour le ministère', '2024-01-01', '2024-12-31', 500000.00, 'actif'),
('Marché Mobilier Bureau', 'Acquisition de mobilier de bureau moderne', '2024-02-01', '2024-06-30', 150000.00, 'actif'),
('Marché Véhicules Service', 'Achat de véhicules de service', '2024-03-01', '2024-09-30', 800000.00, 'actif');

-- Insert sample employes
INSERT INTO employes (nom, prenom, email, telephone, poste, departement, date_embauche, salaire, statut) VALUES
('Alami', 'Ahmed', 'ahmed.alami@ministere.gov.ma', '+212661234567', 'Directeur IT', 'Informatique', '2020-01-15', 15000.00, 'actif'),
('Benali', 'Fatima', 'fatima.benali@ministere.gov.ma', '+212662345678', 'Chef de Projet', 'Gestion', '2021-03-10', 12000.00, 'actif'),
('Chakir', 'Mohamed', 'mohamed.chakir@ministere.gov.ma', '+212663456789', 'Technicien', 'Maintenance', '2022-06-01', 8000.00, 'actif'),
('Drissi', 'Aicha', 'aicha.drissi@ministere.gov.ma', '+212664567890', 'Comptable', 'Finance', '2021-09-15', 10000.00, 'actif'),
('El Fassi', 'Omar', 'omar.elfassi@ministere.gov.ma', '+212665678901', 'Responsable Stock', 'Logistique', '2020-11-20', 11000.00, 'actif');

-- Insert sample materiels
INSERT INTO materiels (nom, description, quantite, prix_unitaire, statut, employe_id) VALUES
('Ordinateur Portable Dell', 'Dell Latitude 5520, Intel i7, 16GB RAM, 512GB SSD', 25, 8500.00, 'disponible', NULL),
('Imprimante HP LaserJet', 'HP LaserJet Pro M404dn, impression recto-verso', 10, 2200.00, 'disponible', NULL),
('Écran Samsung 24"', 'Samsung F24T450FQU, Full HD, 24 pouces', 30, 1800.00, 'disponible', NULL),
('Téléphone IP Cisco', 'Cisco IP Phone 7841, VoIP', 50, 1200.00, 'disponible', NULL),
('Projecteur Epson', 'Epson EB-X41, 3600 lumens, XGA', 5, 4500.00, 'disponible', NULL),
('Serveur Dell PowerEdge', 'Dell PowerEdge R740, Xeon Silver, 32GB RAM', 2, 45000.00, 'maintenance', NULL),
('Switch Cisco 24 ports', 'Cisco Catalyst 2960-X, 24 ports Gigabit', 8, 6500.00, 'disponible', NULL),
('Onduleur APC', 'APC Smart-UPS 1500VA, protection électrique', 15, 3200.00, 'disponible', NULL);

-- Update some materiels to be affected to employees
UPDATE materiels 
SET statut = 'affecte', employe_id = (SELECT id FROM employes WHERE email = 'ahmed.alami@ministere.gov.ma' LIMIT 1)
WHERE nom = 'Ordinateur Portable Dell' AND id = (SELECT id FROM materiels WHERE nom = 'Ordinateur Portable Dell' LIMIT 1);

UPDATE materiels 
SET statut = 'affecte', employe_id = (SELECT id FROM employes WHERE email = 'fatima.benali@ministere.gov.ma' LIMIT 1)
WHERE nom = 'Écran Samsung 24"' AND id = (SELECT id FROM materiels WHERE nom = 'Écran Samsung 24"' LIMIT 1);

UPDATE materiels 
SET statut = 'affecte', employe_id = (SELECT id FROM employes WHERE email = 'omar.elfassi@ministere.gov.ma' LIMIT 1)
WHERE nom = 'Téléphone IP Cisco' AND id = (SELECT id FROM materiels WHERE nom = 'Téléphone IP Cisco' LIMIT 1);
