const pool = require('../../config/db');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM fmcg_home_marquee
             WHERE is_active = 1
             ORDER BY sort_order ASC`
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch marquee items' });
    }
};

/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM fmcg_home_marquee
             ORDER BY sort_order ASC`
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch marquee items (admin)' });
    }
};

/* ================= CREATE ================= */

exports.create = async (req, res) => {
    try {
        const { title_en, title_ar, sort_order, is_active } = req.body;

        await pool.query(
            `INSERT INTO fmcg_home_marquee
            (title_en, title_ar, sort_order, is_active)
            VALUES (?, ?, ?, ?)`,
            [
                title_en,
                title_ar,
                sort_order || 0,
                is_active ?? 1
            ]
        );

        res.json({ message: 'Marquee item created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create marquee item' });
    }
};

/* ================= UPDATE ================= */

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title_en, title_ar, sort_order, is_active } = req.body;

        const [existing] = await pool.query(
            `SELECT id FROM fmcg_home_marquee WHERE id = ?`,
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Marquee item not found' });
        }

        await pool.query(
            `UPDATE fmcg_home_marquee SET
                title_en = ?,
                title_ar = ?,
                sort_order = ?,
                is_active = ?
             WHERE id = ?`,
            [
                title_en,
                title_ar,
                sort_order || 0,
                is_active ?? 1,
                id
            ]
        );

        res.json({ message: 'Marquee item updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update marquee item' });
    }
};

/* ================= DELETE ================= */

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query(
            `SELECT id FROM fmcg_home_marquee WHERE id = ?`,
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Marquee item not found' });
        }

        await pool.query(
            `DELETE FROM fmcg_home_marquee WHERE id = ?`,
            [id]
        );

        res.json({ message: 'Marquee item deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete marquee item' });
    }
};
