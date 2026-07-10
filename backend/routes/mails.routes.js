const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails.controller');
const authMiddleware = require('../middleware/auth.middleware');

/* ADMIN LOGGED IN ONLY */
router.get('/contacts', authMiddleware, controller.getContacts);
router.delete('/contacts/:id', authMiddleware, controller.deleteContact);

router.get('/careers', authMiddleware, controller.getCareers);
router.delete('/careers/:id', authMiddleware, controller.deleteCareer);

module.exports = router;
