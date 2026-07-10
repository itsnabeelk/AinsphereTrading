const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/fmcg/home/about');

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, uniqueName);
    }
});

/* ================= MULTER ================= */
const upload = multer({
    storage,

    // ✅ Global max (PDF support)
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB
    },

    fileFilter: (req, file, cb) => {

        /* ================= IMAGE ================= */
        if (file.fieldname === 'image') {

            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Image must be JPG, PNG, or WEBP'));
            }

            return cb(null, true);
        }

        /* ================= BROCHURE ================= */
        if (
            file.fieldname === 'brochure_en' ||
            file.fieldname === 'brochure_ar'
        ) {

            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Brochure must be a PDF file'));
            }

            return cb(null, true);
        }

        /* ================= INVALID ================= */
        return cb(new Error('Invalid file field'));
    }
});

module.exports = upload;