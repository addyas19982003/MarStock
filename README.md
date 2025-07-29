# 🏛️ Système de Gestion Ministérielle

Application de gestion complète pour les ministères avec gestion des employés, marchés, stock et livraisons.

## 📊 Diagrammes UML

Le projet inclut des diagrammes UML complets dans le dossier `diagrammes-uml/` :

### 📁 Fichiers UML Disponibles
- `use-case-diagram.puml` - Diagramme de cas d'usage
- `class-diagram.puml` - Diagramme de classes  
- `sequence-diagram.puml` - Diagramme de séquence
- `README.md` - Documentation des diagrammes

### 🎨 Comment Visualiser les Diagrammes

#### Méthode 1: PlantUML Online (Recommandé)
1. Allez sur https://www.plantuml.com/plantuml/
2. Copiez le contenu d'un fichier `.puml`
3. Le diagramme se génère automatiquement
4. Exportez en PNG/SVG

#### Méthode 2: Extension VS Code
1. Installez l'extension "PlantUML" dans VS Code
2. Ouvrez un fichier `.puml`
3. Utilisez `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram"

#### Méthode 3: Installation Locale
```bash
# Installer Java (requis)
# Télécharger PlantUML.jar depuis https://plantuml.com/download

# Générer les images
java -jar plantuml.jar diagrammes-uml/*.puml
```

## 🚀 Démarrage Rapide

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

## 📚 Documentation

- `DESCRIPTION_COMPLETE_APPLICATION.md` - Description détaillée de l'application
- `OPTIMISATIONS_PERFORMANCE.md` - Optimisations de performance
- `RESUME_OPTIMISATIONS.md` - Résumé des optimisations
- `diagrammes-uml/README.md` - Documentation des diagrammes UML

---

*Application développée pour le Ministère de la Transition Numérique et de la Réforme de l'Administration* 