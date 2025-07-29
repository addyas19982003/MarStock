import { NextRequest, NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function POST(request: NextRequest) {
  try {
    const bandeData = await request.json()
    
    // Simuler l'ID de l'utilisateur créateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const bande = await MarcheService.createBandeLivraison(bandeData, userId)
    
    if (!bande) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la bande de livraison' },
        { status: 500 }
      )
    }

    return NextResponse.json(bande, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la bande de livraison:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la bande de livraison' },
      { status: 500 }
    )
  }
} 