const pool = require('../../config/db');
const fs = require('fs');
const path = require('path');

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_home_clients
             WHERE is_active=1
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch {
        res.status(500).json({ message: 'Failed to fetch clients' });
    }
};

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_home_clients
             ORDER BY sort_order ASC`
        );
        res.json(rows);
    } catch {
        res.status(500).json({ message: 'Failed to fetch clients (admin)' });
    }
};

exports.create = async (req, res) => {
    try {
        const { sort_order, is_active } = req.body;

        if (!req.file)
            return res.status(400).json({ message: 'Image is required' });

        const imagePath = `/uploads/uniform/home/clients/${req.file.filename}`;

        await pool.query(
            `INSERT INTO uniform_home_clients
            (image, sort_order, is_active)
            VALUES (?, ?, ?)`,
            [
                imagePath,
                sort_order || 0,
                is_active ?? 1
            ]
        );

        res.json({ message: 'Client created successfully' });

    } catch (error) {
        console.error('CREATE CLIENT ERROR:', error); // 👈 IMPORTANT
        res.status(500).json({ message: error.message || 'Failed to create client' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { sort_order, is_active } = req.body;

        const [existing] = await pool.query(
            `SELECT * FROM uniform_home_clients WHERE id=?`,
            [id]
        );

        if (!existing.length)
            return res.status(404).json({ message: 'Client not found' });

        let imagePath = null;

        if (req.file) {
            imagePath = `/uploads/uniform/home/clients/${req.file.filename}`;

            if (existing[0].image) {
                const oldPath = path.join(__dirname, '../../', existing[0].image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await pool.query(
            `UPDATE uniform_home_clients SET
                image=COALESCE(?, image),
                sort_order=?,
                is_active=?
             WHERE id=?`,
            [
                imagePath,
                sort_order || 0,
                is_active ?? 1,
                id
            ]
        );

        res.json({ message: 'Client updated successfully' });

    } catch {
        res.status(500).json({ message: 'Failed to update client' });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query(
            `SELECT * FROM uniform_home_clients WHERE id=?`,
            [id]
        );

        if (!existing.length)
            return res.status(404).json({ message: 'Client not found' });

        if (existing[0].image) {
            const oldPath = path.join(__dirname, '../../', existing[0].image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await pool.query(
            `DELETE FROM uniform_home_clients WHERE id=?`,
            [id]
        );

        res.json({ message: 'Client deleted successfully' });

    } catch {
        res.status(500).json({ message: 'Failed to delete client' });
    }
};