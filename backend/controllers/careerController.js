const pool = require('../config/db');

/* ================= PUBLIC ================= */
exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM careers
            WHERE is_active = 1
            ORDER BY sort_order ASC, id DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch careers' });
    }
};

/* ================= ADMIN ================= */
exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM careers
            ORDER BY sort_order ASC, id DESC
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch careers' });
    }
};

/* ================= ADD ================= */
exports.add = async (req, res) => {
    try {
        const {
            title_en,
            title_ar,
            description_en,
            description_ar,
            job_type,
            location,
            salary,
            sort_order
        } = req.body;

        if (!title_en || !title_ar) {
            return res.status(400).json({ message: 'Title EN & AR required' });
        }

        await pool.query(`
            INSERT INTO careers
            (title_en, title_ar, description_en, description_ar, job_type, location, salary, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title_en,
            title_ar,
            description_en,
            description_ar,
            job_type,
            location,
            salary,
            sort_order || 0
        ]);

        res.json({ message: 'Job added successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add job' });
    }
};

/* ================= UPDATE ================= */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title_en,
            title_ar,
            description_en,
            description_ar,
            job_type,
            location,
            salary,
            sort_order
        } = req.body;

        await pool.query(`
            UPDATE careers SET
            title_en=?,
            title_ar=?,
            description_en=?,
            description_ar=?,
            job_type=?,
            location=?,
            salary=?,
            sort_order=?
            WHERE id=?
        `, [
            title_en,
            title_ar,
            description_en,
            description_ar,
            job_type,
            location,
            salary,
            sort_order || 0,
            id
        ]);

        res.json({ message: 'Job updated successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Failed to update job' });
    }
};

/* ================= DELETE ================= */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`DELETE FROM careers WHERE id=?`, [id]);

        res.json({ message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Failed to delete' });
    }
};

/* ================= TOGGLE ================= */
exports.toggle = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`
            UPDATE careers
            SET is_active = NOT is_active
            WHERE id = ?
        `, [id]);

        res.json({ message: 'Status updated' });

    } catch (err) {
        res.status(500).json({ message: 'Failed to update status' });
    }
};