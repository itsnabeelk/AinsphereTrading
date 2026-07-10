const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getPublicClients = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, name, logo, sort_order
            FROM general_home_clients
            WHERE is_active = 1
            ORDER BY sort_order ASC
        `);

        res.json(rows);
    } catch (err) {
        console.error('PUBLIC CLIENT ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAdminClients = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM general_home_clients
            ORDER BY sort_order ASC
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createClient = async (req, res) => {
    try {

        if (req.uploadError) {
            return res.status(400).json({ message: req.uploadError.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Logo required' });
        }

        const logoPath = `/uploads/general-clients/${req.file.filename}`;

        await db.query(`
            INSERT INTO general_home_clients (name, logo, sort_order)
            VALUES (?, ?, ?)
        `, [
            req.body.name || '',
            logoPath,
            req.body.sort_order || 0
        ]);

        res.json({ message: 'Client created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT logo FROM general_home_clients WHERE id = ?',
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const fullPath = path.join(__dirname, '..', existing[0].logo);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

        await db.query('DELETE FROM general_home_clients WHERE id = ?', [id]);

        res.json({ message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.toggleClient = async (req, res) => {
    try {
        await db.query(`
            UPDATE general_home_clients
            SET is_active = NOT is_active
            WHERE id = ?
        `, [req.params.id]);

        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateClient = async (req, res) => {
    try {

        if (req.uploadError) {
            return res.status(400).json({ message: req.uploadError.message });
        }

        const { id } = req.params;
        const { name } = req.body;

        const [existing] = await db.query(
            'SELECT * FROM general_home_clients WHERE id = ?',
            [id]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Client not found' });
        }

        let logoPath = existing[0].logo;

        // If new logo uploaded
        if (req.file) {

            // Delete old logo
            const oldFullPath = path.join(__dirname, '..', existing[0].logo);
            if (fs.existsSync(oldFullPath)) {
                fs.unlinkSync(oldFullPath);
            }

            logoPath = `/uploads/general-clients/${req.file.filename}`;
        }

        await db.query(`
            UPDATE general_home_clients
            SET name = ?, logo = ?
            WHERE id = ?
        `, [
            name || existing[0].name,
            logoPath,
            id
        ]);

        res.json({ message: 'Client updated successfully' });

    } catch (err) {
        console.error('UPDATE CLIENT ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
