import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const fournisseurs = await StockService.getAllFournisseurs()
    return NextResponse.json(fournisseurs)
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des fournisseurs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const fournisseurData = await request.json()

    const fournisseur = await StockService.createFournisseur(fournisseurData)
    
    if (!fournisseur) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du fournisseur' },
        { status: 500 }
      )
    }

    return NextResponse.json(fournisseur, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du fournisseur' },
      { status: 500 }
    )
  }
} 