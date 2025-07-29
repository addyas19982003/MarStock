import { NextResponse } from 'next/server'
import { EmployeService } from '@/lib/services/employe-service'

export async function GET() {
  try {
    const stats = await EmployeService.getEmployeStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
} 