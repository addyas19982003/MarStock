import { NextResponse } from 'next/server'
import { testConnection, executeQuery } from '@/lib/database'

export async function GET() {
  try {
    const isConnected = await testConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Impossible de se connecter à la base de données' },
        { status: 500 }
      )
    }

    // Tester une requête simple
    const result = await executeQuery('SELECT COUNT(*) as count FROM users')
    
    return NextResponse.json({
      success: true,
      message: 'Connexion à la base de données réussie',
      userCount: (result as any)[0].count
    })
  } catch (error) {
    console.error('Erreur lors du test de la base de données:', error)
    return NextResponse.json(
      { error: 'Erreur lors du test de la base de données' },
      { status: 500 }
    )
  }
} 