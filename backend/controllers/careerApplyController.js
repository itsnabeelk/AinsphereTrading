const sendEmail = require('../utils/sendEmail');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

/* ================= SAFE DELETE ================= */
const safeDelete = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
        console.error('File delete error:', err.message);
    }
};

exports.apply = async (req, res) => {
    const file = req.file; // keep here so we can cleanup in catch too
    try {
        const { name, email, phone, message, job_title } = req.body;
        const errors = {};

        /* ================= TEXT VALIDATION ================= */
        // Name: required, 2–100 chars, letters only
        const n = String(name || '').trim();
        if (!n) {
            errors.name = 'Full name is required';
        } else if (n.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        } else if (n.length > 100) {
            errors.name = 'Name must be 100 characters or fewer';
        } else if (!/^[\p{L}\s'\-\.]+$/u.test(n)) {
            errors.name = 'Name must contain letters only';
        }

        // Email: required + format
        const e = String(email || '').trim();
        if (!e) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) {
            errors.email = 'Invalid email address';
        } else if (e.length > 254) {
            errors.email = 'Email address is too long';
        }

        // Phone: required, digits/+/-/()/spaces only, 7–20 chars
        const p = String(phone || '').trim();
        if (!p) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-\s().]{7,20}$/.test(p)) {
            errors.phone = 'Phone must be 7–20 characters (digits, +, -, spaces only)';
        }

        // ✅ allow "general CV" submission when no job selected
        const j = String(job_title || '').trim() || 'General Application';

        const m = String(message || '').trim();

        /* ================= FILE VALIDATION ================= */
        const allowedMimeTypes = ['application/pdf'];

        if (!file) {
            errors.cv = 'CV file is required';
        } else {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                errors.cv = 'Only PDF files are allowed';
            } else if (file.size > 5 * 1024 * 1024) {
                errors.cv = 'Max file size is 5MB';
            }
        }

        if (Object.keys(errors).length) {
            // cleanup invalid upload too (optional but recommended)
            if (file?.path) safeDelete(file.path);

            return res.status(400).json({
                message: 'Validation error',
                errors
            });
        }

        /* ================= EMAIL TEMPLATE ================= */
        const logoUrl = process.env.COMPANY_LOGO_URL || 'https://ainspheretrading.com/images/logos/logo-dark.png';
        const companyName = process.env.COMPANY_NAME || 'Ainsphere';

        const html = buildCareerEmailHtml({
            companyName,
            logoUrl,
            name: n,
            email: e,
            phone: p,
            job: j,
            message: m
        });

        /* ================= ATTACHMENT (ABS PATH) ================= */
        const absPath = path.resolve(file.path);

        /* ================= SEND EMAIL ================= */
        await sendEmail({
            to: process.env.CONTACT_RECEIVER_EMAIL,
            subject: `Job Application - ${j}`,
            html,
            replyTo: e,
            attachments: [
                {
                    filename: file.originalname,
                    path: absPath,
                    contentType: file.mimetype
                }
            ]
        });

        /* ================= SAVE TO DB ================= */
        const cvPath = `/uploads/cv/${file.filename}`;
        await db.query(`
            INSERT INTO career_applications (name, email, phone, job_title, message, cv_path)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [n, e, p, j, m, cvPath]);

        res.json({ message: 'Application sent successfully' });

    } catch (err) {
        console.error('CAREER APPLY ERROR:', err);

        // cleanup also on failure
        if (file?.path) safeDelete(file.path);

        res.status(500).json({ message: 'Failed to send application' });
    }
};

/* ================= EMAIL TEMPLATE ================= */

function buildCareerEmailHtml({ companyName, logoUrl, name, email, phone, job, message }) {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeJob = escapeHtml(job);
    const safeMessage = escapeHtml(message || '-').replace(/\n/g, '<br/>');

    return `
    <div style="background:#f4f6f8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ee;">

        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #eef1f4;">
          <tr>
            <td style="padding:18px 22px;width:200px;">
              <img src="${logoUrl}" alt="${companyName}"
                style="height:42px;max-width:180px;object-fit:contain;" />
            </td>
            <td style="padding:18px 22px;">
              <div style="font-size:14px;color:#6b7280;">New Job Application</div>
              <div style="font-size:18px;font-weight:700;color:#111827;">${safeJob}</div>
            </td>
          </tr>
        </table>

        <div style="padding:22px;">
          <table width="100%" style="border-collapse:separate;border-spacing:0 10px;">
            ${row('Name', safeName)}
            ${row('Email', `<a href="mailto:${safeEmail}" style="color:#0b66c3;text-decoration:none;">${safeEmail}</a>`)}
            ${row('Phone', safePhone)}
            ${row('Position', safeJob)}
            ${row('Message', `<div style="line-height:1.6;">${safeMessage}</div>`)}
          </table>

          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #eef1f4;color:#6b7280;font-size:12px;">
            CV is attached with this email.
          </div>
        </div>

      </div>
    </div>`;
}

/* ================= HELPERS ================= */

function row(label, valueHtml) {
    return `
    <tr>
      <td style="width:140px;color:#6b7280;font-size:13px;padding:10px;background:#f8fafc;border:1px solid #eef1f4;border-right:none;border-radius:8px 0 0 8px;">
        ${label}
      </td>
      <td style="padding:10px;background:#ffffff;border:1px solid #eef1f4;border-left:none;border-radius:0 8px 8px 0;">
        ${valueHtml}
      </td>
    </tr>`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}