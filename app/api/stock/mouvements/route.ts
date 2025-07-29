import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const mouvements = await StockService.getAllMouvementsStock()
    return NextResponse.json(mouvements)
  } catch (error) {
    console.error('Erreur lors de la récupération des mouvements de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des mouvements de stock' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const mouvementData = await request.json()
    
    // Simuler l'ID de l'utilisateur créateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const mouvement = await StockService.createMouvementStock(mouvementData, userId)
    
    if (!mouvement) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du mouvement de stock' },
        { status: 500 }
      )
    }

    return NextResponse.json(mouvement, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du mouvement de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du mouvement de stock' },
      { status: 500 }
    )
  }
} 