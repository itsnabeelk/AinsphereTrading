const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalServices.controller');
const upload = require('../middleware/uploadGeneralService.js');

/* ================= PUBLIC ================= */
router.get('/public', controller.getListPage);
router.get('/public/:slug', controller.getBySlug);

/* ================= ADMIN ================= */
router.get('/admin', controller.getAdminList);
router.post('/admin/create', upload.single('image'), controller.create);
router.put('/admin/update/:id', upload.single('image'), controller.update);
router.delete('/admin/delete/:id', controller.delete);
router.put('/admin/toggle/:id', controller.toggle);

module.exports = router;
