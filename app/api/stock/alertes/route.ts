import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const alertes = await StockService.getAllAlertesStock()
    return NextResponse.json(alertes)
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des alertes de stock' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const alerteData = await request.json()
    
    // Simuler l'ID de l'utilisateur créateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const alerte = await StockService.createAlerteStock(alerteData, userId)
    
    if (!alerte) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'alerte de stock' },
        { status: 500 }
      )
    }

    return NextResponse.json(alerte, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'alerte de stock' },
      { status: 500 }
    )
  }
} 