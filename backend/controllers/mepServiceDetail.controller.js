const db = require('../config/db');
const fs = require('fs');
const path = require('path');

/* ============================================================
   PUBLIC: GET FULL SERVICE BY SLUG
============================================================ */
exports.getPublicBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        /* 1️⃣ Get Service */
        const [serviceRows] = await db.query(
            "SELECT * FROM mep_services WHERE slug = ? AND is_active = 1",
            [slug]
        );

        if (!serviceRows.length)
            return res.status(404).json({ message: "Service not found" });

        const service = serviceRows[0];

        /* 2️⃣ Get Detail */
        const [detailRows] = await db.query(
            "SELECT * FROM mep_service_details WHERE service_id = ?",
            [service.id]
        );

        /* 3️⃣ Get Sections */
        const [sections] = await db.query(
            "SELECT * FROM mep_service_sections WHERE service_id = ? ORDER BY sort_order ASC",
            [service.id]
        );

        /* 4️⃣ Get Points */
        const [pointsRaw] = await db.query(
            "SELECT * FROM mep_service_points WHERE service_id = ? ORDER BY sort_order ASC",
            [service.id]
        );

        const points = pointsRaw.map(p => ({
            ...p,
            points_en: p.points_en ? JSON.parse(p.points_en) : [],
            points_ar: p.points_ar ? JSON.parse(p.points_ar) : []
        }));

        /* 5️⃣ Get Products */
        const [products] = await db.query(
            "SELECT * FROM mep_service_products WHERE service_id = ? AND is_active = 1 ORDER BY sort_order ASC",
            [service.id]
        );

        res.json({
            service,
            detail: detailRows[0] || null,
            sections,
            points,
            products
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ============================================================
   ADMIN: GET DETAIL BY SERVICE ID
============================================================ */
exports.getAdminByService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [detail] = await db.query(
            "SELECT * FROM mep_service_details WHERE service_id = ?",
            [serviceId]
        );

        const [sections] = await db.query(
            "SELECT * FROM mep_service_sections WHERE service_id = ? ORDER BY sort_order ASC",
            [serviceId]
        );

        const [points] = await db.query(
            "SELECT * FROM mep_service_points WHERE service_id = ? ORDER BY sort_order ASC",
            [serviceId]
        );

        const [products] = await db.query(
            "SELECT * FROM mep_service_products WHERE service_id = ? ORDER BY sort_order ASC",
            [serviceId]
        );

        res.json({
            detail: detail[0] || null,
            sections,
            points,
            products
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ============================================================
   ADMIN: SAVE OR UPDATE DETAIL
============================================================ */
exports.saveDetail = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const {
            main_heading_en,
            main_heading_ar,
            sub_heading_en,
            sub_heading_ar
        } = req.body;

        let hero_image = null;

        if (req.file)
            hero_image = `/uploads/mep-service-details/${req.file.filename}`;

        const [existing] = await db.query(
            "SELECT * FROM mep_service_details WHERE service_id = ?",
            [serviceId]
        );

        if (existing.length) {

            let oldImage = existing[0].hero_image;

            if (req.file && oldImage) {
                const oldPath = path.join(process.cwd(), oldImage);
                if (fs.existsSync(oldPath))
                    fs.unlinkSync(oldPath);
            }

            await db.query(
                `UPDATE mep_service_details SET
                    hero_image = ?,
                    main_heading_en = ?,
                    main_heading_ar = ?,
                    sub_heading_en = ?,
                    sub_heading_ar = ?
                 WHERE service_id = ?`,
                [
                    hero_image || oldImage,
                    main_heading_en,
                    main_heading_ar,
                    sub_heading_en,
                    sub_heading_ar,
                    serviceId
                ]
            );

        } else {

            await db.query(
                `INSERT INTO mep_service_details
                (service_id, hero_image, main_heading_en, main_heading_ar, sub_heading_en, sub_heading_ar)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    serviceId,
                    hero_image,
                    main_heading_en,
                    main_heading_ar,
                    sub_heading_en,
                    sub_heading_ar
                ]
            );
        }

        res.json({ message: "Detail saved successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ============================================================
   ADMIN: CREATE SECTION
============================================================ */
exports.createSection = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order } = req.body;

        await db.query(
            `INSERT INTO mep_service_sections
            (service_id, heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [serviceId, heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order || 0]
        );

        res.json({ message: "Section added successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ============================================================
   ADMIN: DELETE SECTION
============================================================ */
exports.deleteSection = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM mep_service_sections WHERE id = ?",
            [req.params.id]
        );
        res.json({ message: "Section deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ============================================================
   ADMIN: CREATE POINT GROUP
============================================================ */
exports.createPoint = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const {
            small_heading_en,
            small_heading_ar,
            points_en,
            points_ar,
            sort_order
        } = req.body;

        let pointsEnArray = [];
        let pointsArArray = [];

        // If textarea string → convert to array
        if (typeof points_en === 'string') {
            pointsEnArray = points_en
                .split('\n')
                .map(p => p.trim())
                .filter(p => p);
        } else if (Array.isArray(points_en)) {
            pointsEnArray = points_en;
        }

        if (typeof points_ar === 'string') {
            pointsArArray = points_ar
                .split('\n')
                .map(p => p.trim())
                .filter(p => p);
        } else if (Array.isArray(points_ar)) {
            pointsArArray = points_ar;
        }

        await db.query(
            `INSERT INTO mep_service_points
            (service_id, small_heading_en, small_heading_ar, points_en, points_ar, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                serviceId,
                small_heading_en,
                small_heading_ar,
                JSON.stringify(pointsEnArray),
                JSON.stringify(pointsArArray),
                sort_order || 0
            ]
        );

        res.json({ message: "Point group added" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ============================================================
   ADMIN: CREATE PRODUCT
============================================================ */
exports.createProduct = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const {
            title_en,
            title_ar,
            description_en,
            description_ar,
            sort_order
        } = req.body;

        const image = req.file
            ? `/uploads/mep-service-details/${req.file.filename}`
            : null;

        await db.query(
            `INSERT INTO mep_service_products
            (service_id, title_en, title_ar, description_en, description_ar, image, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                serviceId,
                title_en,
                title_ar,
                description_en,
                description_ar,
                image,
                sort_order || 0
            ]
        );

        res.json({ message: "Product added successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getSections = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM mep_service_sections WHERE service_id = ? ORDER BY sort_order ASC",
            [serviceId]
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order } = req.body;

        await db.query(
            `UPDATE mep_service_sections SET
                heading_en = ?,
                heading_ar = ?,
                paragraph_en = ?,
                paragraph_ar = ?,
                sort_order = ?
             WHERE id = ?`,
            [heading_en, heading_ar, paragraph_en, paragraph_ar, sort_order || 0, id]
        );

        res.json({ message: "Section updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getPoints = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM mep_service_points WHERE service_id = ? ORDER BY sort_order ASC",
            [serviceId]
        );

        const points = rows.map(p => ({
            ...p,
            points_en: p.points_en ? JSON.parse(p.points_en) : [],
            points_ar: p.points_ar ? JSON.parse(p.points_ar) : []
        }));

        res.json(points);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePoint = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            small_heading_en,
            small_heading_ar,
            points_en,
            points_ar,
            sort_order
        } = req.body;

        // ✅ Convert textarea string to array
        const pointsEnArray = typeof points_en === 'string'
            ? points_en.split('\n').map(p => p.trim()).filter(p => p)
            : points_en || [];

        const pointsArArray = typeof points_ar === 'string'
            ? points_ar.split('\n').map(p => p.trim()).filter(p => p)
            : points_ar || [];

        await db.query(
            `UPDATE mep_service_points SET
                small_heading_en = ?,
                small_heading_ar = ?,
                points_en = ?,
                points_ar = ?,
                sort_order = ?
             WHERE id = ?`,
            [
                small_heading_en,
                small_heading_ar,
                JSON.stringify(pointsEnArray),
                JSON.stringify(pointsArArray),
                sort_order || 0,
                id
            ]
        );

        res.json({ message: "Point group updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deletePoint = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM mep_service_points WHERE id = ?",
            [req.params.id]
        );

        res.json({ message: "Point group deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM mep_service_products WHERE service_id = ? ORDER BY sort_order ASC",
            [serviceId]
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({ message: err.message });
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

        let image = null;

        if (req.file)
            image = `/uploads/mep-service-details/${req.file.filename}`;

        const [existing] = await db.query(
            "SELECT * FROM mep_service_products WHERE id = ?",
            [id]
        );

        if (!existing.length)
            return res.status(404).json({ message: "Product not found" });

        let oldImage = existing[0].image;

        if (req.file && oldImage) {
            const oldPath = path.join(process.cwd(), oldImage);
            if (fs.existsSync(oldPath))
                fs.unlinkSync(oldPath);
        }

        await db.query(
            `UPDATE mep_service_products SET
                title_en = ?,
                title_ar = ?,
                description_en = ?,
                description_ar = ?,
                image = ?,
                sort_order = ?
             WHERE id = ?`,
            [
                title_en,
                title_ar,
                description_en,
                description_ar,
                image || oldImage,
                sort_order || 0,
                id
            ]
        );

        res.json({ message: "Product updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT image FROM mep_service_products WHERE id = ?",
            [id]
        );

        if (existing.length && existing[0].image) {
            const oldPath = path.join(process.cwd(), existing[0].image);
            if (fs.existsSync(oldPath))
                fs.unlinkSync(oldPath);
        }

        await db.query(
            "DELETE FROM mep_service_products WHERE id = ?",
            [id]
        );

        res.json({ message: "Product deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
