const express = require('express');
const router = express.Router();

const uploadHero = require('../middleware/uploadMepHero');
const uploadAbout = require('../middleware/uploadMepAbout');
const uploadClient = require('../middleware/uploadMepClient');

const heroController = require('../controllers/mep/homeHero.controller');
const aboutController = require('../controllers/mep/homeAbout.controller');
const workingController = require('../controllers/mep/homeWorking.controller');
const clientController = require('../controllers/mep/homeClient.controller');

/* ================= HERO ================= */

router.get('/hero/public', heroController.getPublic);
router.get('/hero/admin', heroController.getAdmin);
router.post('/hero/save', uploadHero.single('image'), heroController.save);
router.delete('/hero/:id', heroController.remove);
router.put('/hero/status/:id', heroController.toggleStatus);
/* ================= ABOUT ================= */

router.get('/about/public', aboutController.getPublic);
router.get('/about/admin', aboutController.getAdmin);
router.post(
    '/about/save',
    uploadAbout.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brochure_en', maxCount: 1 },
        { name: 'brochure_ar', maxCount: 1 }
    ]),
    aboutController.save
);

/* ================= WORKING PROCESS ================= */

router.get('/working/public', workingController.getPublic);
router.get('/working/admin', workingController.getAdmin);
router.post('/working/create', workingController.create);
router.put('/working/update/:id', workingController.update);
router.delete('/working/:id', workingController.remove);

/* ================= CLIENT ================= */

router.get('/clients/public', clientController.getPublic);
router.get('/clients/admin', clientController.getAdmin);
router.post('/clients/create', uploadClient.single('image'), clientController.create);
router.put('/clients/update/:id', uploadClient.single('image'), clientController.update);
router.delete('/clients/:id', clientController.remove);

module.exports = router;
