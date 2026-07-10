const pool = require('../../config/db');
const fs = require('fs');
const path = require('path');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM fmcg_home_hero 
             WHERE is_active = 1 
             ORDER BY sort_order ASC`
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch hero slides' });
    }
};

/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM fmcg_home_hero 
             ORDER BY sort_order ASC`
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch hero slides (admin)' });
    }
};

/* ================= SAVE ================= */

exports.save = async (req, res) => {
    try {
        const {
            id,
            title_en,
            title_ar,
            description_en,
            description_ar,
            button_text_en,
            button_text_ar,
            button_link,
            sort_order,
            is_active
        } = req.body;

        let imagePath = null;

        if (req.file) {
            imagePath = `/uploads/fmcg/home/hero/${req.file.filename}`;
        }

        if (id) {
            // Update
            const [existing] = await pool.query(
                `SELECT image FROM fmcg_home_hero WHERE id = ?`,
                [id]
            );

            if (!existing.length) {
                return res.status(404).json({ message: 'Slide not found' });
            }

            // Delete old image if new uploaded
            if (imagePath && existing[0].image) {
                const oldPath = path.join(__dirname, '../../', existing[0].image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            await pool.query(
                `UPDATE fmcg_home_hero SET
                    title_en = ?,
                    title_ar = ?,
                    description_en = ?,
                    description_ar = ?,
                    button_text_en = ?,
                    button_text_ar = ?,
                    button_link = ?,
                    image = COALESCE(?, image),
                    sort_order = ?,
                    is_active = ?
                 WHERE id = ?`,
                [
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    button_text_en,
                    button_text_ar,
                    button_link,
                    imagePath,
                    sort_order || 0,
                    is_active ?? 1,
                    id
                ]
            );

            return res.json({ message: 'Hero slide updated successfully' });

        } else {
            // Create
            await pool.query(
                `INSERT INTO fmcg_home_hero (
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    button_text_en,
                    button_text_ar,
                    button_link,
                    image,
                    sort_order,
                    is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    button_text_en,
                    button_text_ar,
                    button_link,
                    imagePath,
                    sort_order || 0,
                    is_active ?? 1
                ]
            );

            return res.json({ message: 'Hero slide created successfully' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save hero slide' });
    }
};

/* ================= DELETE ================= */

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query(
            `SELECT image FROM fmcg_home_hero WHERE id = ?`,
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        if (existing[0].image) {
            const imagePath = path.join(__dirname, '../../', existing[0].image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pool.query(
            `DELETE FROM fmcg_home_hero WHERE id = ?`,
            [id]
        );

        res.json({ message: 'Hero slide deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete hero slide' });
    }
};
