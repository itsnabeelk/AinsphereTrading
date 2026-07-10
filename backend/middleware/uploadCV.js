const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/cv');

/* ================= ENSURE FOLDER ================= */
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9.\-_]/g, ''); // ✅ sanitize filename

        const uniqueName = Date.now() + '-' + safeName;
        cb(null, uniqueName);
    }
});

/* ================= FILE FILTER ================= */
const allowedMimeTypes = ['application/pdf'];

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
};

/* ================= MULTER INSTANCE ================= */
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter
});

module.exports = upload;