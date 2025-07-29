const { spawn } = require('child_process');
const { createDatabase, initializeTables, seedData } = require('./init-db');

async function startApplication() {
  try {
    console.log('🚀 Démarrage de l\'application de gestion ministérielle...');
    
    // Étape 1: Initialiser la base de données
    console.log('\n📋 Étape 1: Initialisation de la base de données...');
    await createDatabase();
    await initializeTables();
    await seedData();
    
    console.log('✅ Base de données prête!');
    
    // Étape 2: Vérifier les dépendances
    console.log('\n📦 Étape 2: Vérification des dépendances...');
    const npmCheck = spawn('npm', ['list'], { stdio: 'pipe' });
    
    npmCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dépendances vérifiées');
        startNextApp();
      } else {
        console.log('⚠️ Installation des dépendances...');
        installDependencies();
      }
    });
    
  } catch (error) {
    console.error('💥 Erreur lors du démarrage:', error);
    process.exit(1);
  }
}

function installDependencies() {
  console.log('📦 Installation des dépendances...');
  const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
  
  npmInstall.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dépendances installées');
      startNextApp();
    } else {
      console.error('❌ Erreur lors de l\'installation des dépendances');
      process.exit(1);
    }
  });
}

function startNextApp() {
  console.log('\n🌐 Étape 3: Démarrage du serveur de développement...');
  console.log('🔗 L\'application sera disponible sur: http://localhost:3000');
  console.log('🔑 Comptes de test:');
  console.log('   - admin@ministere.gov.ma (mot de passe: password123)');
  console.log('   - manager@ministere.gov.ma (mot de passe: password123)');
  console.log('   - user@ministere.gov.ma (mot de passe: password123)');
  console.log('\n⏳ Démarrage en cours...\n');
  
  const nextDev = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  nextDev.on('error', (error) => {
    console.error('❌ Erreur lors du démarrage de Next.js:', error);
    process.exit(1);
  });
  
  nextDev.on('close', (code) => {
    console.log(`\n🛑 Serveur arrêté avec le code: ${code}`);
  });
  
  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt de l\'application...');
    nextDev.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt de l\'application...');
    nextDev.kill('SIGTERM');
    process.exit(0);
  });
}

// Script principal
if (require.main === module) {
  startApplication();
}

module.exports = { startApplication }; 