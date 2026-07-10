const express = require('express');
const router = express.Router();
const controller = require('../controllers/mepServiceDetail.controller');
const upload = require('../middleware/uploadMepServiceDetail');
const authMiddleware = require('../middleware/auth.middleware');

/* ================= PUBLIC ================= */
router.get('/public/:slug', controller.getPublicBySlug);

/* ================= ADMIN - MAIN DETAIL ================= */
router.get('/admin/:serviceId', authMiddleware, controller.getAdminByService);
router.put(
    '/admin/:serviceId',
    authMiddleware,
    upload.single('hero_image'),
    controller.saveDetail
);

/* ================= ADMIN - SECTIONS ================= */
router.get(
    '/admin/:serviceId/sections',
    authMiddleware,
    controller.getSections
);

router.post(
    '/admin/:serviceId/sections',
    authMiddleware,
    controller.createSection
);

router.put(
    '/sections/:id',
    authMiddleware,
    controller.updateSection
);

router.delete(
    '/sections/:id',
    authMiddleware,
    controller.deleteSection
);

/* ================= ADMIN - POINTS ================= */
router.get(
    '/admin/:serviceId/points',
    authMiddleware,
    controller.getPoints
);

router.post(
    '/admin/:serviceId/points',
    authMiddleware,
    controller.createPoint
);

router.put(
    '/points/:id',
    authMiddleware,
    controller.updatePoint
);

router.delete(
    '/points/:id',
    authMiddleware,
    controller.deletePoint
);

/* ================= ADMIN - PRODUCTS ================= */
router.get(
    '/admin/:serviceId/products',
    authMiddleware,
    controller.getProducts
);

router.post(
    '/admin/:serviceId/products',
    authMiddleware,
    upload.single('image'),
    controller.createProduct
);

router.put(
    '/products/:id',
    authMiddleware,
    upload.single('image'),
    controller.updateProduct
);

router.delete(
    '/products/:id',
    authMiddleware,
    controller.deleteProduct
);

module.exports = router;
