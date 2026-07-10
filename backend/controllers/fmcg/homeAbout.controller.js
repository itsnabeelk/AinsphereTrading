const pool = require('../../config/db');
const fs = require('fs');
const path = require('path');

/* ================= SAFE DELETE ================= */
const safeDelete = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error('File delete error:', err.message);
    }
};

/* ================= PUBLIC ================= */
exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM fmcg_home_about 
             WHERE is_active = 1 
             LIMIT 1`
        );

        res.json(rows[0] || null);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch about section' });
    }
};

/* ================= ADMIN ================= */
exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM fmcg_home_about LIMIT 1`
        );

        res.json(rows[0] || null);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch about (admin)' });
    }
};

/* ================= SAVE ================= */
exports.save = async (req, res) => {
    try {

        const {
            sub_title_en,
            sub_title_ar,
            title_en,
            title_ar,
            description_en,
            description_ar,
            funfact_1_number,
            funfact_1_suffix,
            funfact_1_text_en,
            funfact_1_text_ar,
            funfact_2_number,
            funfact_2_suffix,
            funfact_2_text_en,
            funfact_2_text_ar,
            is_active
        } = req.body;

        let imagePath = null;
        let brochureEnPath = null;
        let brochureArPath = null;

        let uploadedFiles = [];

        /* ================= FILE VALIDATION ================= */

        // IMAGE (2MB)
        if (req.files?.image?.[0]) {
            const img = req.files.image[0];
            uploadedFiles.push(img.path);

            if (img.size > 2 * 1024 * 1024) {
                safeDelete(img.path);
                return res.status(400).json({
                    message: 'Image must be less than 2MB'
                });
            }

            imagePath = `/uploads/fmcg/home/about/${img.filename}`;
        }

        // BROCHURE EN
        if (req.files?.brochure_en?.[0]) {
            const file = req.files.brochure_en[0];
            uploadedFiles.push(file.path);

            if (file.size > 15 * 1024 * 1024) {
                safeDelete(file.path);
                return res.status(400).json({
                    message: 'English brochure must be less than 15MB'
                });
            }

            brochureEnPath = `/uploads/fmcg/home/about/${file.filename}`;
        }

        // BROCHURE AR
        if (req.files?.brochure_ar?.[0]) {
            const file = req.files.brochure_ar[0];
            uploadedFiles.push(file.path);

            if (file.size > 15 * 1024 * 1024) {
                safeDelete(file.path);
                return res.status(400).json({
                    message: 'Arabic brochure must be less than 15MB'
                });
            }

            brochureArPath = `/uploads/fmcg/home/about/${file.filename}`;
        }

        /* ================= CHECK EXISTING ================= */

        const [existing] = await pool.query(
            `SELECT * FROM fmcg_home_about LIMIT 1`
        );

        if (existing.length > 0) {

            const existingData = existing[0];

            /* ================= DELETE OLD FILES ================= */

            if (imagePath && existingData.image) {
                safeDelete(path.join(__dirname, '../../', existingData.image));
            }

            if (brochureEnPath && existingData.brochure_en) {
                safeDelete(path.join(__dirname, '../../', existingData.brochure_en));
            }

            if (brochureArPath && existingData.brochure_ar) {
                safeDelete(path.join(__dirname, '../../', existingData.brochure_ar));
            }

            /* ================= UPDATE ================= */

            await pool.query(
                `UPDATE fmcg_home_about SET
                    sub_title_en = ?,
                    sub_title_ar = ?,
                    title_en = ?,
                    title_ar = ?,
                    description_en = ?,
                    description_ar = ?,
                    funfact_1_number = ?,
                    funfact_1_suffix = ?,
                    funfact_1_text_en = ?,
                    funfact_1_text_ar = ?,
                    funfact_2_number = ?,
                    funfact_2_suffix = ?,
                    funfact_2_text_en = ?,
                    funfact_2_text_ar = ?,
                    image = COALESCE(?, image),
                    brochure_en = COALESCE(?, brochure_en),
                    brochure_ar = COALESCE(?, brochure_ar),
                    is_active = ?
                 WHERE id = ?`,
                [
                    sub_title_en,
                    sub_title_ar,
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    funfact_1_number,
                    funfact_1_suffix,
                    funfact_1_text_en,
                    funfact_1_text_ar,
                    funfact_2_number,
                    funfact_2_suffix,
                    funfact_2_text_en,
                    funfact_2_text_ar,
                    imagePath,
                    brochureEnPath,
                    brochureArPath,
                    is_active ?? 1,
                    existingData.id
                ]
            );

            return res.json({ message: 'About section updated successfully' });

        } else {

            /* ================= INSERT ================= */

            await pool.query(
                `INSERT INTO fmcg_home_about (
                    sub_title_en,
                    sub_title_ar,
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    funfact_1_number,
                    funfact_1_suffix,
                    funfact_1_text_en,
                    funfact_1_text_ar,
                    funfact_2_number,
                    funfact_2_suffix,
                    funfact_2_text_en,
                    funfact_2_text_ar,
                    image,
                    brochure_en,
                    brochure_ar,
                    is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    sub_title_en,
                    sub_title_ar,
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    funfact_1_number,
                    funfact_1_suffix,
                    funfact_1_text_en,
                    funfact_1_text_ar,
                    funfact_2_number,
                    funfact_2_suffix,
                    funfact_2_text_en,
                    funfact_2_text_ar,
                    imagePath,
                    brochureEnPath,
                    brochureArPath,
                    is_active ?? 1
                ]
            );

            return res.json({ message: 'About section created successfully' });
        }

    } catch (error) {

        console.error(error);

        // 🔥 cleanup uploaded files on failure
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                safeDelete(file.path);
            });
        }

        res.status(500).json({ message: 'Failed to save about section' });
    }
};