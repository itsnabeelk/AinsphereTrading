const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/mep/home/about');

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            '-' +
            file.originalname.replace(/\s+/g, '-');

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,

    // ✅ GLOBAL MAX = 15MB (needed for PDF)
    limits: {
        fileSize: 15 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        /* ================= IMAGE ================= */
        if (file.fieldname === 'image') {

            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp'
            ];

            if (!allowedTypes.includes(file.mimetype)) {
                return cb(
                    new Error('Image must be JPG, PNG, or WEBP'),
                    false
                );
            }

            return cb(null, true);
        }

        /* ================= PDF ================= */
        if (
            file.fieldname === 'brochure_en' ||
            file.fieldname === 'brochure_ar'
        ) {

            if (file.mimetype !== 'application/pdf') {
                return cb(
                    new Error('Brochure must be a PDF'),
                    false
                );
            }

            return cb(null, true);
        }

        /* ================= INVALID ================= */
        cb(new Error('Invalid file field'), false);
    }
});

module.exports = upload;