# Bomengo Ya Mwasi

Application web en Express MVC pour une plateforme avec :
- page d’inscription / connexion
- tableau de bord utilisateur
- tableau de bord administrateur

## Architecture de l’application

```text
APPLICATION
│
├── FRONTEND
│   ├── HTML / CSS / JS
│   └── Interface utilisateur
│
└── BACKEND
	├── Node.js / Express
	├── Routes
	├── Controllers
	├── Models
	├── Sequelize
	└── SQLite
```

Flux d’une requête :

```text
Navigateur → Route → Controller → Model → Sequelize → SQLite
```

## Ce qu’est Express MVC

MVC = Modèle - Vue - Contrôleur.

- Modèle : gère les données, ici la base SQLite et le modèle User
- Vue : les fichiers HTML, CSS et JavaScript dans le dossier public
- Contrôleur : reçoit les demandes HTTP et décide quelle vue afficher ou quelle logique lancer

Le serveur Express reçoit des requêtes du navigateur, puis appelle le bon contrôleur, puis affiche la page HTML correspondante.

## Dossier par dossier

### 1. backend/
Le dossier backend contient la logique serveur.

#### backend/config/
- database.js : configure la base SQLite et Sequelize
- sert à créer la connexion avec la base de données

#### backend/controllers/
- homeController.js : affiche les pages HTML
- userController.js : gère l’inscription et la connexion utilisateur

#### backend/models/
- User.js : définit le modèle utilisateur dans la base
- index.js : relie les modèles et initialise la base

#### backend/routes/
- index.js : contient les routes principales du site

### 2. public/
Le dossier public contient toute l’interface utilisateur.

- inscription.html : page de connexion / inscription
- dashuser.html : tableau de bord utilisateur
- dashadmin.html : tableau de bord administrateur
- css/ : une feuille de style par page
- js/ : un script JavaScript par page

### 3. data/
- contient la base SQLite locale SQLite
- le fichier est généré automatiquement lorsque le serveur démarre

### 4. server.js
Fichier principal du serveur.

Il sert à :
- créer l’application Express
- configurer les routes API
- démarrer le serveur
- initialiser la base de données

### 5. package.json
Contient les scripts pour lancer le projet.

## Commandes à utiliser dans le terminal

### 1. Installer les dépendances
```bash
npm install
```
Pourquoi ?
Parce que le projet a besoin des paquets Node.js comme Express, Sequelize et SQLite.
Sans cette commande, le serveur ne peut pas démarrer.

### 2. Lancer le serveur
```bash
npm start
```
Pourquoi ?
Parce que le script start dans package.json exécute :
```bash
node server.js
```
C’est la commande standard pour démarrer un serveur Express.

### 3. Mode développement
```bash
npm run dev
```
Pourquoi ?
Parce que cette commande utilise nodemon, qui redémarre automatiquement le serveur quand tu modifies un fichier.

## Comment allumer mon serveur

Dans le terminal, écris :

```bash
cd "c:\Users\UJISHA\Desktop\défense 14 juillet\express-mvc"
npm install
npm start
```

Puis ouvre dans le navigateur :

```text
http://localhost:3000
```

Si le port 3000 est déjà utilisé, le serveur essaie automatiquement un autre port, par exemple 3001 ou 3002.

## Routes principales

- `/` : page d’inscription / connexion
- `/inscription` : même page d’inscription / connexion
- `/dashboard-user` : tableau de bord utilisateur
- `/dashboard-admin` : tableau de bord administrateur
- `/api/register` : inscription côté API
- `/api/login` : connexion côté API
- `/health` : vérifie que le serveur fonctionne correctement

## Exemple de logique du projet

1. Le navigateur appelle une URL
2. Express reçoit la demande
3. la route correspondante appelle le bon contrôleur
4. le contrôleur envoie la page HTML de public
5. le JavaScript et le CSS de public rendent la page interactive et la mettent en forme
6. le serveur fait aussi les appels d’inscription et de connexion via les APIs

## Vérification
Le serveur fonctionne correctement quand le terminal affiche quelque chose comme :

```bash
Server running on http://localhost:3000
```

ou un autre port si 3000 est occupé.

## En résumé

- backend = logique du serveur et base de données
- public = HTML, CSS et JavaScript du frontend
- backend = routes, controllers, models et accès à SQLite
- server.js = point d’entrée principal
- npm start = commande essentielle pour lancer le projet"# defense" 
