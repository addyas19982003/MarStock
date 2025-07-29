import { NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function GET() {
  try {
    const stats = await MarcheService.getMarcheStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
} 