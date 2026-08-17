const path = require('path');

function homePage(req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'inscription.html'));
}

function inscriptionPage(req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'inscription.html'));
}

function dashboardUserPage(req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'dashuser.html'));
}

function dashboardAdminPage(req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'dashadmin.html'));
}

module.exports = {
  homePage,
  inscriptionPage,
  dashboardUserPage,
  dashboardAdminPage,
};
