const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/uniform/home/about');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + safeName);
    }
});

// Global limit must allow PDFs (15MB). Image 2MB will be enforced in controller.
const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB for all files
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            const allowedImages = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedImages.includes(file.mimetype)) {
                return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
            }
            return cb(null, true);
        }

        if (file.fieldname === 'brochure_en' || file.fieldname === 'brochure_ar') {
            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Only PDF files are allowed for brochures'));
            }
            return cb(null, true);
        }

        cb(new Error('Invalid file field'));
    }
});

module.exports = upload;