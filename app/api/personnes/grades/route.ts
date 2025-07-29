import { NextRequest, NextResponse } from 'next/server'
import { PersonnesService } from '@/lib/services/personnes-service'

export async function GET() {
  try {
    const grades = await PersonnesService.getAllGrades()
    return NextResponse.json(grades)
  } catch (error) {
    console.error('Erreur lors de la récupération des grades:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des grades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const gradeData = await request.json()

    const grade = await PersonnesService.createGrade(gradeData)
    
    if (!grade) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du grade' },
        { status: 500 }
      )
    }

    return NextResponse.json(grade, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du grade:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du grade' },
      { status: 500 }
    )
  }
} 