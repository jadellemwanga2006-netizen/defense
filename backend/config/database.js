

const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

// ==========================================
// CONFIGURATION DU CHEMIN DE LA BASE DE DONNÉES
// ==========================================

function getStoragePath() {
  // Si SQLITE_PATH est défini dans .env
  if (process.env.SQLITE_PATH) {
    const envPath = process.env.SQLITE_PATH;

    // Si c'est déjà un chemin absolu
    if (path.isAbsolute(envPath)) {
      return envPath;
    }

    // Sinon, on le résout depuis la racine du projet
    return path.resolve(process.cwd(), envPath);
  }

  // Chemin par défaut : /data/app.sqlite à la racine du projet
  return path.join(__dirname, '..', '..', 'data', 'app.sqlite');
}

const storagePath = getStoragePath();

// ==========================================
// CRÉATION DU DOSSIER DATA SI NÉCESSAIRE
// ==========================================

function ensureDataDirectory() {
  const dataDir = path.dirname(storagePath);

  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`📁 Dossier créé : ${dataDir}`);
    } catch (error) {
      console.error(`❌ Impossible de créer le dossier ${dataDir}:`, error.message);
    }
  }
}

// On s'assure que le dossier existe au chargement
ensureDataDirectory();

// ==========================================
// INITIALISATION DE SEQUELIZE
// ==========================================

const isDev = process.env.NODE_ENV !== 'production';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: isDev ? console.log : false, // Logs seulement en développement
  define: {
    timestamps: true,     // Ajoute createdAt et updatedAt
    underscored: false,   // Utilise camelCase (pas snake_case)
    freezeTableName: true, // Ne pas pluraliser les noms de tables
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// ==========================================
// FONCTION DE CONNEXION
// ==========================================

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connexion SQLite réussie : ${storagePath}`);
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à SQLite :', error.message);
    throw error;
  }
}

// ==========================================
// FONCTION DE SYNCHRONISATION DES MODÈLES
// ==========================================

async function syncDB(options = {}) {
  try {
    // En développement : { alter: true } pour mettre à jour les tables
    // En production : { alter: false } pour éviter de perdre des données
    const syncOptions = isDev
      ? { alter: true, ...options }
      : { ...options };

    await sequelize.sync(syncOptions);
    console.log('✅ Modèles synchronisés avec la base de données');
    return true;
  } catch (error) {
    console.error('❌ Erreur de synchronisation :', error.message);
    throw error;
  }
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  sequelize,          // Instance Sequelize (pour les requêtes)
  Sequelize,          // Classe Sequelize (pour les DataTypes)
  storagePath,        // Chemin de la DB (pour debug)
  connectDB,          // Fonction pour tester la connexion
  syncDB,             // Fonction pour synchroniser les modèles
};


