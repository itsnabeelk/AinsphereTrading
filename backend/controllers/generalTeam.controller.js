const db = require('../config/db');

/* ================= PUBLIC ================= */
exports.getPublic = async (req, res) => {
    const [rows] = await db.query(
        `SELECT * FROM general_team
         WHERE is_active = 1
         ORDER BY sort_order ASC`
    );
    res.json(rows);
};

/* ================= ADMIN ================= */
exports.getAdmin = async (req, res) => {
    const [rows] = await db.query(
        `SELECT * FROM general_team
         ORDER BY sort_order ASC`
    );
    res.json(rows);
};

exports.create = async (req, res) => {
    const { name_en, name_ar, designation_en, designation_ar, sort_order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await db.query(
        `INSERT INTO general_team
         (name_en, name_ar, designation_en, designation_ar, image, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name_en, name_ar, designation_en, designation_ar, image, sort_order || 0]
    );

    res.json({ message: 'Created successfully' });
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name_en, name_ar, designation_en, designation_ar, sort_order } = req.body;

    let imageQuery = '';
    let params = [name_en, name_ar, designation_en, designation_ar, sort_order];

    if (req.file) {
        imageQuery = ', image=?';
        params.push(`/uploads/${req.file.filename}`);
    }

    params.push(id);

    await db.query(
        `UPDATE general_team
         SET name_en=?, name_ar=?, designation_en=?, designation_ar=?, sort_order=? ${imageQuery}
         WHERE id=?`,
        params
    );

    res.json({ message: 'Updated successfully' });
};

exports.remove = async (req, res) => {
    await db.query(`DELETE FROM general_team WHERE id=?`, [req.params.id]);
    res.json({ message: 'Deleted successfully' });
};

exports.toggle = async (req, res) => {
    await db.query(
        `UPDATE general_team SET is_active = NOT is_active WHERE id=?`,
        [req.params.id]
    );
    res.json({ message: 'Toggled successfully' });
};
