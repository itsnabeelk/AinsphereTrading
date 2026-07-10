const express = require('express');
const router = express.Router();

const controller = require('../controllers/uniformServiceDetail.controller');
const upload = require('../middleware/uploadUniformServiceDetail');
const auth = require('../middleware/auth.middleware');

/* ==========================================
   COMMON UPLOAD HANDLERS
========================================== */

// Hero image upload
const uploadHero = (req, res, next) => {
    upload.single('hero_image')(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
};

// Product image upload
const uploadProduct = (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
};

/* ==========================================
   PUBLIC
========================================== */

router.get('/public/:slug', controller.getPublicBySlug);

/* ==========================================
   ADMIN - MAIN DETAIL
========================================== */

router.get('/admin/:serviceId', auth, controller.getAdminByService);

router.put(
    '/admin/:serviceId',
    auth,
    uploadHero,
    controller.saveDetail
);

/* ==========================================
   SECTIONS
========================================== */

router.get('/admin/:serviceId/sections', auth, controller.getSections);

router.post('/admin/:serviceId/sections', auth, controller.createSection);

router.put('/sections/:id', auth, controller.updateSection);

router.delete('/sections/:id', auth, controller.deleteSection);

/* ==========================================
   POINTS
========================================== */

router.get('/admin/:serviceId/points', auth, controller.getPoints);

router.post('/admin/:serviceId/points', auth, controller.createPoint);

router.put('/points/:id', auth, controller.updatePoint);

router.delete('/points/:id', auth, controller.deletePoint);

/* ==========================================
   PRODUCTS
========================================== */

router.get('/admin/:serviceId/products', auth, controller.getProducts);

router.post(
    '/admin/:serviceId/products',
    auth,
    uploadProduct,
    controller.createProduct
);

router.put(
    '/products/:id',
    auth,
    uploadProduct,
    controller.updateProduct
);

router.delete('/products/:id', auth, controller.deleteProduct);

module.exports = router;