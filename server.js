const express = require('express');
const path = require('path');
const { initModels } = require('./backend/models');
const { storagePath } = require('./backend/config/database');
const homeRoutes = require('./backend/routes');
const { registerUser, loginUser } = require('./backend/controllers/userController');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.use('/', homeRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, dbPath: storagePath });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

async function startServer(port, attempts = 5) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempts > 0) {
        console.warn(`Port ${port} occupé, tentative ${port + 1}...`);
        setTimeout(() => {
          startServer(port + 1, attempts - 1).then(resolve).catch(reject);
        }, 200);
        return;
      }

      reject(err);
    });
  });
}

async function init() {
  await initModels();
  await startServer(PORT);
}

init().catch((error) => {
  console.error('Impossible de démarrer le serveur :', error);
  process.exit(1);
});

module.exports = app;
