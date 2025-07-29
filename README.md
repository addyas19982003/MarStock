# Système de Gestion Ministérielle

Application de gestion complète pour les ministères avec gestion des employés, marchés, stock et livraisons.

##  Démarrage Rapide

### Prérequis
- Node.js 18+ 
- MySQL 8.0+
- npm ou pnpm

### Installation
```bash
# Installer les dépendances
npm install

# Configurer la base de données
npm run setup

# Démarrer l'application
npm run dev
```

## 🔑 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@ministere.gov.ma | password123 | Administrateur |
| manager@ministere.gov.ma | password123 | Gestionnaire |
| user@ministere.gov.ma | password123 | Utilisateur |

## 📋 Fonctionnalités

- ✅ Gestion des employés avec statistiques
- ✅ Gestion des marchés avec suivi des livraisons
- ✅ Gestion de stock avec alertes
- ✅ Système d'authentification sécurisé
- ✅ Interface responsive et moderne
- ✅ Audit trail complet
- ✅ Permissions granulaires

## 🛠️ Scripts Disponibles

```bash
# Démarrage automatique complet
npm run setup

# Initialisation de la base de données
npm run init-db

# Test de connexion à la base de données
npm run db:test

# Démarrage en mode développement
npm run dev

# Build de production
npm run build
```

*Application développée pour le Ministère de la Transition Numérique et de la Réforme de l'Administration* 