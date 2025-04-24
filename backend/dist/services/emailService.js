"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EmailService_instances, _EmailService_loadHTMLTemplate;
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
        _EmailService_instances.add(this);
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    /**
     * Sends a verification email to a specified recipient email address, containing a verification code.
     * @async
     * @param {string} to - Recipient email address.
     * @param {string} verificationCode - Verification code to be included in the email.
     * @returns {Promise<Object>} - A Promise that resolves to an object with the response code and message.
     */
    sendVerificationEmail(to, verificationCode) {
        const htmlContent = __classPrivateFieldGet(this, _EmailService_instances, "m", _EmailService_loadHTMLTemplate).call(this, '../templates/messageCodeVerification.html', { verificationCode });
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
                    resolve({ code: 500, message: 'Error al enviar el correo electrónico' });
                }
                else {
                    resolve({ code: 200, message: 'Código enviado con éxito' });
                }
            });
        });
    }
}
_EmailService_instances = new WeakSet(), _EmailService_loadHTMLTemplate = function _EmailService_loadHTMLTemplate(templateName, placeholders) {
    const filePath = path.join(__dirname, templateName);
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    for (const key in placeholders) {
        const placeholder = `{{${key}}}`;
        htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), placeholders[key]);
    }
    return htmlContent;
};
module.exports = EmailService;
