const express = require('express');
const router = express.Router();
const controller = require('../controllers/fmcgServiceDetail.controller');
const upload = require('../middleware/uploadFmcgServiceDetail');

/* ================= PUBLIC ================= */
router.get('/public/:slug', controller.getBySlug);

/* ================= ADMIN - DETAIL ================= */
router.get('/admin/:id', controller.getAdminDetail);
router.post('/admin/save', upload.single('hero_image'), controller.saveDetail);

/* ================= ADMIN - SECTIONS ================= */
router.get('/admin/sections/:serviceId', controller.getSections);
router.post('/admin/section/create', controller.createSection);
router.put('/admin/section/update/:id', controller.updateSection);
router.delete('/admin/section/:id', controller.deleteSection);

/* ================= ADMIN - POINTS ================= */
router.get('/admin/points/:serviceId', controller.getPoints);
router.post('/admin/point/create', controller.createPoint);
router.put('/admin/point/update/:id', controller.updatePoint);
router.delete('/admin/point/:id', controller.deletePoint);

/* ================= ADMIN - PRODUCTS ================= */
router.get('/admin/products/:serviceId', controller.getProducts);
router.post('/admin/product/create', upload.single('image'), controller.createProduct);
router.put('/admin/product/update/:id', upload.single('image'), controller.updateProduct);
router.delete('/admin/product/delete/:id', controller.deleteProduct);

module.exports = router;
