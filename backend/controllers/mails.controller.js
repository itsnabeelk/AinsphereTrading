const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// GET all contact submissions
exports.getContacts = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM contact_submissions ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('GET CONTACTS ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE contact submission
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM contact_submissions WHERE id = ?', [id]);
        res.json({ message: 'Contact message deleted successfully' });
    } catch (err) {
        console.error('DELETE CONTACT ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET all career applications
exports.getCareers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM career_applications ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('GET CAREERS ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE career application (and its CV file)
exports.deleteCareer = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch CV path first to delete the file
        const [existing] = await db.query(
            'SELECT cv_path FROM career_applications WHERE id = ?',
            [id]
        );

        if (existing.length > 0 && existing[0].cv_path) {
            const cvFilepath = path.join(__dirname, '..', existing[0].cv_path);
            try {
                if (fs.existsSync(cvFilepath)) {
                    fs.unlinkSync(cvFilepath);
                }
            } catch (fileErr) {
                console.error('FAILED TO DELETE CV FILE:', fileErr.message);
            }
        }

        await db.query('DELETE FROM career_applications WHERE id = ?', [id]);
        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        console.error('DELETE CAREER ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
