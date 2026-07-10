const db = require('../config/db');
const fs = require('fs');
const path = require('path');

function deleteFileIfExists(filePath) {
    if (!filePath) return;

    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

/* =========================
   PUBLIC
========================= */
exports.getPublicAbout = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM general_home_about
            WHERE is_active = 1
            LIMIT 1
        `);

        res.json(rows[0] || null);
    } catch (err) {
        console.error('PUBLIC ABOUT ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   ADMIN GET
========================= */
exports.getAdminAbout = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM general_home_about
            LIMIT 1
        `);

        res.json(rows[0] || null);
    } catch (err) {
        console.error('ADMIN ABOUT ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   SAVE / UPDATE
========================= */
exports.saveAbout = async (req, res) => {

    try {

        // 🔥 HANDLE MULTER ERRORS FIRST
        if (req.uploadError) {

            if (req.uploadError.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'File too large (Image max 2MB, Brochure max 15MB)'
                });
            }

            return res.status(400).json({
                message: req.uploadError.message || 'Upload error'
            });
        }


        const {
            title_en,
            title_ar,
            description_1_en,
            description_1_ar,
            description_2_en,
            description_2_ar,
            is_active
        } = req.body;

        const [rows] = await db.query(
            'SELECT * FROM general_home_about LIMIT 1'
        );

        const existing = rows[0] || null;

        let imagePath = existing ? existing.image : null;
        let brochureEnPath = existing ? existing.brochure_en : null;
        let brochureArPath = existing ? existing.brochure_ar : null;

        const files = req.files || {};

        /* =========================
           HANDLE IMAGE
        ========================= */
        if (files.image && files.image[0]) {
            deleteFileIfExists(imagePath);
            imagePath = `/uploads/general-about/${files.image[0].filename}`;
        }

        /* =========================
           HANDLE BROCHURE EN
        ========================= */
        if (files.brochure_en && files.brochure_en[0]) {
            deleteFileIfExists(brochureEnPath);
            brochureEnPath = `/uploads/general-about/${files.brochure_en[0].filename}`;
        }

        /* =========================
           HANDLE BROCHURE AR
        ========================= */
        if (files.brochure_ar && files.brochure_ar[0]) {
            deleteFileIfExists(brochureArPath);
            brochureArPath = `/uploads/general-about/${files.brochure_ar[0].filename}`;
        }

        /* =========================
           UPDATE OR INSERT
        ========================= */
        if (existing) {

            await db.query(`
                UPDATE general_home_about
                SET title_en = ?,
                    title_ar = ?,
                    description_1_en = ?,
                    description_1_ar = ?,
                    description_2_en = ?,
                    description_2_ar = ?,
                    image = ?,
                    brochure_en = ?,
                    brochure_ar = ?,
                    is_active = ?
                WHERE id = ?
            `, [
                title_en || existing.title_en,
                title_ar || existing.title_ar,
                description_1_en || existing.description_1_en,
                description_1_ar || existing.description_1_ar,
                description_2_en || existing.description_2_en,
                description_2_ar || existing.description_2_ar,
                imagePath,
                brochureEnPath,
                brochureArPath,
                is_active ? 1 : 0,
                existing.id
            ]);

        } else {

            await db.query(`
                INSERT INTO general_home_about
                (
                    title_en,
                    title_ar,
                    description_1_en,
                    description_1_ar,
                    description_2_en,
                    description_2_ar,
                    image,
                    brochure_en,
                    brochure_ar,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                title_en || '',
                title_ar || '',
                description_1_en || '',
                description_1_ar || '',
                description_2_en || '',
                description_2_ar || '',
                imagePath,
                brochureEnPath,
                brochureArPath,
                is_active ? 1 : 0
            ]);
        }

        res.json({ message: 'About section saved successfully' });

    } catch (err) {
        console.error('SAVE ABOUT ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
