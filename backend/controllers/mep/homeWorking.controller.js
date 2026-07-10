const db = require('../../config/db');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM mep_home_working_process 
       WHERE is_active = 1 
       ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching working process" });
    }
};

/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM mep_home_working_process 
       ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching working process (admin)" });
    }
};

/* ================= CREATE ================= */

exports.create = async (req, res) => {
    try {
        const {
            step_number,
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order
        } = req.body;

        await db.query(
            `INSERT INTO mep_home_working_process
       (step_number, title_en, title_ar, description_en, description_ar, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                step_number,
                title_en,
                title_ar,
                description_en,
                description_ar,
                sort_order || 0
            ]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error creating working step" });
    }
};

/* ================= UPDATE ================= */

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            step_number,
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order,
            is_active
        } = req.body;

        await db.query(
            `UPDATE mep_home_working_process
       SET step_number=?, title_en=?, title_ar=?, 
           description_en=?, description_ar=?, 
           sort_order=?, is_active=?
       WHERE id=?`,
            [
                step_number,
                title_en,
                title_ar,
                description_en,
                description_ar,
                sort_order,
                is_active,
                id
            ]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating working step" });
    }
};

/* ================= DELETE ================= */

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            "DELETE FROM mep_home_working_process WHERE id=?",
            [id]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting working step" });
    }
};
