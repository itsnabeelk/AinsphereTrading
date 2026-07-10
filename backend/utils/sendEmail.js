const nodemailer = require('nodemailer');

module.exports = async function sendEmail({
    to,
    subject,
    html,
    replyTo,
    attachments = []
}) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true, // ✅ for port 465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        replyTo,
        attachments
    });
};