const { sequelize } = require('../config/database');
const User = require('./User');

function definirAssociations() {
  // Les associations seront ajoutées avec les futurs modèles.
}

async function initModels(options = {}) {
  await sequelize.authenticate();
  definirAssociations();

  const estEnDeveloppement = process.env.NODE_ENV !== 'production';
  await sequelize.sync({
    force: estEnDeveloppement && options.force === true,
    alter: estEnDeveloppement && options.alter === true,
  });

  return true;
}

async function creerAdminParDefaut() {
  const emailAdmin = process.env.ADMIN_EMAIL || 'admin@bomengo.com';
  const motDePasseAdmin = process.env.ADMIN_PASSWORD || 'Admin@2026';
  const adminExiste = await User.findOne({ where: { email: emailAdmin } });

  if (!adminExiste) {
    await User.create({ nom: 'Administrateur', email: emailAdmin, motDePasse: motDePasseAdmin, role: 'admin' });
  }
}

module.exports = { sequelize, User, initModels, creerAdminParDefaut };
