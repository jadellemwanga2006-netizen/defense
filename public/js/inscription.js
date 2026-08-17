const API_URL = '/api';
const loginPanel = document.querySelector('#bloc-connexion');
const registerPanel = document.querySelector('#bloc-inscription');
const loginForm = document.querySelector('#formulaire-connexion');
const registerForm = document.querySelector('#formulaire-inscription');
const messageElement = document.querySelector('#authMessage') || document.querySelector('#toast');

function showMessage(message, type = 'info') {
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.className = `toast affiche ${type}`;
}

function showForm(mode) {
  const register = mode === 'inscription';
  loginPanel?.classList.toggle('formulaire-cache', register);
  registerPanel?.classList.toggle('formulaire-cache', !register);
}

window.afficherFormulaire = showForm;
document.querySelectorAll('[onclick*="afficherFormulaire"]').forEach((link) => {
  const mode = link.getAttribute('onclick').includes('inscription') ? 'inscription' : 'connexion';
  link.removeAttribute('onclick');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showForm(mode);
  });
});

async function request(path, payload) {
  const response = await fetch(`${API_URL}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Erreur interne du serveur.');
  return data;
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(loginForm));
  showMessage('Connexion en cours...');
  try {
    const data = await request('login', values);
    localStorage.setItem('bomengo_token', data.token);
    localStorage.setItem('bomengo_session', JSON.stringify(data.user));
    showMessage('Connexion réussie.', 'succes');
    window.setTimeout(() => {
      window.location.href = data.user.role === 'admin' ? '/dashboard-admin' : '/dashboard-user';
    }, 500);
  } catch (error) {
    showMessage(error.message, 'erreur');
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(registerForm));
  if (values.motDePasse !== values.confirmation) {
    showMessage('Les mots de passe ne correspondent pas.', 'erreur');
    return;
  }
  delete values.confirmation;
  values.role = 'user';
  showMessage('Création du compte en cours...');
  try {
    const data = await request('register', values);
    localStorage.setItem('bomengo_token', data.token);
    localStorage.setItem('bomengo_session', JSON.stringify(data.user));
    showMessage('Compte créé avec succès.', 'succes');
    window.setTimeout(() => { window.location.href = '/dashboard-user'; }, 500);
  } catch (error) {
    showMessage(error.message, 'erreur');
  }
});
