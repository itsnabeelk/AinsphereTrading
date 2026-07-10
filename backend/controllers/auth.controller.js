const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
function isStrongPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;
    return regex.test(password);
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar   // ✅ ADD THIS
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {

        // 🔒 Ensure middleware attached user
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const userId = req.user.id;

        const [rows] = await db.query(
            'SELECT id, name, email, avatar, role FROM users WHERE id = ?',
            [userId]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            user: rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


exports.updateProfile = async (req, res) => {
    try {

        // 🔒 Safety check
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, email } = req.body;
        const userId = req.user.id;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // ✅ Check duplicate email
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        let avatarPath = null;

        if (req.file) {
            avatarPath = `/uploads/avatars/${req.file.filename}`;
        }

        await db.query(
            `UPDATE users 
             SET name = ?, email = ?, avatar = COALESCE(?, avatar) 
             WHERE id = ?`,
            [name, email, avatarPath, userId]
        );

        return res.status(200).json({
            message: 'Profile updated successfully'
        });

    } catch (err) {

        // 👇 Temporary debug (remove after fixing)
        console.error('UPDATE PROFILE ERROR:', err);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters and include one uppercase letter, one number, and one special character.'
            });
        }

        const [rows] = await db.query(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 12);

        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashed, userId]
        );

        res.json({ message: 'Password changed successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
