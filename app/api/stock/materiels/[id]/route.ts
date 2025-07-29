import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const materiel = await StockService.getMaterielById(id)
    
    if (!materiel) {
      return NextResponse.json(
        { error: 'Matériel non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(materiel)
  } catch (error) {
    console.error('Erreur lors de la récupération du matériel:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du matériel' },
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
    
    const materiel = await StockService.updateMateriel(id, updates)
    
    if (!materiel) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du matériel' },
        { status: 500 }
      )
    }

    return NextResponse.json(materiel)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du matériel:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du matériel' },
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
    const success = await StockService.deleteMateriel(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du matériel' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du matériel:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du matériel' },
      { status: 500 }
    )
  }
} 