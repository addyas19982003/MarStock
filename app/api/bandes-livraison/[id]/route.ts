import { NextRequest, NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const bande = await MarcheService.getBandeById(id)
    
    if (!bande) {
      return NextResponse.json(
        { error: 'Bande de livraison non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(bande)
  } catch (error) {
    console.error('Erreur lors de la récupération de la bande de livraison:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la bande de livraison' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const bande = await MarcheService.updateBandeLivraison(id, updates)
    
    if (!bande) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la bande de livraison' },
        { status: 500 }
      )
    }

    return NextResponse.json(bande)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la bande de livraison:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la bande de livraison' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const success = await MarcheService.deleteBandeLivraison(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la bande de livraison' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la bande de livraison:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la bande de livraison' },
      { status: 500 }
    )
  }
} 