const express = require('express');
const router = express.Router();

const controller = require('../controllers/uniformServices.controller');
const upload = require('../middleware/uploadUniformService');
const auth = require('../middleware/auth.middleware');

/* ==========================================
   COMMON UPLOAD HANDLER (CLEAN)
========================================== */
const uploadMiddleware = (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
};

/* ==========================================
   ADMIN ROUTES
========================================== */

// GET ALL
router.get('/admin', auth, controller.getAllAdmin);

// CREATE
router.post(
    '/admin',
    auth,
    uploadMiddleware,
    controller.create
);

// UPDATE
router.put(
    '/admin/:id',
    auth,
    uploadMiddleware,
    controller.update
);

// DELETE
router.delete('/admin/:id', auth, controller.remove);

// TOGGLE STATUS
router.put('/admin/toggle/:id', auth, controller.toggleStatus);

/* ==========================================
   PUBLIC ROUTES
========================================== */

// GET ACTIVE SERVICES
router.get('/public', controller.getAllPublic);

module.exports = router;