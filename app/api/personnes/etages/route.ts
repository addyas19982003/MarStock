import { NextRequest, NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET() {
  try {
    const etages = await PersonnesService.getAllEtages()
    return NextResponse.json(etages)
  } catch (error) {
    console.error('Erreur lors de la récupération des étages:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des étages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const etageData = await request.json()

    const etage = await PersonnesService.createEtage(etageData)
    
    if (!etage) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'étage' },
        { status: 500 }
      )
    }

    return NextResponse.json(etage, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'étage:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'étage' },
      { status: 500 }
    )
  }
} 