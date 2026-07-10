const express = require('express');
const router = express.Router();
const controller = require('../controllers/footerSettings.controller');
const authMiddleware = require('../middleware/auth.middleware');

/* PUBLIC */
router.get('/:type', controller.getFooterSettings);

/* ADMIN */
router.put('/:type', authMiddleware, controller.updateFooterSettings);

module.exports = router;
