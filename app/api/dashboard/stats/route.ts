import { NextResponse } from 'next/server'
import { DashboardService } from '@/lib/services/dashboard-service'

export async function GET() {
  try {
    const stats = await DashboardService.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du dashboard:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
} 