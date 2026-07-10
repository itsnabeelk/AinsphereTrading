const db = require('../config/db');
const fs = require('fs');
const path = require('path');

/* =========================================================
   HELPER
========================================================= */

function deleteFile(filePath) {
    if (!filePath) return;

    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

/* =========================================================
   PUBLIC - FULL DETAIL BY SLUG
========================================================= */

exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [serviceRows] = await db.query(
            `SELECT * FROM fmcg_services
             WHERE slug = ? AND is_active = 1`,
            [slug]
        );

        if (!serviceRows.length)
            return res.status(404).json({ message: 'Service not found' });

        const service = serviceRows[0];

        const [detail] = await db.query(
            `SELECT * FROM fmcg_service_details
             WHERE service_id = ? AND is_active = 1`,
            [service.id]
        );

        const [sections] = await db.query(
            `SELECT * FROM fmcg_service_sections
             WHERE service_id = ?
             ORDER BY sort_order ASC`,
            [service.id]
        );

        const [pointsRaw] = await db.query(
            `SELECT * FROM fmcg_service_points
             WHERE service_id = ?
             ORDER BY sort_order ASC`,
            [service.id]
        );

        const [products] = await db.query(
            `SELECT * FROM fmcg_service_products
             WHERE service_id = ? AND is_active = 1
             ORDER BY sort_order ASC`,
            [service.id]
        );

        const points = pointsRaw.map(p => ({
            ...p,
            points_en: p.points_en ? JSON.parse(p.points_en) : [],
            points_ar: p.points_ar ? JSON.parse(p.points_ar) : []
        }));

        res.json({
            service,
            detail: detail[0] || null,
            sections,
            points,
            products
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN - DETAIL
========================================================= */

exports.getAdminDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM fmcg_service_details
             WHERE service_id = ?`,
            [id]
        );

        res.json(rows[0] || null);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.saveDetail = async (req, res) => {
    try {
        const {
            service_id,
            main_heading_en,
            main_heading_ar,
            sub_heading_en,
            sub_heading_ar,
            is_active
        } = req.body;

        const image = req.file
            ? `/uploads/fmcg-service-details/${req.file.filename}`
            : null;

        const [existing] = await db.query(
            `SELECT * FROM fmcg_service_details WHERE service_id = ?`,
            [service_id]
        );

        if (existing.length) {

            let hero_image = existing[0].hero_image;

            if (req.file) {
                deleteFile(hero_image);
                hero_image = image;
            }

            await db.query(
                `UPDATE fmcg_service_details
                 SET main_heading_en=?, main_heading_ar=?,
                     sub_heading_en=?, sub_heading_ar=?,
                     hero_image=?, is_active=?
                 WHERE service_id=?`,
                [
                    main_heading_en,
                    main_heading_ar,
                    sub_heading_en,
                    sub_heading_ar,
                    hero_image,
                    is_active ?? 1,
                    service_id
                ]
            );

        } else {

            await db.query(
                `INSERT INTO fmcg_service_details
                 (service_id, main_heading_en, main_heading_ar,
                  sub_heading_en, sub_heading_ar,
                  hero_image, is_active)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    service_id,
                    main_heading_en,
                    main_heading_ar,
                    sub_heading_en,
                    sub_heading_ar,
                    image,
                    is_active ?? 1
                ]
            );
        }

        res.json({ message: 'Detail saved successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN - SECTIONS
========================================================= */

exports.getSections = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM fmcg_service_sections
             WHERE service_id=?
             ORDER BY sort_order ASC`,
            [serviceId]
        );

        res.json(rows || []);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.createSection = async (req, res) => {
    try {
        const { service_id, heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order } = req.body;

        await db.query(
            `INSERT INTO fmcg_service_sections
             (service_id, heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [service_id, heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order || 0]
        );

        res.json({ message: 'Section created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order } = req.body;

        await db.query(
            `UPDATE fmcg_service_sections
             SET heading_en=?, heading_ar=?, paragraph_en=?, paragraph_ar=?, sort_order=?
             WHERE id=?`,
            [heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order || 0, id]
        );

        res.json({ message: 'Section updated' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            `DELETE FROM fmcg_service_sections WHERE id=?`,
            [id]
        );

        res.json({ message: 'Section deleted' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN - POINTS
========================================================= */

exports.getPoints = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM fmcg_service_points
             WHERE service_id=?
             ORDER BY sort_order ASC`,
            [serviceId]
        );

        const mapped = (rows || []).map(p => ({
            ...p,
            points_en: p.points_en ? JSON.parse(p.points_en) : [],
            points_ar: p.points_ar ? JSON.parse(p.points_ar) : []
        }));

        res.json(mapped);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.createPoint = async (req, res) => {
    try {
        const { service_id, small_heading_en, small_heading_ar, points_en, points_ar, sort_order } = req.body;

        await db.query(
            `INSERT INTO fmcg_service_points
             (service_id, small_heading_en, small_heading_ar, points_en, points_ar, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [service_id, small_heading_en, small_heading_ar, points_en, points_ar, sort_order || 0]
        );

        res.json({ message: 'Point group created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updatePoint = async (req, res) => {
    try {
        const { id } = req.params;
        const { small_heading_en, small_heading_ar, points_en, points_ar, sort_order } = req.body;

        await db.query(
            `UPDATE fmcg_service_points
             SET small_heading_en=?, small_heading_ar=?, points_en=?, points_ar=?, sort_order=?
             WHERE id=?`,
            [small_heading_en, small_heading_ar, points_en, points_ar, sort_order || 0, id]
        );

        res.json({ message: 'Point group updated' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deletePoint = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            `DELETE FROM fmcg_service_points WHERE id=?`,
            [id]
        );

        res.json({ message: 'Point group deleted' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* =========================================================
   ADMIN - PRODUCTS
========================================================= */

exports.getProducts = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM fmcg_service_products
             WHERE service_id=?
             ORDER BY sort_order ASC`,
            [serviceId]
        );

        res.json(rows || []);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            service_id,
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order
        } = req.body;

        const image = req.file
            ? `/uploads/fmcg-service-details/${req.file.filename}`
            : null;

        await db.query(
            `INSERT INTO fmcg_service_products
             (service_id, title_en, title_ar,
              description_en, description_ar,
              image, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [
                service_id,
                title_en,
                title_ar,
                description_en,
                description_ar,
                image,
                sort_order || 0
            ]
        );

        res.json({ message: 'Product created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
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
            `SELECT * FROM fmcg_service_products WHERE id=?`,
            [id]
        );

        if (!rows.length)
            return res.status(404).json({ message: 'Product not found' });

        let image = rows[0].image;

        if (req.file) {
            deleteFile(rows[0].image);
            image = `/uploads/fmcg-service-details/${req.file.filename}`;
        }

        await db.query(
            `UPDATE fmcg_service_products
             SET title_en=?, title_ar=?,
                 description_en=?, description_ar=?,
                 image=?, sort_order=?
             WHERE id=?`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                image,
                sort_order || 0,
                id
            ]
        );

        res.json({ message: 'Product updated' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT image FROM fmcg_service_products WHERE id=?`,
            [id]
        );

        if (!rows.length)
            return res.status(404).json({ message: 'Product not found' });

        deleteFile(rows[0].image);

        await db.query(
            `DELETE FROM fmcg_service_products WHERE id=?`,
            [id]
        );

        res.json({ message: 'Product deleted' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
