const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalClient.controller');
const upload = require('../middleware/uploadGeneralClient');
const auth = require('../middleware/auth.middleware');

router.get('/public/clients', controller.getPublicClients);
router.get('/admin/clients', auth, controller.getAdminClients);

router.post('/admin/clients', auth, (req, res, next) => {
    upload.single('logo')(req, res, function (err) {
        if (err) req.uploadError = err;
        next();
    });
}, controller.createClient);

router.delete('/admin/clients/:id', auth, controller.deleteClient);
router.put('/admin/clients/toggle/:id', auth, controller.toggleClient);
router.put(
    '/admin/clients/:id',
    auth,
    (req, res, next) => {
        upload.single('logo')(req, res, function (err) {
            if (err) req.uploadError = err;
            next();
        });
    },
    controller.updateClient
);

module.exports = router;
