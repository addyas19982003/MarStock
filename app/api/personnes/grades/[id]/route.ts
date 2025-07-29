import { NextRequest, NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const grade = await PersonnesService.getGradeById(id)
    
    if (!grade) {
      return NextResponse.json(
        { error: 'Grade non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Erreur lors de la récupération du grade:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du grade' },
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
    
    const grade = await PersonnesService.updateGrade(id, updates)
    
    if (!grade) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du grade' },
        { status: 500 }
      )
    }

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du grade:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du grade' },
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
    const success = await PersonnesService.deleteGrade(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du grade' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du grade:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du grade' },
      { status: 500 }
    )
  }
} 