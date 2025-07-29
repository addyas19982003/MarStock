import { NextRequest, NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marcheId = parseInt(params.id)
    const bandes = await MarcheService.getBandesByMarche(marcheId)
    return NextResponse.json(bandes)
  } catch (error) {
    console.error('Erreur lors de la récupération des bandes de livraison:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bandes de livraison' },
      { status: 500 }
    )
  }
} 