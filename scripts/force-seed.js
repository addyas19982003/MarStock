import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

async function executeQuery(query, params = []) {
  const pool = mysql.createPool(dbConfig)
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } finally {
    await pool.end()
  }
}

async function forceSeedData() {
  try {
    console.log('🌱 Insertion forcée des données de test...')

    // Insérer des grades de test
    console.log('📝 Insertion des grades...')
    await executeQuery(`
      INSERT IGNORE INTO grades (nom, niveau, salaire_base, description) VALUES
      ('Agent', 'A1', 8000.00, 'Grade de base pour les agents administratifs'),
      ('Agent Principal', 'A2', 10000.00, 'Grade intermédiaire pour les agents expérimentés'),
      ('Chef de Bureau', 'B1', 15000.00, 'Grade de supervision pour les chefs de bureau'),
      ('Chef de Service', 'B2', 20000.00, 'Grade de direction pour les chefs de service'),
      ('Directeur', 'C1', 30000.00, 'Grade de direction générale')
    `)

    // Insérer des étages de test
    console.log('🏢 Insertion des étages...')
    await executeQuery(`
      INSERT IGNORE INTO etages (numero, nom, description, superficie) VALUES
      (1, 'Rez-de-chaussée', 'Étage d''accueil et services publics', 1500.00),
      (2, 'Premier étage', 'Étage administratif et bureaux', 1200.00),
      (3, 'Deuxième étage', 'Étage des services techniques', 1200.00),
      (4, 'Troisième étage', 'Étage de direction', 1000.00)
    `)

    // Insérer des directions de test
    console.log('🏛️ Insertion des directions...')
    await executeQuery(`
      INSERT IGNORE INTO directions (nom, code, budget, description) VALUES
      ('Direction des Ressources Humaines', 'DRH', 500000.00, 'Gestion du personnel et des ressources humaines'),
      ('Direction Administrative et Financière', 'DAF', 800000.00, 'Gestion administrative et financière'),
      ('Direction Technique', 'DT', 1200000.00, 'Gestion technique et maintenance'),
      ('Direction de la Communication', 'DC', 300000.00, 'Communication et relations publiques')
    `)

    // Insérer des divisions de test
    console.log('📋 Insertion des divisions...')
    await executeQuery(`
      INSERT IGNORE INTO divisions (nom, code, direction_id, description) VALUES
      ('Division Recrutement', 'DRH-REC', 1, 'Recrutement et sélection du personnel'),
      ('Division Formation', 'DRH-FORM', 1, 'Formation et développement des compétences'),
      ('Division Comptabilité', 'DAF-COMP', 2, 'Comptabilité et gestion financière'),
      ('Division Budget', 'DAF-BUDG', 2, 'Gestion budgétaire et contrôle'),
      ('Division Maintenance', 'DT-MAINT', 3, 'Maintenance des équipements'),
      ('Division Informatique', 'DT-INFO', 3, 'Gestion informatique et systèmes')
    `)

    // Insérer des bureaux de test
    console.log('🏢 Insertion des bureaux...')
    await executeQuery(`
      INSERT IGNORE INTO bureaux (nom, numero, etage, division_id, capacite, equipements) VALUES
      ('Bureau Accueil', 'A01', 1, 1, 4, 'Ordinateurs, imprimantes, téléphones'),
      ('Bureau RH', 'A02', 1, 1, 6, 'Ordinateurs, imprimantes, classeurs'),
      ('Bureau Comptabilité', 'B01', 2, 3, 8, 'Ordinateurs, imprimantes, logiciels comptables'),
      ('Bureau Budget', 'B02', 2, 4, 6, 'Ordinateurs, imprimantes, logiciels Excel'),
      ('Bureau Maintenance', 'C01', 3, 5, 4, 'Ordinateurs, outils, équipements techniques'),
      ('Bureau Informatique', 'C02', 3, 6, 6, 'Ordinateurs, serveurs, équipements réseau')
    `)

    console.log('✅ Données de test insérées avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error)
  }
}

forceSeedData() 