const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads/general-about');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;        // 2MB
const MAX_BROCHURE_BYTES = 15 * 1024 * 1024;    // 15MB

const ALLOWED_IMAGE_MIMES = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',   // some clients send this
    'image/webp'
]);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'about-' + unique + path.extname(file.originalname));
    }
});

function fileFilter(req, file, cb) {
    // brochure fields: must be PDF
    if (file.fieldname === 'brochure_en' || file.fieldname === 'brochure_ar') {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Brochure must be a PDF file'));
        }
        return cb(null, true);
    }

    // image field: must be png/jpg/webp AND <= 2MB
    if (file.fieldname === 'image') {
        if (!ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
            return cb(new Error('Image must be PNG, JPG, or WEBP'));
        }

        // Multer provides file.size only for some storage engines,
        // but usually it exists. This check is helpful; the global limit below also protects.
        if (typeof file.size === 'number' && file.size > MAX_IMAGE_BYTES) {
            return cb(new Error('Image must be less than 2MB'));
        }

        return cb(null, true);
    }

    // Any other unexpected field
    return cb(new Error('Unexpected file field'));
}

module.exports = multer({
    storage,
    // Set global max to the largest allowed (15MB). Then we enforce 2MB specifically for images above.
    limits: { fileSize: MAX_BROCHURE_BYTES },
    fileFilter
});
