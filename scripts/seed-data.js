import { seedDatabase } from '../lib/database.js'

async function main() {
  try {
    console.log('🌱 Insertion forcée des données de test...')
    await seedDatabase()
    console.log('✅ Données de test insérées avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error)
  }
}

main() 