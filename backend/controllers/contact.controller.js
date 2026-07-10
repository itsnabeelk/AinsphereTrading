const sendEmail = require('../utils/sendEmail');
const db = require('../config/db');

const ALLOWED_SUBJECTS = [
  'General Trading',
  'FMCG Trading',
  'MEP Trading',
  'Uniforms'
];

exports.send = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const errors = {};

    /* ================= NORMALIZE ================= */
    const n = String(name || '').trim();
    const e = String(email || '').trim();
    const p = String(phone || '').trim();
    const s = String(subject || '').trim();
    const m = String(message || '').trim();

    /* ================= VALIDATION ================= */

    // Name: required, 2–100 chars, letters/spaces/hyphens/apostrophes only
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
    if (!e) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) {
      errors.email = 'Invalid email address';
    } else if (e.length > 254) {
      errors.email = 'Email address is too long';
    }

    // Phone: required, digits/+/-/()/spaces only, 7–20 chars
    if (!p) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s().]{7,20}$/.test(p)) {
      errors.phone = 'Phone must be 7–20 characters (digits, +, -, spaces only)';
    }

    if (!s) {
      errors.subject = 'Subject is required';
    } else if (!ALLOWED_SUBJECTS.includes(s)) {
      errors.subject = 'Invalid subject selected';
    }

    // Message: required, min 10, max 4000
    if (!m) {
      errors.message = 'Message is required';
    } else if (m.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (m.length > 4000) {
      errors.message = 'Message too long (max 4000 characters)';
    }

    /* ================= RETURN VALIDATION ================= */
    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    /* ================= SAVE TO DB ================= */
    await db.query(`
      INSERT INTO contact_submissions (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [n, e, p, s, m]);

    /* ================= EMAIL ================= */
    const logoUrl = process.env.COMPANY_LOGO_URL || 'https://ainspheretrading.com/images/logos/logo-dark.png';
    const companyName = process.env.COMPANY_NAME || 'Ainsphere';

    const html = buildContactEmailHtml({
      companyName,
      logoUrl,
      name: n,
      email: e,
      phone: p,
      subject: s,
      message: m
    });

    await sendEmail({
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `Contact Form - ${s}`, // ✅ more professional
      html,
      replyTo: e // ✅ so you can reply directly
    });

    return res.json({ message: 'Message sent successfully' });

  } catch (err) {
    console.error('CONTACT SEND ERROR:', err);

    return res.status(500).json({
      message: 'Failed to send message'
    });
  }
};

/* ================= EMAIL TEMPLATE ================= */

function buildContactEmailHtml({ companyName, logoUrl, name, email, phone, subject, message }) {

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  return `
  <div style="background:#f4f6f8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ee;">

      <!-- HEADER -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #eef1f4;">
        <tr>
          <td style="padding:18px 22px;width:200px;">
            <img src="${logoUrl}" alt="${companyName}"
              style="height:42px;max-width:180px;object-fit:contain;" />
          </td>
          <td style="padding:18px 22px;">
            <div style="font-size:14px;color:#6b7280;">New Contact Message</div>
            <div style="font-size:18px;font-weight:700;color:#111827;">${safeSubject}</div>
          </td>
        </tr>
      </table>

      <!-- BODY -->
      <div style="padding:22px;">
        <table width="100%" style="border-collapse:separate;border-spacing:0 10px;">
          ${row('Name', safeName)}
          ${row('Email', `<a href="mailto:${safeEmail}" style="color:#0b66c3;text-decoration:none;">${safeEmail}</a>`)}
          ${row('Phone', safePhone)}
          ${row('Subject', safeSubject)}
          ${row('Message', `<div style="line-height:1.6;">${safeMessage}</div>`)}
        </table>

        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #eef1f4;color:#6b7280;font-size:12px;">
          Sent from Ainsphere website contact form.
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