import { NextRequest, NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET() {
  try {
    const directions = await PersonnesService.getAllDirections()
    return NextResponse.json(directions)
  } catch (error) {
    console.error('Erreur lors de la récupération des directions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des directions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const directionData = await request.json()

    const direction = await PersonnesService.createDirection(directionData)
    
    if (!direction) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la direction' },
        { status: 500 }
      )
    }

    return NextResponse.json(direction, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la direction:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la direction' },
      { status: 500 }
    )
  }
} 