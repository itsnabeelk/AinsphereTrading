const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalTeam.controller');
const upload = require('../middleware/uploadGeneralTeam');

/* PUBLIC */
router.get('/public/team', controller.getPublic);

/* ADMIN */
router.get('/admin/team', controller.getAdmin);
router.post('/admin/team', upload.single('image'), controller.create);
router.put('/admin/team/:id', upload.single('image'), controller.update);
router.delete('/admin/team/:id', controller.remove);
router.put('/admin/team/toggle/:id', controller.toggle);

module.exports = router;
