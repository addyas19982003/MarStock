import { NextRequest, NextResponse } from 'next/server'
import { EmployeService } from '@/lib/services/employe-service'

export async function GET() {
  try {
    const employes = await EmployeService.getAllEmployes()
    return NextResponse.json(employes)
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des employés' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeData = await request.json()
    
    // Simuler l'ID de l'utilisateur créateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const employe = await EmployeService.createEmploye(employeData, userId)
    
    if (!employe) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'employé' },
        { status: 500 }
      )
    }

    return NextResponse.json(employe, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'employé' },
      { status: 500 }
    )
  }
} 