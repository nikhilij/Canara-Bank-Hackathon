const nodemailer = require('nodemailer');

// Email service
// TODO: Implement email notifications
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(to, subject, text, html) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to,
                subject,
                text,
                html
            };

            const result = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(email, name) {
        const subject = 'Welcome to Canara Bank';
        const text = `Hello ${name}, welcome to Canara Bank!`;
        const html = `<h1>Welcome ${name}!</h1><p>Thank you for joining Canara Bank.</p>`;
        
        return this.sendEmail(email, subject, text, html);
    }

    async sendPasswordResetEmail(email, resetToken) {
        const subject = 'Password Reset Request';
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const text = `Reset your password using this link: ${resetUrl}`;
        const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
        
        return this.sendEmail(email, subject, text, html);
    }

    async sendTransactionAlert(email, transaction) {
        const subject = 'Transaction Alert';
        const text = `Transaction of ${transaction.amount} processed on your account.`;
        const html = `<p>Transaction Alert: ${transaction.type} of <strong>${transaction.amount}</strong> processed.</p>`;
        
        return this.sendEmail(email, subject, text, html);
    }
}

module.exports = new EmailService();