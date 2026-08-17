const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom ne peut pas être vide.' },
        len: { args: [2, 100], msg: 'Le nom doit faire entre 2 et 100 caractères.' },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: 'Cet email est déjà utilisé.' },
      validate: { isEmail: { msg: "L'email est invalide." } },
    },
    motDePasse: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le mot de passe est obligatoire.' },
        len: { args: [6, 255], msg: 'Le mot de passe doit faire au moins 6 caractères.' },
      },
    },
    role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.motDePasse) user.motDePasse = await bcrypt.hash(user.motDePasse, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('motDePasse')) user.motDePasse = await bcrypt.hash(user.motDePasse, 10);
      },
    },
  }
);

User.prototype.verifierMotDePasse = async function (motDePasse) {
  return bcrypt.compare(motDePasse, this.motDePasse);
};

User.prototype.toJSON = function () {
  const valeurs = { ...this.get() };
  delete valeurs.motDePasse;
  return valeurs;
};

module.exports = User;
