const db = require('../config/db');
const fs = require('fs');
const path = require('path');

/* ================= SLUG ================= */
function generateSlug(text) {
    return text
        ?.toLowerCase()
        .replace(/[^\w ]+/g, '') // only English
        .replace(/ +/g, '-');
}

/* ================= ADMIN ================= */
exports.getAllAdmin = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM uniform_services ORDER BY sort_order ASC"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= PUBLIC ================= */
exports.getAllPublic = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM uniform_services WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
            sort_order
        } = req.body;

        const slug = generateSlug(title_en);

        const image = req.file
            ? `/uploads/uniform-services/${req.file.filename}`
            : null;

        await db.query(
            `INSERT INTO uniform_services
            (title_en, title_ar, description_en, description_ar, slug, image, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                slug,
                image,
                sort_order || 0
            ]
        );

        res.json({ message: "Service created successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= UPDATE ================= */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT * FROM uniform_services WHERE id = ?",
            [id]
        );

        if (!existing.length)
            return res.status(404).json({ message: "Service not found" });

        let image = existing[0].image;

        if (req.file) {
            if (image) {
                const oldPath = path.join(process.cwd(), image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            image = `/uploads/uniform-services/${req.file.filename}`;
        }

        const slug = generateSlug(req.body.title_en);

        await db.query(
            `UPDATE uniform_services SET
                title_en = ?,
                title_ar = ?,
                description_en = ?,
                description_ar = ?,
                slug = ?,
                image = ?,
                sort_order = ?,
                is_active = ?
            WHERE id = ?`,
            [
                req.body.title_en,
                req.body.title_ar,
                req.body.description_en,
                req.body.description_ar,
                slug,
                image,
                req.body.sort_order || 0,
                req.body.is_active ?? 1,
                id
            ]
        );

        res.json({ message: "Service updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= DELETE ================= */
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT image FROM uniform_services WHERE id = ?",
            [id]
        );

        if (!rows.length)
            return res.status(404).json({ message: "Service not found" });

        const image = rows[0].image;

        if (image) {
            const filePath = path.join(process.cwd(), image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await db.query("DELETE FROM uniform_services WHERE id = ?", [id]);

        res.json({ message: "Service deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= TOGGLE ================= */
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        await db.query(
            "UPDATE uniform_services SET is_active = ? WHERE id = ?",
            [is_active, id]
        );

        res.json({ message: "Status updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};