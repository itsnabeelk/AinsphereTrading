const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM mep_home_about WHERE is_active = 1 LIMIT 1"
        );
        res.json(rows[0] || null);
    } catch (err) {
        console.error('MEP ABOUT PUBLIC ERROR:', err);
        res.status(500).json({ message: "Error fetching about section" });
    }
};

/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM mep_home_about LIMIT 1"
        );
        res.json(rows[0] || null);
    } catch (err) {
        console.error('MEP ABOUT ADMIN ERROR:', err);
        res.status(500).json({ message: "Error fetching about (admin)" });
    }
};

/* ================= SAVE ================= */

exports.save = async (req, res) => {
    try {

        const {
            sub_title_en = '',
            sub_title_ar = '',
            title_en = '',
            title_ar = '',
            description_en = '',
            description_ar = '',
            is_active = 1
        } = req.body;

        let imagePath = null;
        let brochureEnPath = null;
        let brochureArPath = null;

        /* ================= FILE HANDLING ================= */

        if (req.files?.image?.[0]) {
            const img = req.files.image[0];
            imagePath = `/uploads/mep/home/about/${img.filename}`;
        }

        if (req.files?.brochure_en?.[0]) {
            const file = req.files.brochure_en[0];
            brochureEnPath = `/uploads/mep/home/about/${file.filename}`;
        }

        if (req.files?.brochure_ar?.[0]) {
            const file = req.files.brochure_ar[0];
            brochureArPath = `/uploads/mep/home/about/${file.filename}`;
        }

        const [existing] = await db.query(
            "SELECT * FROM mep_home_about LIMIT 1"
        );

        if (existing.length > 0) {

            const existingData = existing[0];

            /* ================= DELETE OLD FILES ================= */

            const safeDelete = (filePath) => {
                if (!filePath) return;

                const fullPath = path.join(
                    __dirname,
                    '../../',
                    filePath.replace(/^\/+/, '')
                );

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            };

            if (imagePath && existingData.image) {
                safeDelete(existingData.image);
            }

            if (brochureEnPath && existingData.brochure_en) {
                safeDelete(existingData.brochure_en);
            }

            if (brochureArPath && existingData.brochure_ar) {
                safeDelete(existingData.brochure_ar);
            }

            /* ================= UPDATE ================= */

            await db.query(
                `UPDATE mep_home_about SET
                    sub_title_en = ?,
                    sub_title_ar = ?,
                    title_en = ?,
                    title_ar = ?,
                    description_en = ?,
                    description_ar = ?,
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
                    imagePath,
                    brochureEnPath,
                    brochureArPath,
                    is_active,
                    existingData.id
                ]
            );

            return res.json({ message: "About section updated successfully" });

        } else {

            /* ================= INSERT ================= */

            await db.query(
                `INSERT INTO mep_home_about
                (
                    sub_title_en,
                    sub_title_ar,
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    image,
                    brochure_en,
                    brochure_ar,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    sub_title_en,
                    sub_title_ar,
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    imagePath || '',
                    brochureEnPath || '',
                    brochureArPath || '',
                    is_active
                ]
            );

            return res.json({ message: "About section created successfully" });
        }

    } catch (err) {
        console.error("MEP ABOUT SAVE ERROR:", err);
        return res.status(500).json({ message: "Failed to save about section" });
    }
};