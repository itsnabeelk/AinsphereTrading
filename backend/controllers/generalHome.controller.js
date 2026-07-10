const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATH = path.join(__dirname, '../uploads/general-hero');

/* =========================
   PUBLIC GET ACTIVE HERO
========================= */
exports.getPublicHero = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, title_en, title_ar, image, sort_order
            FROM general_home_hero
            WHERE is_active = 1
            ORDER BY sort_order ASC
        `);

        res.json(rows);
    } catch (err) {
        console.error('PUBLIC HERO ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   ADMIN GET ALL
========================= */
exports.getAdminHero = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM general_home_hero
            ORDER BY sort_order ASC
        `);

        res.json(rows);
    } catch (err) {
        console.error('ADMIN HERO ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   CREATE HERO
========================= */
exports.createHero = async (req, res) => {
    try {

        // 🔥 HANDLE MULTER ERRORS FIRST
        if (req.uploadError) {

            if (req.uploadError.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'Image must be less than 5MB'
                });
            }

            return res.status(400).json({
                message: req.uploadError.message || 'Upload error'
            });
        }

        const { title_en, title_ar, sort_order } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image required' });
        }

        const imagePath = `/uploads/general-hero/${req.file.filename}`;

        await db.query(`
            INSERT INTO general_home_hero 
            (title_en, title_ar, image, sort_order)
            VALUES (?, ?, ?, ?)
        `, [
            title_en || '',
            title_ar || '',
            imagePath,
            sort_order || 0
        ]);

        res.json({ message: 'Hero created successfully' });

    } catch (err) {
        console.error('CREATE HERO ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   UPDATE HERO
========================= */
exports.updateHero = async (req, res) => {

    try {

        if (req.uploadError) {

            if (req.uploadError.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'Image must be less than 5MB'
                });
            }

            return res.status(400).json({
                message: req.uploadError.message || 'Upload error'
            });
        }
        const { id } = req.params;
        const { title_en, title_ar, sort_order } = req.body;

        const [existing] = await db.query(
            'SELECT image FROM general_home_hero WHERE id = ?',
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        let imagePath = existing[0].image;

        if (req.file) {
            // delete old image
            if (imagePath) {
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

            imagePath = `/uploads/general-hero/${req.file.filename}`;
        }

        await db.query(`
            UPDATE general_home_hero
            SET title_en = ?, 
                title_ar = ?, 
                image = ?, 
                sort_order = ?
            WHERE id = ?
        `, [
            title_en || '',
            title_ar || '',
            imagePath,
            sort_order || 0,
            id
        ]);

        res.json({ message: 'Hero updated successfully' });

    } catch (err) {
        console.error('UPDATE HERO ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   DELETE HERO
========================= */
exports.deleteHero = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT image FROM general_home_hero WHERE id = ?',
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        const imagePath = existing[0].image;

        if (imagePath) {
            const fullPath = path.join(__dirname, '..', imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        await db.query(
            'DELETE FROM general_home_hero WHERE id = ?',
            [id]
        );

        res.json({ message: 'Hero deleted successfully' });

    } catch (err) {
        console.error('DELETE HERO ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* =========================
   TOGGLE ACTIVE
========================= */
exports.toggleHero = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`
            UPDATE general_home_hero
            SET is_active = NOT is_active
            WHERE id = ?
        `, [id]);

        res.json({ message: 'Hero status updated' });

    } catch (err) {
        console.error('TOGGLE HERO ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
