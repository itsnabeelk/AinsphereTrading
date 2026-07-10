const db = require('../config/db');

/* ================= PUBLIC ================= */
exports.getPublic = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM general_working_process
             WHERE is_active = 1
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* ================= ADMIN ================= */
exports.getAdmin = async (req, res) => {
    const [rows] = await db.query(
        `SELECT * FROM general_working_process
         ORDER BY sort_order ASC`
    );
    res.json(rows);
};

exports.create = async (req, res) => {
    const { title_en, title_ar, description_en, description_ar, sort_order } = req.body;

    await db.query(
        `INSERT INTO general_working_process
        (title_en, title_ar, description_en, description_ar, sort_order)
        VALUES (?, ?, ?, ?, ?)`,
        [title_en, title_ar, description_en, description_ar, sort_order || 0]
    );

    res.json({ message: 'Created successfully' });
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { title_en, title_ar, description_en, description_ar, sort_order } = req.body;

    await db.query(
        `UPDATE general_working_process
         SET title_en=?, title_ar=?, description_en=?, description_ar=?, sort_order=?
         WHERE id=?`,
        [title_en, title_ar, description_en, description_ar, sort_order, id]
    );

    res.json({ message: 'Updated successfully' });
};

exports.remove = async (req, res) => {
    await db.query(
        `DELETE FROM general_working_process WHERE id=?`,
        [req.params.id]
    );
    res.json({ message: 'Deleted successfully' });
};

exports.toggle = async (req, res) => {
    await db.query(
        `UPDATE general_working_process
         SET is_active = NOT is_active
         WHERE id=?`,
        [req.params.id]
    );
    res.json({ message: 'Toggled successfully' });
};
