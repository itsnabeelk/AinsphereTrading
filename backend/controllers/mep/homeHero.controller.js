const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

/* ================= PUBLIC (ALL ACTIVE SLIDES) ================= */
exports.getPublic = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM mep_home_hero WHERE is_active = 1 ORDER BY sort_order ASC, id DESC"
        );
        res.json(rows || []);
    } catch (err) {
        console.error('MEP HERO PUBLIC ERROR:', err);
        res.status(500).json({ message: "Error fetching hero slides" });
    }
};

/* ================= ADMIN (ALL SLIDES) ================= */
exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM mep_home_hero ORDER BY sort_order ASC, id DESC"
        );
        res.json(rows || []);
    } catch (err) {
        console.error('MEP HERO ADMIN ERROR:', err);
        res.status(500).json({ message: "Error fetching hero slides (admin)" });
    }
};

/* ================= SAVE (INSERT OR UPDATE) ================= */
exports.save = async (req, res) => {
    try {
        const {
            id = null,
            title_en = '',
            title_ar = '',
            description_en = '',
            description_ar = '',
            sort_order = 0,
            is_active = 1
        } = req.body;

        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/mep/home/hero/${req.file.filename}`;
        }

        // ✅ UPDATE slide
        if (id) {
            const [existing] = await db.query(
                "SELECT * FROM mep_home_hero WHERE id = ? LIMIT 1",
                [id]
            );

            if (!existing.length) {
                return res.status(404).json({ message: 'Slide not found' });
            }

            const old = existing[0];

            // delete old file if new uploaded
            if (imagePath && old.image) {
                const oldPath = path.join(__dirname, '../../', old.image.replace(/^\/+/, ''));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            await db.query(
                `UPDATE mep_home_hero SET
          title_en = ?,
          title_ar = ?,
          description_en = ?,
          description_ar = ?,
          sort_order = ?,
          is_active = ?,
          image = COALESCE(?, image)
        WHERE id = ?`,
                [
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    Number(sort_order) || 0,
                    Number(is_active) ? 1 : 0,
                    imagePath,
                    id
                ]
            );

            return res.json({ message: 'Hero slide updated successfully' });
        }

        // ✅ INSERT slide
        await db.query(
            `INSERT INTO mep_home_hero
        (title_en, title_ar, description_en, description_ar, image, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                imagePath || '',
                Number(sort_order) || 0,
                Number(is_active) ? 1 : 0
            ]
        );

        return res.json({ message: 'Hero slide created successfully' });

    } catch (err) {
        console.error("MEP HERO SAVE ERROR:", err);
        res.status(500).json({ message: "Failed to save hero slide" });
    }
};

/* ================= DELETE (REMOVE SLIDE) ================= */
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM mep_home_hero WHERE id = ? LIMIT 1",
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        const slide = rows[0];

        if (slide.image) {
            const filePath = path.join(__dirname, '../../', slide.image.replace(/^\/+/, ''));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await db.query("DELETE FROM mep_home_hero WHERE id = ?", [id]);

        res.json({ message: 'Hero slide deleted successfully' });

    } catch (err) {
        console.error("MEP HERO DELETE ERROR:", err);
        res.status(500).json({ message: "Failed to delete hero slide" });
    }
};


exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        await db.query(
            "UPDATE mep_home_hero SET is_active = ? WHERE id = ?",
            [Number(is_active) ? 1 : 0, id]
        );

        res.json({ message: "Status updated successfully" });

    } catch (err) {
        console.error("MEP HERO STATUS ERROR:", err);
        res.status(500).json({ message: "Failed to update status" });
    }
};