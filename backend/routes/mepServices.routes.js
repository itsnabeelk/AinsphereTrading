const express = require('express');
const router = express.Router();

const controller = require('../controllers/mepServices.controller');
const upload = require('../middleware/uploadMepService');
const authMiddleware = require('../middleware/auth.middleware');


/* ADMIN */
router.get('/admin', authMiddleware, controller.getAllAdmin);
router.post('/admin', authMiddleware, upload.single('image'), controller.create);
router.put('/admin/:id', authMiddleware, upload.single('image'), controller.update);
router.delete('/admin/:id', authMiddleware, controller.remove);
router.put('/admin/toggle/:id', authMiddleware, controller.toggleStatus);

/* PUBLIC */
router.get('/public', controller.getAllPublic);

module.exports = router;
