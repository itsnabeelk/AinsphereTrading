const express = require('express');
const router = express.Router();

const uploadHero = require('../middleware/uploadFmcgHero');
const uploadAbout = require('../middleware/uploadFmcgAbout');
const uploadClient = require('../middleware/uploadFmcgClient');

const heroController = require('../controllers/fmcg/homeHero.controller');
const aboutController = require('../controllers/fmcg/homeAbout.controller');
const marqueeController = require('../controllers/fmcg/homeMarquee.controller');
const clientController = require('../controllers/fmcg/homeClient.controller');

/* ===================================================== */
/* ================= Upload Wrapper ==================== */
/* ===================================================== */

const handleUpload = (uploadMiddleware) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || 'File upload failed'
                });
            }
            next();
        });
    };
};

/* ===================================================== */
/* ================= HERO =============================== */
/* ===================================================== */

router.get('/hero/public', heroController.getPublic);
router.get('/hero/admin', heroController.getAdmin);

router.post(
    '/hero/save',
    handleUpload(uploadHero.single('image')),
    heroController.save
);

router.delete('/hero/:id', heroController.remove);

/* ===================================================== */
/* ================= ABOUT ============================== */
/* ===================================================== */

router.get('/about/public', aboutController.getPublic);
router.get('/about/admin', aboutController.getAdmin);

router.post(
    '/about/save',
    handleUpload(uploadAbout.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brochure_en', maxCount: 1 },
        { name: 'brochure_ar', maxCount: 1 }
    ])),
    aboutController.save
);
/* ===================================================== */
/* ================= MARQUEE ============================ */
/* ===================================================== */

router.get('/marquee/public', marqueeController.getPublic);
router.get('/marquee/admin', marqueeController.getAdmin);

router.post('/marquee/create', marqueeController.create);
router.put('/marquee/update/:id', marqueeController.update);
router.delete('/marquee/:id', marqueeController.remove);

/* ===================================================== */
/* ================= CLIENT ============================= */
/* ===================================================== */

router.get('/clients/public', clientController.getPublic);
router.get('/clients/admin', clientController.getAdmin);

router.post(
    '/clients/create',
    handleUpload(uploadClient.single('image')),
    clientController.create
);

router.put(
    '/clients/update/:id',
    handleUpload(uploadClient.single('image')),
    clientController.update
);

router.delete('/clients/:id', clientController.remove);

module.exports = router;
