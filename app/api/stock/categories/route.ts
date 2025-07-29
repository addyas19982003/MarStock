import { NextRequest, NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const categories = await StockService.getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const categorieData = await request.json()

    const categorie = await StockService.createCategorie(categorieData)
    
    if (!categorie) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la catégorie' },
        { status: 500 }
      )
    }

    return NextResponse.json(categorie, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
} 