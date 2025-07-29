import { NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET() {
  try {
    const stats = await PersonnesService.getPersonnesStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
} 