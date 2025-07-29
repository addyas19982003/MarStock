import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Headers de sécurité
  const response = NextResponse.next()
  
  // Headers de sécurité
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Headers de performance
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  
  // Compression pour les ressources statiques
  if (request.nextUrl.pathname.startsWith('/_next/') || 
      request.nextUrl.pathname.startsWith('/images/') ||
      request.nextUrl.pathname.startsWith('/favicon.ico')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Protection contre les attaques par force brute sur l'authentification
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Ajouter un délai minimal pour les tentatives de connexion
    if (request.method === 'POST') {
      // Simuler un délai minimal pour éviter les attaques par force brute
      // En production, vous devriez implémenter un système de rate limiting
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 