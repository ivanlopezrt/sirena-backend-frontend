const emailService = require('./emailService');
const jwt = require('jsonwebtoken');
const {User, Authentication, Hospital, Specialty, Role} = require('../models');
const crypto = require("crypto");
const {Sequelize} = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Class representing the authentication service.
 * @class AuthService
 */
class AuthService {

    /**
     * Authenticates the user with email and password.
     * @async
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<{code: number, message: string}|{code: number, token: string, user: Object}>}
     * - A response object with status code and message or token and user details.
     *
     */
    async authenticateUser(email, password) {
        // Check if email and password are provided
        if (!email || !password) {
            return {code: 400, message: 'Debes proporcionar un correo electrónico y contraseña'};
        }

        // Find the user by email
        const user = await User.findOne({where: {email}});
        const hashedPassword = this.#hashPassword(password);

        console.log("hashedPassword!!!!!!!!!!!!!!!!!!!!", hashedPassword)

        console.log("user!!!!!!!!!!!!!!!!!!!!", user)

        // Check if user exists and password matches
        if (!(user && hashedPassword === user.password)) {
            return {code: 401, message: 'Error usuario o contraseña no validos'};
        }

        // Generate a verification code and set expiration date
        const authCode = this.#generateVerificationCode();
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);

        // Create the authentication record
        const createdAuthRecord = await Authentication.create({
            code: authCode, user_id: user.id, used: false, expiration_date: expirationDate
        });

        if (!createdAuthRecord) {
            return {code: 500, message: 'Error al crear el código de autenticación'};
        }

        const emailSender = new emailService()
        return await emailSender.sendVerificationEmail(user.email, authCode);
    }

    /**
     * Verifies the authentication code provided by the user.
     * @async
     * @param {string} email - The user's email address.
     * @param {string} code - The verification code sent to the user's email.
     * @returns {Promise<{code: number, message: string}|{code: number, token: string, user: Object}>}
     * */

    async verifyCode(email, code) {

        if (!email || !code) {
            return {code: 400, message: 'Debes proporcionar un correo electrónico y código de verificación'}
        }

        const user = await User.findOne({where: {email}});

        if (!user) {
            return {code: 401, message: 'Código de autenticación inválido o expirado'}
        }

        const authRecord = await Authentication.findOne({
            where: {
                code, user_id: user.id, used: false, expiration_date: {
                    [Sequelize.Op.gt]: new Date()
                }
            }
        });

        if (!authRecord) {
            return {code: 401, message: 'Código de autenticación inválido o expirado'}
        }

        await authRecord.update({used: true});
        await user.update({last_start: new Date()});

        const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '30d'});

        const hospital = await Hospital.findOne({where: {id: user.hospital_id}});
        const hospital_name = hospital.name
        const role = await Role.findOne({where: {id: user.role_id}});
        const role_name = role.name
        const specialty = await Specialty.findOne({where: {id: user.specialty_id}});
        const specialty_name = specialty.name
        const {
            id,
            role_id,
            specialty_id,
            hospital_id,
            password,
            creation_date,
            last_start,
            ...professionalWithoutPassword
        } = user.toJSON();
        const sendUser = {...professionalWithoutPassword, hospital_name, specialty_name, role_name};
        return {
            code: 200,
            token,
            user: sendUser,
        };
    }

    /**
     * Hashes the password using SHA-256.
     * @private
     * @param {string} password - The password to hash.
     * @returns {string} - The hashed password.
     */
    #hashPassword(password) {
        const cleanPassword = password.trim();
        const sha256 = crypto.createHash('sha256');
        sha256.update(cleanPassword, 'utf8'); // Se especifica la codificación de texto
        return sha256.digest('hex');
    }

    /**
     * Generates a random verification code.
     * @private
     * @returns {string} - A random verification code.
     */

    #generateVerificationCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

}

module.exports = new AuthService();
