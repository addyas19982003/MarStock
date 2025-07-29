import { NextResponse } from 'next/server'
import { StockService } from '@/lib/services/stock-service'

export async function GET() {
  try {
    const alertes = await StockService.checkStockAlertes()
    return NextResponse.json(alertes)
  } catch (error) {
    console.error('Erreur lors de la vérification des alertes de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des alertes de stock' },
      { status: 500 }
    )
  }
} 