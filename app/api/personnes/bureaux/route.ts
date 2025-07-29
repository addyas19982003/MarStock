import { NextRequest, NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET() {
  try {
    const bureaux = await PersonnesService.getAllBureaux()
    return NextResponse.json(bureaux)
  } catch (error) {
    console.error('Erreur lors de la récupération des bureaux:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bureaux' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bureauData = await request.json()

    const bureau = await PersonnesService.createBureau(bureauData)
    
    if (!bureau) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du bureau' },
        { status: 500 }
      )
    }

    return NextResponse.json(bureau, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du bureau:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du bureau' },
      { status: 500 }
    )
  }
} 