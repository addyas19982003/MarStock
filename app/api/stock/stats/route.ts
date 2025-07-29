import { NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const stats = await StockService.getStockStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques de stock' },
      { status: 500 }
    )
  }
} 