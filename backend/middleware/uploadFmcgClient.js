const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/fmcg/home/clients');

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

    // ✅ 1MB LIMIT
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB
    },

    // ✅ STRICT IMAGE VALIDATION
    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error('Only JPG, PNG, and WEBP images are allowed'),
                false
            );
        }

        cb(null, true);
    }
});

module.exports = upload;
