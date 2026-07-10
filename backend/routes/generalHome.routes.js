const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalHome.controller');
const upload = require('../middleware/uploadGeneralHero');
const authMiddleware = require('../middleware/auth.middleware');


/* PUBLIC */
router.get('/public/hero', controller.getPublicHero);

/* ADMIN */
router.get('/admin/hero', authMiddleware, controller.getAdminHero);
router.post(
    '/admin/hero',
    authMiddleware,
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err) req.uploadError = err;
            next();
        });
    },
    controller.createHero
);

router.put(
    '/admin/hero/:id',
    authMiddleware,
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err) req.uploadError = err;
            next();
        });
    },
    controller.updateHero
);

router.delete('/admin/hero/:id', authMiddleware, controller.deleteHero);
router.put('/admin/hero/toggle/:id', authMiddleware, controller.toggleHero);

module.exports = router;
