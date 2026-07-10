const db = require('../config/db');

// GET footer settings for public/admin
exports.getFooterSettings = async (req, res) => {
    try {
        const { type } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM footer_settings WHERE footer_type = ?',
            [type]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Footer settings not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('GET FOOTER SETTINGS ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE footer settings
exports.updateFooterSettings = async (req, res) => {
    try {
        const { type } = req.params;
        const { facebook_url, instagram_url, twitter_url, linkedin_url, email, phone, location_en, location_ar } = req.body;

        const [existing] = await db.query(
            'SELECT footer_type FROM footer_settings WHERE footer_type = ?',
            [type]
        );

        if (!existing.length) {
            return res.status(404).json({ message: 'Footer settings not found' });
        }

        await db.query(`
            UPDATE footer_settings
            SET facebook_url = ?,
                instagram_url = ?,
                twitter_url = ?,
                linkedin_url = ?,
                email = ?,
                phone = ?,
                location_en = ?,
                location_ar = ?
            WHERE footer_type = ?
        `, [
            facebook_url || '',
            instagram_url || '',
            twitter_url || '',
            linkedin_url || '',
            email || '',
            phone || '',
            location_en || '',
            location_ar || '',
            type
        ]);

        res.json({ message: 'Footer settings updated successfully' });
    } catch (err) {
        console.error('UPDATE FOOTER SETTINGS ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
