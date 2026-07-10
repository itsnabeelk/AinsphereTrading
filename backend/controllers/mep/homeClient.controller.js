const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM mep_home_clients 
             WHERE is_active = 1 
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error('MEP CLIENTS PUBLIC ERROR:', err);
        res.status(500).json({ message: "Error fetching clients" });
    }
};

/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM mep_home_clients 
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error('MEP CLIENTS ADMIN ERROR:', err);
        res.status(500).json({ message: "Error fetching clients (admin)" });
    }
};

/* ================= CREATE ================= */

exports.create = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "Client image is required" });
        }

        const image = `/uploads/mep/home/clients/${req.file.filename}`;
        const { sort_order = 0 } = req.body;

        await db.query(
            `INSERT INTO mep_home_clients (image, sort_order, is_active)
             VALUES (?, ?, 1)`,
            [image, sort_order]
        );

        res.json({ success: true });

    } catch (err) {
        console.error('MEP CLIENT CREATE ERROR:', err);
        res.status(500).json({ message: "Error creating client" });
    }
};

/* ================= UPDATE ================= */

exports.update = async (req, res) => {
    try {

        const { id } = req.params;
        const { sort_order = 0, is_active = 1 } = req.body;

        const [existing] = await db.query(
            "SELECT * FROM mep_home_clients WHERE id = ?",
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: "Client not found" });
        }

        let image = null;

        if (req.file) {

            image = `/uploads/mep/home/clients/${req.file.filename}`;

            // delete old image
            if (existing[0].image) {
                const oldPath = path.join(
                    __dirname,
                    '../../',
                    existing[0].image.replace(/^\/+/, '')
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        await db.query(
            `UPDATE mep_home_clients 
             SET image = COALESCE(?, image),
                 sort_order = ?,
                 is_active = ?
             WHERE id = ?`,
            [image, sort_order, is_active, id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error('MEP CLIENT UPDATE ERROR:', err);
        res.status(500).json({ message: "Error updating client" });
    }
};

/* ================= DELETE ================= */

exports.remove = async (req, res) => {
    try {

        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT * FROM mep_home_clients WHERE id = ?",
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (existing[0].image) {
            const filePath = path.join(
                __dirname,
                '../../',
                existing[0].image.replace(/^\/+/, '')
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.query(
            "DELETE FROM mep_home_clients WHERE id = ?",
            [id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error('MEP CLIENT DELETE ERROR:', err);
        res.status(500).json({ message: "Error deleting client" });
    }
};
