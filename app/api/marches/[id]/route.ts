import { NextRequest, NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const marche = await MarcheService.getMarcheById(id)
    
    if (!marche) {
      return NextResponse.json(
        { error: 'Marché non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(marche)
  } catch (error) {
    console.error('Erreur lors de la récupération du marché:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du marché' },
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
    
    const marche = await MarcheService.updateMarche(id, updates)
    
    if (!marche) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du marché' },
        { status: 500 }
      )
    }

    return NextResponse.json(marche)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du marché:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du marché' },
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
    const success = await MarcheService.deleteMarche(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du marché' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du marché:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du marché' },
      { status: 500 }
    )
  }
} 