import { NextResponse } from 'next/server'
import { EmployeService } from '@/lib/services/employe-service'

export async function GET() {
  try {
    const postes = await EmployeService.getPostes()
    return NextResponse.json(postes)
  } catch (error) {
    console.error('Erreur lors de la récupération des postes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des postes' },
      { status: 500 }
    )
  }
} 