import { NextResponse } from 'next/server'
import { MarcheService } from '@/lib/services/marche-service'

export async function GET() {
  try {
    const alertes = await MarcheService.checkMarcheAlertes()
    return NextResponse.json(alertes)
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des alertes' },
      { status: 500 }
    )
  }
} 