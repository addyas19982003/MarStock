import { NextResponse } from 'next/server'
import { EmployeService } from '@/lib/services/employe-service'

export async function GET() {
  try {
    const departements = await EmployeService.getDepartements()
    return NextResponse.json(departements)
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des départements' },
      { status: 500 }
    )
  }
} 