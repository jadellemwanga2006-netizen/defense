const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.homePage);
router.get('/inscription', homeController.inscriptionPage);
router.get('/dashboard-user', homeController.dashboardUserPage);
router.get('/dashboard-admin', homeController.dashboardAdminPage);

module.exports = router;
