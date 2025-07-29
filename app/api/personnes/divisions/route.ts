import { NextRequest, NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET() {
  try {
    const divisions = await PersonnesService.getAllDivisions()
    return NextResponse.json(divisions)
  } catch (error) {
    console.error('Erreur lors de la récupération des divisions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des divisions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const divisionData = await request.json()

    const division = await PersonnesService.createDivision(divisionData)
    
    if (!division) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la division' },
        { status: 500 }
      )
    }

    return NextResponse.json(division, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la division:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la division' },
      { status: 500 }
    )
  }
} 