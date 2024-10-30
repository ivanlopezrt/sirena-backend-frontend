const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

/**
 * EmailService is responsible for sending emails, including loading HTML templates and replacing placeholders with actual data.
 * It uses Nodemailer for email transport.
 */
class EmailService {

    /**
     * Creates an instance of EmailService and initializes the email transporter using Nodemailer.
     * Transporter configuration uses Gmail with credentials stored in environment variables.
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }


    /**
     * Loads and processes an HTML email template, replacing specified placeholders with dynamic values.
     * @private
     * @param {string} templateName - Path to the HTML template file.
     * @param {Object} placeholders - Key-value pairs where keys are placeholder names and values are replacement values.
     * @returns {string} - Processed HTML content with placeholders replaced.
     */
    #loadHTMLTemplate(templateName, placeholders) {
        const filePath = path.join(__dirname, templateName);
        let htmlContent = fs.readFileSync(filePath, 'utf8');
        for (const key in placeholders) {
            const placeholder = `{{${key}}}`;
            htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), placeholders[key]);
        }
        return htmlContent;
    }

    /**
     * Sends a verification email to a specified recipient email address, containing a verification code.
     * @async
     * @param {string} to - Recipient email address.
     * @param {string} verificationCode - Verification code to be included in the email.
     * @returns {Promise<Object>} - A Promise that resolves to an object with the response code and message.
     */
    sendVerificationEmail(to, verificationCode) {
        const htmlContent = this.#loadHTMLTemplate('../templates/messageCodeVerification.html', {verificationCode});

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Código de Verificación para Inicio de Sesión',
            html: htmlContent,
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo electrónico:', error);
                    resolve({code: 500, message: 'Error al enviar el correo electrónico'});
                } else {
                    resolve({code: 200, message: 'Código enviado con éxito'});
                }
            });
        });
    }
}

module.exports = EmailService;
