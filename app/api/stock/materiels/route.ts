import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const materiels = await StockService.getAllMateriels()
    return NextResponse.json(materiels)
  } catch (error) {
    console.error('Erreur lors de la récupération des matériels:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des matériels' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const materielData = await request.json()
    
    // Simuler l'ID de l'utilisateur créateur (dans un vrai projet, ceci viendrait du token JWT)
    const userId = 1

    const materiel = await StockService.createMateriel(materielData, userId)
    
    if (!materiel) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du matériel' },
        { status: 500 }
      )
    }

    return NextResponse.json(materiel, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du matériel:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du matériel' },
      { status: 500 }
    )
  }
} 