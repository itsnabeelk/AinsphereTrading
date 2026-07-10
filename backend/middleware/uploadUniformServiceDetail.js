const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/uniform-service-details');

/* Ensure folder exists */
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

/* Storage */
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

/* File Filter */
const fileFilter = (req, file, cb) => {

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
    }

    // Optional: restrict field names
    if (file.fieldname !== 'hero_image' && file.fieldname !== 'image') {
        return cb(new Error('Invalid file field'));
    }

    cb(null, true);
};

/* Upload */
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter
});

module.exports = upload;