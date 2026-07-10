const db = require('../config/db');
const fs = require('fs');
const path = require('path');

/* =========================================================
   HELPERS
========================================================= */

function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function deleteFile(filePath) {
    if (!filePath) return;

    const fullPath = path.join(__dirname, '..', filePath);

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

/* =========================================================
   PUBLIC LIST PAGE
========================================================= */

exports.getListPage = async (req, res) => {
    try {

        const [pageRows] = await db.query(
            `SELECT * FROM general_services_page 
             WHERE is_active = 1 LIMIT 1`
        );

        const [services] = await db.query(
            `SELECT id, 
            title_en, 
            title_ar, 
            description_en, 
            description_ar, 
            slug, 
            image,
            sort_order,
            is_active
     FROM general_services
     WHERE is_active = 1
     ORDER BY sort_order ASC`
        );


        res.json({
            page: pageRows[0] || null,
            services
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   PUBLIC DETAIL BY SLUG
========================================================= */

exports.getBySlug = async (req, res) => {
    try {

        const { slug } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM general_services
             WHERE slug = ? AND is_active = 1`,
            [slug]
        );

        if (!rows.length)
            return res.status(404).json({ message: 'Service not found' });

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN LIST
========================================================= */

exports.getAdminList = async (req, res) => {
    try {

        const [rows] = await db.query(
            `SELECT * FROM general_services
             ORDER BY sort_order ASC`
        );

        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN CREATE
========================================================= */

exports.create = async (req, res) => {
    try {

        const {
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order
        } = req.body;

        if (!title_en)
            return res.status(400).json({ message: 'Title EN is required' });

        const slug = generateSlug(title_en);

        // check duplicate slug
        const [existing] = await db.query(
            `SELECT id FROM general_services WHERE slug = ?`,
            [slug]
        );

        if (existing.length)
            return res.status(400).json({ message: 'Service with same title already exists' });

        const image = req.file
            ? `/uploads/services/${req.file.filename}`
            : null;

        await db.query(
            `INSERT INTO general_services
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

        res.json({ message: 'Service created successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN UPDATE
========================================================= */

exports.update = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order
        } = req.body;

        const [rows] = await db.query(
            `SELECT * FROM general_services WHERE id = ?`,
            [id]
        );

        if (!rows.length)
            return res.status(404).json({ message: 'Service not found' });

        const service = rows[0];

        let slug = service.slug;

        if (title_en && title_en !== service.title_en) {
            slug = generateSlug(title_en);

            const [duplicate] = await db.query(
                `SELECT id FROM general_services WHERE slug = ? AND id != ?`,
                [slug, id]
            );

            if (duplicate.length)
                return res.status(400).json({ message: 'Slug already exists' });
        }

        let image = service.image;

        if (req.file) {
            deleteFile(service.image);
            image = `/uploads/services/${req.file.filename}`;
        }

        await db.query(
            `UPDATE general_services SET
                title_en = ?,
                title_ar = ?,
                description_en = ?,
                description_ar = ?,
                slug = ?,
                image = ?,
                sort_order = ?
             WHERE id = ?`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                slug,
                image,
                sort_order || 0,
                id
            ]
        );

        res.json({ message: 'Service updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN DELETE
========================================================= */

exports.delete = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT image FROM general_services WHERE id = ?`,
            [id]
        );

        if (!rows.length)
            return res.status(404).json({ message: 'Service not found' });

        deleteFile(rows[0].image);

        await db.query(
            `DELETE FROM general_services WHERE id = ?`,
            [id]
        );

        res.json({ message: 'Service deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN TOGGLE
========================================================= */

exports.toggle = async (req, res) => {
    try {

        const { id } = req.params;

        await db.query(
            `UPDATE general_services
             SET is_active = IF(is_active = 1, 0, 1)
             WHERE id = ?`,
            [id]
        );

        res.json({ message: 'Status updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
