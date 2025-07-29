# 📊 Diagrammes UML - Système de Gestion Ministérielle

Ce dossier contient les diagrammes UML de l'application de gestion ministérielle, créés avec PlantUML.

## 📁 Fichiers Disponibles

### 1. **Diagramme de Cas d'Usage** (`use-case-diagram.puml`)
- **Description** : Représente les interactions entre les acteurs et le système
- **Acteurs** : Administrateur, Gestionnaire, Utilisateur, Système
- **Cas d'usage principaux** :
  - Authentification (connexion, inscription, déconnexion)
  - Gestion des employés (CRUD, statistiques)
  - Gestion des marchés (CRUD, suivi, budgets)
  - Gestion du stock (inventaire, affectations, alertes)
  - Tableau de bord (statistiques, alertes, rapports)
  - Administration (utilisateurs, rôles, configuration)

### 2. **Diagramme de Classes** (`class-diagram.puml`)
- **Description** : Structure des classes et leurs relations
- **Packages** :
  - **Authentification** : User, AuthService, AuthMySQLService
  - **Gestion des Employés** : Employe, EmployeService, EmployeClient
  - **Gestion des Marchés** : Marche, MarcheService, BandeLivraison
  - **Gestion du Stock** : Materiel, StockService, StockClient, CategorieMateriel, Fournisseur, MouvementStock
  - **Base de Données** : Database
  - **Interface Utilisateur** : AuthProvider, LoadingSpinner, MinistryHeader
  - **API Routes** : AuthAPI, EmployesAPI, MarchesAPI, StockAPI, DashboardAPI

### 3. **Diagramme de Séquence** (`sequence-diagram.puml`)
- **Description** : Interactions temporelles entre les composants
- **Scénarios couverts** :
  - Processus d'authentification complet
  - Gestion des employés (consultation, ajout, modification, suppression)
  - Récupération des statistiques

## 🎯 Utilisation des Diagrammes

### Visualisation
Pour visualiser ces diagrammes, vous pouvez utiliser :

1. **PlantUML Online** : https://www.plantuml.com/plantuml/
2. **VS Code Extension** : PlantUML
3. **IntelliJ IDEA** : Plugin PlantUML
4. **Command Line** : `java -jar plantuml.jar diagramme.puml`

### Génération d'Images
```bash
# Installer PlantUML
npm install -g plantuml

# Générer les images
plantuml use-case-diagram.puml
plantuml class-diagram.puml
plantuml sequence-diagram.puml
```

## 🏗️ Architecture Représentée

### **Patterns Utilisés**
- **MVC** : Séparation des responsabilités
- **Repository Pattern** : Accès aux données via services
- **Client-Server** : API REST avec Next.js
- **Provider Pattern** : Gestion d'état avec React Context

### **Technologies**
- **Frontend** : Next.js, React, TypeScript
- **Backend** : Next.js API Routes
- **Base de données** : MySQL
- **Authentification** : Session-based avec localStorage
- **UI** : Tailwind CSS, Shadcn/ui

## 🔄 Flux de Données

1. **Authentification** : LoginForm → AuthProvider → AuthService → API → Database
2. **Gestion Employés** : Dashboard → EmployeClient → API → EmployeService → Database
3. **Gestion Stock** : Dashboard → StockClient → API → StockService → Database
4. **Gestion Marchés** : Dashboard → MarcheClient → API → MarcheService → Database

## 📋 Points Clés

### **Sécurité**
- Validation côté client et serveur
- Gestion des permissions par rôle
- Sessions sécurisées
- Protection CSRF

### **Performance**
- Pool de connexions MySQL optimisé
- Requêtes spécifiques (pas de SELECT *)
- Mise à jour asynchrone des logs
- Cache des données fréquemment utilisées

### **Maintenabilité**
- Architecture modulaire
- Services séparés par domaine
- Types TypeScript stricts
- Documentation complète

## 🚀 Prochaines Étapes

Pour enrichir ces diagrammes, vous pourriez ajouter :

1. **Diagramme d'État** : États des entités (Employé, Marché, Matériel)
2. **Diagramme d'Activité** : Processus métier complexes
3. **Diagramme de Déploiement** : Architecture infrastructure
4. **Diagramme de Composants** : Vue système plus détaillée

---

*Ces diagrammes sont générés automatiquement et reflètent l'architecture actuelle de l'application.* 