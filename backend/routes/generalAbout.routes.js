const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalAbout.controller');
const upload = require('../middleware/uploadGeneralAbout');
const auth = require('../middleware/auth.middleware');

/* PUBLIC */
router.get('/public/about', controller.getPublicAbout);

/* ADMIN */
router.get('/admin/about', auth, controller.getAdminAbout);

router.post(
    '/admin/about',
    auth,
    (req, res, next) => {
        upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'brochure_en', maxCount: 1 },
            { name: 'brochure_ar', maxCount: 1 }
        ])(req, res, function (err) {
            if (err) req.uploadError = err;
            next();
        });
    },
    controller.saveAbout
);

module.exports = router;
