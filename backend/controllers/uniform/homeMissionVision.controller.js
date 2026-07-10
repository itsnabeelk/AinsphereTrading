const pool = require('../../config/db');

/* ================= PUBLIC ================= */

exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_home_mission_vision
             WHERE is_active = 1
             LIMIT 1`
        );

        const data = rows[0];

        if (!data) return res.json(null);

        // 🔥 MAP DATA FOR FRONTEND
        const response = {
            ...data,

            // map desc → text (frontend expects this)
            vision_text_en: data.vision_desc_en,
            vision_text_ar: data.vision_desc_ar,
            mission_text_en: data.mission_desc_en,
            mission_text_ar: data.mission_desc_ar,

            // fallback (avoid UI breaking)
            title_en: data.title_en || '',
            title_ar: data.title_ar || '',
            sub_title_en: data.sub_title_en || '',
            sub_title_ar: data.sub_title_ar || '',
            banner_image: data.banner_image || '',
            contact_title_en: data.contact_title_en || '',
            contact_title_ar: data.contact_title_ar || '',
            contact_button_en: data.contact_button_en || '',
            contact_button_ar: data.contact_button_ar || ''
        };

        res.json(response);

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch mission/vision' });
    }
};
/* ================= ADMIN ================= */

exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_home_mission_vision LIMIT 1`
        );
        res.json(rows[0] || null);
    } catch {
        res.status(500).json({ message: 'Failed to fetch mission/vision (admin)' });
    }
};

/* ================= SAVE ================= */

exports.save = async (req, res) => {
    try {

        const {
            title_en,
            title_ar,
            sub_title_en,
            sub_title_ar,
            contact_title_en,
            contact_title_ar,
            contact_button_en,
            contact_button_ar,

            vision_title_en,
            vision_title_ar,
            vision_desc_en,
            vision_desc_ar,

            mission_title_en,
            mission_title_ar,
            mission_desc_en,
            mission_desc_ar,

            is_active
        } = req.body;

        // IMAGE (from multer)
        const banner_image = req.file
            ? `/uploads/uniform/home/mission/${req.file.filename}`
            : null;

        const [existing] = await pool.query(
            `SELECT * FROM uniform_home_mission_vision LIMIT 1`
        );

        if (existing.length) {

            const old = existing[0];

            await pool.query(
                `UPDATE uniform_home_mission_vision SET
                    title_en=?,
                    title_ar=?,
                    sub_title_en=?,
                    sub_title_ar=?,
                    contact_title_en=?,
                    contact_title_ar=?,
                    contact_button_en=?,
                    contact_button_ar=?,

                    vision_title_en=?,
                    vision_title_ar=?,
                    vision_desc_en=?,
                    vision_desc_ar=?,

                    mission_title_en=?,
                    mission_title_ar=?,
                    mission_desc_en=?,
                    mission_desc_ar=?,

                    banner_image=?,
                    is_active=?
                 WHERE id=?`,
                [
                    title_en,
                    title_ar,
                    sub_title_en,
                    sub_title_ar,
                    contact_title_en,
                    contact_title_ar,
                    contact_button_en,
                    contact_button_ar,

                    vision_title_en,
                    vision_title_ar,
                    vision_desc_en,
                    vision_desc_ar,

                    mission_title_en,
                    mission_title_ar,
                    mission_desc_en,
                    mission_desc_ar,

                    banner_image || old.banner_image,
                    is_active ?? 1,
                    old.id
                ]
            );

            return res.json({ message: 'Updated successfully' });

        } else {

            await pool.query(
                `INSERT INTO uniform_home_mission_vision
                (
                    title_en, title_ar,
                    sub_title_en, sub_title_ar,
                    contact_title_en, contact_title_ar,
                    contact_button_en, contact_button_ar,

                    vision_title_en, vision_title_ar,
                    vision_desc_en, vision_desc_ar,

                    mission_title_en, mission_title_ar,
                    mission_desc_en, mission_desc_ar,

                    banner_image, is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title_en,
                    title_ar,
                    sub_title_en,
                    sub_title_ar,
                    contact_title_en,
                    contact_title_ar,
                    contact_button_en,
                    contact_button_ar,

                    vision_title_en,
                    vision_title_ar,
                    vision_desc_en,
                    vision_desc_ar,

                    mission_title_en,
                    mission_title_ar,
                    mission_desc_en,
                    mission_desc_ar,

                    banner_image,
                    is_active ?? 1
                ]
            );

            return res.json({ message: 'Created successfully' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save mission/vision' });
    }
};