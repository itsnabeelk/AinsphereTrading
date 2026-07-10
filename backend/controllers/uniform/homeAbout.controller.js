const pool = require('../../config/db');
const fs = require('fs');
const path = require('path');

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;  // 2MB
const MAX_PDF_SIZE = 15 * 1024 * 1024;   // 15MB

function safeUnlink(relativeUrlPath) {
    if (!relativeUrlPath) return;

    const diskPath = path.join(
        __dirname,
        '../../',
        relativeUrlPath.replace(/^\/+/, '')
    );

    if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
    }
}

/* PUBLIC */
exports.getPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM uniform_home_about WHERE is_active=1 LIMIT 1`
        );
        res.json(rows[0] || null);
    } catch (err) {
        console.error('UNIFORM ABOUT PUBLIC ERROR:', err);
        res.status(500).json({ message: 'Failed to fetch about section' });
    }
};

/* ADMIN */
exports.getAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM uniform_home_about LIMIT 1`);
        res.json(rows[0] || null);
    } catch (err) {
        console.error('UNIFORM ABOUT ADMIN ERROR:', err);
        res.status(500).json({ message: 'Failed to fetch about (admin)' });
    }
};

/* SAVE */
exports.save = async (req, res) => {
    try {
        const {
            title_en = '',
            title_ar = '',
            description_en = '',
            description_ar = '',
            is_active
        } = req.body;

        // multer.fields => req.files.{image, brochure_en, brochure_ar} arrays
        const imageFile = req.files?.image?.[0] || null;
        const brochureEnFile = req.files?.brochure_en?.[0] || null;
        const brochureArFile = req.files?.brochure_ar?.[0] || null;

        // Extra size safety (because multer limit will be 15MB for all files)
        if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
            safeUnlink(`/uploads/uniform/home/about/${imageFile.filename}`);
            return res.status(400).json({ message: 'Image must be less than 2MB' });
        }

        if (brochureEnFile && brochureEnFile.size > MAX_PDF_SIZE) {
            safeUnlink(`/uploads/uniform/home/about/${brochureEnFile.filename}`);
            return res.status(400).json({ message: 'English brochure must be less than 15MB' });
        }

        if (brochureArFile && brochureArFile.size > MAX_PDF_SIZE) {
            safeUnlink(`/uploads/uniform/home/about/${brochureArFile.filename}`);
            return res.status(400).json({ message: 'Arabic brochure must be less than 15MB' });
        }

        const imagePath = imageFile ? `/uploads/uniform/home/about/${imageFile.filename}` : null;
        const brochureEnPath = brochureEnFile ? `/uploads/uniform/home/about/${brochureEnFile.filename}` : null;
        const brochureArPath = brochureArFile ? `/uploads/uniform/home/about/${brochureArFile.filename}` : null;

        const [existing] = await pool.query(`SELECT * FROM uniform_home_about LIMIT 1`);

        if (existing.length) {
            const old = existing[0];

            // delete old files if new ones uploaded
            if (imagePath && old.image) safeUnlink(old.image);
            if (brochureEnPath && old.brochure_en) safeUnlink(old.brochure_en);
            if (brochureArPath && old.brochure_ar) safeUnlink(old.brochure_ar);

            await pool.query(
                `UPDATE uniform_home_about SET
          title_en=?,
          title_ar=?,
          description_en=?,
          description_ar=?,
          image=COALESCE(?, image),
          brochure_en=COALESCE(?, brochure_en),
          brochure_ar=COALESCE(?, brochure_ar),
          is_active=?
         WHERE id=?`,
                [
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    imagePath,
                    brochureEnPath,
                    brochureArPath,
                    is_active ?? 1,
                    old.id
                ]
            );

            return res.json({ message: 'About updated successfully' });
        } else {
            await pool.query(
                `INSERT INTO uniform_home_about
          (title_en, title_ar, description_en, description_ar, image, brochure_en, brochure_ar, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title_en,
                    title_ar,
                    description_en,
                    description_ar,
                    imagePath || '',
                    brochureEnPath || '',
                    brochureArPath || '',
                    is_active ?? 1
                ]
            );

            return res.json({ message: 'About created successfully' });
        }
    } catch (err) {
        console.error('UNIFORM ABOUT SAVE ERROR:', err);
        res.status(500).json({ message: 'Failed to save about section' });
    }
};