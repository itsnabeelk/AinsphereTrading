const express = require('express');
const router = express.Router();

const controller = require('../controllers/careerController');
const applyController = require('../controllers/careerApplyController');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/uploadCV');

/* PUBLIC */
router.get('/public', controller.getPublic);

/* APPLY (ONLY ONE ROUTE - WITH MULTER) */
router.post('/apply', upload.single('cv'), applyController.apply);

/* ADMIN */
router.get('/admin', authMiddleware, controller.getAdmin);
router.post('/add', authMiddleware, controller.add);
router.put('/edit/:id', authMiddleware, controller.update);
router.delete('/delete/:id', authMiddleware, controller.delete);
router.put('/toggle/:id', authMiddleware, controller.toggle);

module.exports = router;