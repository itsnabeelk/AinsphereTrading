const express = require('express');
const router = express.Router();

const uploadHero = require('../middleware/uploadUniformHero');
const uploadAbout = require('../middleware/uploadUniformAbout');
const uploadClient = require('../middleware/uploadUniformClient');
const uploadMission = require('../middleware/uploadUniformMission');

const heroController = require('../controllers/uniform/homeHero.controller');
const aboutController = require('../controllers/uniform/homeAbout.controller');
const clientController = require('../controllers/uniform/homeClient.controller');
const workingController = require('../controllers/uniform/homeWorking.controller');
const missionVisionController = require('../controllers/uniform/homeMissionVision.controller');

/* ================= Upload Wrapper ================= */

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

/* ================= HERO ================= */

router.get('/hero/public', heroController.getPublic);
router.get('/hero/admin', heroController.getAdmin);
router.post('/hero/save', handleUpload(uploadHero.single('image')), heroController.save);
router.delete('/hero/:id', heroController.remove);
router.put('/hero/status/:id', heroController.toggleStatus);
/* ================= ABOUT ================= */

router.get('/about/public', aboutController.getPublic);
router.get('/about/admin', aboutController.getAdmin);
router.post(
    '/about/save',
    handleUpload(
        uploadAbout.fields([
            { name: 'image', maxCount: 1 },
            { name: 'brochure_en', maxCount: 1 },
            { name: 'brochure_ar', maxCount: 1 }
        ])
    ),
    aboutController.save
);

/* ================= CLIENT ================= */

router.get('/clients/public', clientController.getPublic);
router.get('/clients/admin', clientController.getAdmin);
router.post('/clients/create', handleUpload(uploadClient.single('image')), clientController.create);
router.put('/clients/update/:id', handleUpload(uploadClient.single('image')), clientController.update);
router.delete('/clients/:id', clientController.remove);

/* ================= WORKING ================= */

router.get('/working/public', workingController.getPublic);
router.get('/working/admin', workingController.getAdmin);
router.post('/working/create', workingController.create);
router.put('/working/update/:id', workingController.update);
router.delete('/working/:id', workingController.remove);

/* ================= MISSION / VISION ================= */

router.get('/mission/public', missionVisionController.getPublic);
router.get('/mission/admin', missionVisionController.getAdmin);
router.post(
    '/mission/save',
    handleUpload(uploadMission.single('banner_image')),
    missionVisionController.save
);

module.exports = router;