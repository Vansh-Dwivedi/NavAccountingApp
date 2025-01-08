const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Email content
        const mailOptions = {
            from: `"Nav Accounts" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send auto-reply to the user
        const autoReplyOptions = {
            from: `"Nav Accounts" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank you for contacting Nav Accounts',
            html: `
                <h3>Thank you for reaching out!</h3>
                <p>Dear ${firstName},</p>
                <p>We have received your message and will get back to you within 24-48 hours.</p>
                <p>Best regards,</p>
                <p>Nav Accounts Team</p>
            `
        };

        await transporter.sendMail(autoReplyOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};
