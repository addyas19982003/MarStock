import { NextRequest, NextResponse } from 'next/server'
import { AuthMySQLService } from '@/lib/auth-mysql'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    // Validation des données
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom complet requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Validation du nom complet
    if (fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom complet doit contenir au moins 2 caractères' },
        { status: 400 }
      )
    }

    // Créer l'utilisateur
    const user = await AuthMySQLService.createUser({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      role: 'user', // Par défaut, les nouveaux utilisateurs ont le rôle 'user'
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        phone: user.phone,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    })
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error)
    
    // Gérer les erreurs spécifiques
    if (error.message.includes('existe déjà')) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 