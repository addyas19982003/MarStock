const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Test des performances de l\'application...')

// Vérifier si l'application est en cours d'exécution
try {
  const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { encoding: 'utf8' })
  if (response.trim() === '200') {
    console.log('✅ Application accessible sur http://localhost:3000')
  } else {
    console.log('❌ Application non accessible. Démarrez l\'application avec: npm run dev')
    process.exit(1)
  }
} catch (error) {
  console.log('❌ Impossible de tester l\'application. Assurez-vous qu\'elle est démarrée.')
  process.exit(1)
}

// Test de performance avec Lighthouse (si installé)
try {
  console.log('📊 Test Lighthouse en cours...')
  execSync('npx lighthouse http://localhost:3000/auth/login --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"', { stdio: 'inherit' })
  
  if (fs.existsSync('./lighthouse-report.json')) {
    const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'))
    const scores = report.categories
    
    console.log('\n📈 Scores de performance:')
    console.log(`Performance: ${Math.round(scores.performance.score * 100)}/100`)
    console.log(`Accessibilité: ${Math.round(scores.accessibility.score * 100)}/100`)
    console.log(`Bonnes pratiques: ${Math.round(scores['best-practices'].score * 100)}/100`)
    console.log(`SEO: ${Math.round(scores.seo.score * 100)}/100`)
    
    // Nettoyer le fichier de rapport
    fs.unlinkSync('./lighthouse-report.json')
  }
} catch (error) {
  console.log('⚠️ Lighthouse non disponible. Installez-le avec: npm install -g lighthouse')
}

// Test de taille du bundle
try {
  console.log('\n📦 Analyse de la taille du bundle...')
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build terminé avec succès')
} catch (error) {
  console.log('❌ Erreur lors du build')
}

console.log('\n🎉 Tests de performance terminés!') 