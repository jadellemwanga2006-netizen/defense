
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clé secrète JWT (à mettre dans .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'bomengo_secret_key_change_in_production';

/**
 * INSCRIPTION - Crée un utilisateur avec mot de passe hashé
 */
async function registerUser(req, res, next) {
  try {
    const nom = String(req.body.nom || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const motDePasse = String(req.body.motDePasse || '').trim();
    const role = String(req.body.role || 'user').toLowerCase();

    // Validation
    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    if (motDePasse.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères.' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Le rôle est invalide.' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      email,
      motDePasse,
      role,
    });

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès.',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * CONNEXION - Vérifie email + mot de passe et retourne un JWT
 */
async function loginUser(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const motDePasse = String(req.body.motDePasse || '').trim();

    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Chercher l'utilisateur par email UNIQUEMENT (pas par rôle)
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    // 🔐 Comparer le mot de passe hashé
    const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
};





