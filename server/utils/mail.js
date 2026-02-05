const nodemailer = require('nodemailer');

const createEmailTransporter = async () => {
    // If credentials are provided in .env, use them (GMAIL)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // FULLY AUTOMATIC FALLBACK: Create a test account if no credentials provided
    console.log('⚠️ No Gmail credentials provided. Creating a temporary test account...');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const sendEmail = async (options) => {
    try {
        const transporter = await createEmailTransporter();
        const mailOptions = {
            from: `"MAAN-verse Secure" <${process.env.EMAIL_USER || 'no-reply@maanverse.com'}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent to: ${options.email}`);

        // If using test account, log the URL to view the email
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log('\n' + '='.repeat(50));
            console.log('🔗 VIEW YOUR OTP HERE (Virtual Inbox):');
            console.log(previewUrl);
            console.log('='.repeat(50) + '\n');
        }
    } catch (error) {
        console.error('Nodemailer error:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
