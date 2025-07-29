const { seedDatabase, testConnection } = require("../lib/database")

async function main() {
  console.log("🌱 Insertion des données de test...")

  try {
    // Tester la connexion
    const isConnected = await testConnection()
    if (!isConnected) {
      console.error("❌ Impossible de se connecter à la base de données")
      process.exit(1)
    }

    // Insérer les données de test
    await seedDatabase()
    console.log("✅ Données de test insérées avec succès")
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des données:", error)
    process.exit(1)
  }
}

main()
