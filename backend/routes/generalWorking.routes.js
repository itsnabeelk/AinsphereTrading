const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalWorking.controller');

// PUBLIC
router.get('/public/working', controller.getPublic);

// ADMIN
router.get('/admin/working', controller.getAdmin);
router.post('/admin/working', controller.create);
router.put('/admin/working/:id', controller.update);
router.delete('/admin/working/:id', controller.remove);
router.put('/admin/working/toggle/:id', controller.toggle);

module.exports = router;
