const pool = require('../../config/db');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_working_process
             WHERE is_active = 1
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch working process' });
    }
};

/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_working_process
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch working process (admin)' });
    }
};

/* ================= CREATE ================= */

exports.create = async (req, res) => {
    try {
        const {
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order,
            is_active
        } = req.body;

        await pool.query(
            `INSERT INTO uniform_working_process
            (title_en, title_ar, description_en, description_ar, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                sort_order || 0,
                is_active ?? 1
            ]
        );

        res.json({ message: 'Working process created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create working process' });
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
            sort_order,
            is_active
        } = req.body;

        const [existing] = await pool.query(
            `SELECT id FROM uniform_working_process WHERE id=?`,
            [id]
        );

        if (!existing.length)
            return res.status(404).json({ message: 'Working process not found' });

        await pool.query(
            `UPDATE uniform_working_process SET
                title_en=?,
                title_ar=?,
                description_en=?,
                description_ar=?,
                sort_order=?,
                is_active=?
             WHERE id=?`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                sort_order || 0,
                is_active ?? 1,
                id
            ]
        );

        res.json({ message: 'Working process updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update working process' });
    }
};

/* ================= DELETE ================= */

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query(
            `SELECT id FROM uniform_working_process WHERE id=?`,
            [id]
        );

        if (!existing.length)
            return res.status(404).json({ message: 'Working process not found' });

        await pool.query(
            `DELETE FROM uniform_working_process WHERE id=?`,
            [id]
        );

        res.json({ message: 'Working process deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to delete working process' });
    }
};