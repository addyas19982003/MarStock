import { NextRequest, NextResponse } from 'next/server'
import { EmployeService } from '@/lib/services/employe-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const employe = await EmployeService.getEmployeById(id)
    
    if (!employe) {
      return NextResponse.json(
        { error: 'Employé non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(employe)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'employé' },
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
    
    const employe = await EmployeService.updateEmploye(id, updates)
    
    if (!employe) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'employé' },
        { status: 500 }
      )
    }

    return NextResponse.json(employe)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'employé' },
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
    const success = await EmployeService.deleteEmploye(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'employé' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'employé' },
      { status: 500 }
    )
  }
} 