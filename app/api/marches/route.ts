import { NextRequest, NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function GET() {
  try {
    const marches = await MarcheService.getAllMarches()
    return NextResponse.json(marches)
  } catch (error) {
    console.error('Erreur lors de la récupération des marchés:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marchés' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const marcheData = await request.json()
    
    // Simuler l'ID de l'utilisateur créateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const marche = await MarcheService.createMarche(marcheData, userId)
    
    if (!marche) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du marché' },
        { status: 500 }
      )
    }

    return NextResponse.json(marche, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du marché:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du marché' },
      { status: 500 }
    )
  }
} 