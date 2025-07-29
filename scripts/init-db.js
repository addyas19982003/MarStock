const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ms',
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: '+00:00',
};

async function createDatabase() {
  try {
    console.log('🚀 Création de la base de données...');
    
    // Connexion sans spécifier la base de données pour la créer
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    // Créer la base de données si elle n'existe pas
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Base de données '${dbConfig.database}' créée ou existante`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur lors de la création de la base de données:', error);
    throw error;
  }
}

async function initializeTables() {
  try {
    console.log('📋 Initialisation des tables...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Créer les tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'user') DEFAULT 'user',
        department VARCHAR(255),
        phone VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS marches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        budget DECIMAL(15,2) NOT NULL,
        statut ENUM('actif', 'termine', 'suspendu') DEFAULT 'actif',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        progress INT DEFAULT 0,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_statut (statut),
        INDEX idx_priority (priority),
        INDEX idx_dates (date_debut, date_fin)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS bandes_livraison (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        marche_id INT NOT NULL,
        date_livraison DATE NOT NULL,
        statut ENUM('en_attente', 'en_cours', 'livree', 'retard') DEFAULT 'en_attente',
        montant DECIMAL(15,2) NOT NULL,
        fournisseur VARCHAR(255) NOT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (marche_id) REFERENCES marches(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_marche (marche_id),
        INDEX idx_statut (statut),
        INDEX idx_date_livraison (date_livraison)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS employes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        prenom VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telephone VARCHAR(50) NOT NULL,
        poste VARCHAR(255) NOT NULL,
        departement VARCHAR(255) NOT NULL,
        date_embauche DATE NOT NULL,
        salaire DECIMAL(10,2) NOT NULL,
        statut ENUM('actif', 'inactif', 'conge') DEFAULT 'actif',
        skills JSON,
        manager_id INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES employes(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_email (email),
        INDEX idx_statut (statut),
        INDEX idx_departement (departement)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS materiels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        quantite INT NOT NULL DEFAULT 1,
        prix_unitaire DECIMAL(10,2) NOT NULL,
        statut ENUM('disponible', 'affecte', 'maintenance', 'hors_service', 'en_transit') DEFAULT 'disponible',
        category VARCHAR(255),
        location VARCHAR(255),
        serial_number VARCHAR(255),
        warranty_date DATE,
        fournisseur_id INT,
        seuil_alerte INT DEFAULT 0,
        unite VARCHAR(50),
        code_barre VARCHAR(255),
        marche_id INT,
        employe_id INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (marche_id) REFERENCES marches(id) ON DELETE SET NULL,
        FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_statut (statut),
        INDEX idx_category (category),
        INDEX idx_marche (marche_id),
        INDEX idx_employe (employe_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS categories_materiel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT,
        couleur VARCHAR(7) DEFAULT '#3B82F6',
        icone VARCHAR(50),
        parent_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories_materiel(id) ON DELETE SET NULL,
        INDEX idx_parent (parent_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS fournisseurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telephone VARCHAR(50) NOT NULL,
        adresse TEXT NOT NULL,
        ville VARCHAR(255) NOT NULL,
        code_postal VARCHAR(20) NOT NULL,
        pays VARCHAR(255) NOT NULL,
        siret VARCHAR(14),
        statut ENUM('actif', 'inactif') DEFAULT 'actif',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_statut (statut),
        INDEX idx_ville (ville)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS mouvements_stock (
        id INT AUTO_INCREMENT PRIMARY KEY,
        materiel_id INT NOT NULL,
        type ENUM('entree', 'sortie', 'transfert', 'ajustement', 'affectation', 'retour') NOT NULL,
        quantite INT NOT NULL,
        quantite_avant INT NOT NULL,
        quantite_apres INT NOT NULL,
        raison TEXT NOT NULL,
        reference VARCHAR(255),
        employe_id INT,
        fournisseur_id INT,
        marche_id INT,
        location_source VARCHAR(255),
        location_destination VARCHAR(255),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (materiel_id) REFERENCES materiels(id) ON DELETE CASCADE,
        FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE SET NULL,
        FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id) ON DELETE SET NULL,
        FOREIGN KEY (marche_id) REFERENCES marches(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_materiel (materiel_id),
        INDEX idx_type (type),
        INDEX idx_date (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS alertes_stock (
        id INT AUTO_INCREMENT PRIMARY KEY,
        materiel_id INT NOT NULL,
        type ENUM('stock_critique', 'garantie_expire', 'maintenance_requise', 'stock_surplus') NOT NULL,
        message TEXT NOT NULL,
        niveau ENUM('info', 'warning', 'critical') DEFAULT 'warning',
        is_resolved BOOLEAN DEFAULT FALSE,
        resolved_by INT,
        resolved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (materiel_id) REFERENCES materiels(id) ON DELETE CASCADE,
        FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_materiel (materiel_id),
        INDEX idx_type (type),
        INDEX idx_resolved (is_resolved)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        user_name VARCHAR(255),
        action ENUM('create', 'read', 'update', 'delete', 'login', 'logout') NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id INT,
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_action (action),
        INDEX idx_resource (resource),
        INDEX idx_timestamp (timestamp)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Tables pour la gestion des personnes
      `CREATE TABLE IF NOT EXISTS grades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        niveau VARCHAR(50) NOT NULL,
        salaire_base DECIMAL(10,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_niveau (niveau),
        INDEX idx_salaire (salaire_base)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS directions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        budget DECIMAL(15,2) NOT NULL,
        responsable_id INT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (responsable_id) REFERENCES employes(id) ON DELETE SET NULL,
        INDEX idx_code (code),
        INDEX idx_budget (budget)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS divisions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        direction_id INT NOT NULL,
        chef_id INT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (direction_id) REFERENCES directions(id) ON DELETE CASCADE,
        FOREIGN KEY (chef_id) REFERENCES employes(id) ON DELETE SET NULL,
        INDEX idx_code (code),
        INDEX idx_direction (direction_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS etages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero INT NOT NULL UNIQUE,
        nom VARCHAR(255) NOT NULL,
        description TEXT,
        superficie DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_numero (numero)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS bureaux (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        numero VARCHAR(50) NOT NULL,
        etage INT NOT NULL,
        division_id INT NOT NULL,
        capacite INT NOT NULL,
        equipements TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (etage) REFERENCES etages(numero) ON DELETE CASCADE,
        FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
        INDEX idx_etage (etage),
        INDEX idx_division (division_id),
        UNIQUE KEY unique_bureau (numero, etage)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    for (const tableQuery of tables) {
      await connection.execute(tableQuery);
    }

    console.log('✅ Tables créées avec succès');
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    throw error;
  }
}

async function seedData() {
  try {
    console.log('🌱 Insertion des données de test...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Vérifier si des utilisateurs existent déjà
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const userCount = users[0].count;

    if (userCount === 0) {
      // Créer le hash du mot de passe
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Insérer des utilisateurs de test
      await connection.execute(`
        INSERT INTO users (email, password_hash, full_name, role, department, phone) VALUES
        ('admin@ministere.gov.ma', ?, 'Administrateur Système', 'admin', 'Informatique', '+212661234567'),
        ('manager@ministere.gov.ma', ?, 'Gestionnaire Principal', 'manager', 'Gestion', '+212662345678'),
        ('user@ministere.gov.ma', ?, 'Utilisateur Standard', 'user', 'Support', '+212663456789')
      `, [hashedPassword, hashedPassword, hashedPassword]);

      // Insérer des employés de test
      await connection.execute(`
        INSERT INTO employes (nom, prenom, email, telephone, poste, departement, date_embauche, salaire, statut) VALUES
        ('Alaoui', 'Fatima', 'fatima.alaoui@ministere.gov.ma', '+212661111111', 'Directrice RH', 'Ressources Humaines', '2020-01-15', 25000.00, 'actif'),
        ('Benali', 'Ahmed', 'ahmed.benali@ministere.gov.ma', '+212662222222', 'Chef de Service', 'Administration', '2019-03-20', 22000.00, 'actif'),
        ('Tazi', 'Karima', 'karima.tazi@ministere.gov.ma', '+212663333333', 'Assistante', 'Support', '2021-06-10', 15000.00, 'actif'),
        ('Mansouri', 'Omar', 'omar.mansouri@ministere.gov.ma', '+212664444444', 'Technicien', 'Informatique', '2020-09-05', 18000.00, 'actif'),
        ('Bennani', 'Sara', 'sara.bennani@ministere.gov.ma', '+212665555555', 'Analyste', 'Finance', '2021-11-12', 20000.00, 'actif')
      `);

      // Insérer des marchés de test
      await connection.execute(`
        INSERT INTO marches (nom, description, date_debut, date_fin, budget, statut, priority, created_by) VALUES
        ('Fourniture de matériel informatique', 'Acquisition d''ordinateurs et périphériques pour les services', '2024-01-01', '2024-12-31', 500000.00, 'actif', 'high', 1),
        ('Maintenance des bâtiments', 'Rénovation et entretien des locaux administratifs', '2024-03-01', '2024-08-31', 300000.00, 'actif', 'medium', 1),
        ('Formation du personnel', 'Programme de formation continue pour les employés', '2024-02-01', '2024-06-30', 150000.00, 'actif', 'low', 2)
      `);

      // Insérer des bandes de livraison de test
      await connection.execute(`
        INSERT INTO bandes_livraison (nom, description, marche_id, date_livraison, statut, montant, fournisseur) VALUES
        ('Livraison PC Bureau', '50 ordinateurs de bureau', 1, '2024-04-15', 'en_cours', 250000.00, 'TechMaroc SARL'),
        ('Livraison Imprimantes', '20 imprimantes multifonctions', 1, '2024-05-20', 'en_attente', 80000.00, 'PrintTech'),
        ('Matériaux Construction', 'Ciment, peinture, carrelage', 2, '2024-04-30', 'livree', 120000.00, 'BatiMaroc')
      `);

      // Insérer des matériels de test
      await connection.execute(`
        INSERT INTO materiels (nom, description, quantite, prix_unitaire, statut, category, location, created_by) VALUES
        ('Ordinateur Dell OptiPlex', 'Ordinateur de bureau Dell OptiPlex 7090', 50, 8000.00, 'disponible', 'Informatique', 'Entrepôt A', 1),
        ('Imprimante HP LaserJet', 'Imprimante laser HP LaserJet Pro M404n', 20, 4000.00, 'disponible', 'Informatique', 'Entrepôt B', 1),
        ('Bureau métallique', 'Bureau de travail métallique 140x70cm', 100, 2500.00, 'disponible', 'Mobilier', 'Entrepôt C', 1),
        ('Chaise de bureau', 'Chaise de bureau ergonomique', 100, 1500.00, 'disponible', 'Mobilier', 'Entrepôt C', 1)
      `);

      // Insérer des grades de test
      await connection.execute(`
        INSERT INTO grades (nom, niveau, salaire_base, description) VALUES
        ('Agent', 'A1', 8000.00, 'Grade de base pour les agents administratifs'),
        ('Agent Principal', 'A2', 10000.00, 'Grade intermédiaire pour les agents expérimentés'),
        ('Chef de Bureau', 'B1', 15000.00, 'Grade de supervision pour les chefs de bureau'),
        ('Chef de Service', 'B2', 20000.00, 'Grade de direction pour les chefs de service'),
        ('Directeur', 'C1', 30000.00, 'Grade de direction générale')
      `);

      // Insérer des étages de test
      await connection.execute(`
        INSERT INTO etages (numero, nom, description, superficie) VALUES
        (1, 'Rez-de-chaussée', 'Étage d''accueil et services publics', 1500.00),
        (2, 'Premier étage', 'Étage administratif et bureaux', 1200.00),
        (3, 'Deuxième étage', 'Étage des services techniques', 1200.00),
        (4, 'Troisième étage', 'Étage de direction', 1000.00)
      `);

      // Insérer des directions de test
      await connection.execute(`
        INSERT INTO directions (nom, code, budget, description) VALUES
        ('Direction des Ressources Humaines', 'DRH', 500000.00, 'Gestion du personnel et des ressources humaines'),
        ('Direction Administrative et Financière', 'DAF', 800000.00, 'Gestion administrative et financière'),
        ('Direction Technique', 'DT', 1200000.00, 'Gestion technique et maintenance'),
        ('Direction de la Communication', 'DC', 300000.00, 'Communication et relations publiques')
      `);

      // Insérer des divisions de test
      await connection.execute(`
        INSERT INTO divisions (nom, code, direction_id, description) VALUES
        ('Division Recrutement', 'DRH-REC', 1, 'Recrutement et sélection du personnel'),
        ('Division Formation', 'DRH-FORM', 1, 'Formation et développement des compétences'),
        ('Division Comptabilité', 'DAF-COMP', 2, 'Comptabilité et gestion financière'),
        ('Division Budget', 'DAF-BUDG', 2, 'Gestion budgétaire et contrôle'),
        ('Division Maintenance', 'DT-MAINT', 3, 'Maintenance des équipements'),
        ('Division Informatique', 'DT-INFO', 3, 'Gestion informatique et systèmes')
      `);

      // Insérer des bureaux de test
      await connection.execute(`
        INSERT INTO bureaux (nom, numero, etage, division_id, capacite, equipements) VALUES
        ('Bureau Accueil', 'A01', 1, 1, 4, 'Ordinateurs, imprimantes, téléphones'),
        ('Bureau RH', 'A02', 1, 1, 6, 'Ordinateurs, imprimantes, classeurs'),
        ('Bureau Comptabilité', 'B01', 2, 3, 8, 'Ordinateurs, imprimantes, logiciels comptables'),
        ('Bureau Budget', 'B02', 2, 4, 6, 'Ordinateurs, imprimantes, logiciels Excel'),
        ('Bureau Maintenance', 'C01', 3, 5, 4, 'Ordinateurs, outils, équipements techniques'),
        ('Bureau Informatique', 'C02', 3, 6, 6, 'Ordinateurs, serveurs, équipements réseau')
      `);

      console.log('✅ Données de test insérées avec succès');
    } else {
      console.log('ℹ️ Des données existent déjà, pas d\'insertion de données de test');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données de test:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎯 Initialisation de la base de données MySQL...');
    console.log(`📊 Configuration: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    await createDatabase();
    await initializeTables();
    await seedData();
    
    console.log('🎉 Base de données initialisée avec succès!');
    console.log('🔑 Comptes de test créés:');
    console.log('   - admin@ministere.gov.ma (mot de passe: password123)');
    console.log('   - manager@ministere.gov.ma (mot de passe: password123)');
    console.log('   - user@ministere.gov.ma (mot de passe: password123)');
  } catch (error) {
    console.error('💥 Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createDatabase, initializeTables, seedData };

