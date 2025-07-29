import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // Simuler l'ID de l'utilisateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const success = await StockService.resolveAlerteStock(id, userId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la résolution de l\'alerte' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la résolution de l\'alerte:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la résolution de l\'alerte' },
      { status: 500 }
    )
  }
} 