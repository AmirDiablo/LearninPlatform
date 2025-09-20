const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // یا سایر سرویس‌ها
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
};