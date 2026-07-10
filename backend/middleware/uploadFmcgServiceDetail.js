const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads/fmcg-service-details');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.random().toString(36).substring(2);
        cb(null, 'detail-' + unique + path.extname(file.originalname));
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Only PNG, JPG, WEBP allowed'));
    }
});
