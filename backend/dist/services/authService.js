"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _AuthService_instances, _AuthService_hashPassword, _AuthService_generateVerificationCode;
const emailService = require('./emailService');
const jwt = require('jsonwebtoken');
const { User, Authentication, Hospital, Specialty, Role } = require('../src/models');
const crypto = require("crypto");
const { Sequelize } = require("sequelize");
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Class representing the authentication service.
 * @class AuthService
 */
class AuthService {
    constructor() {
        _AuthService_instances.add(this);
    }
    /**
     * Authenticates the user with email and password.
     * @async
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<{code: number, message: string}|{code: number, token: string, user: Object}>}
     * - A response object with status code and message or token and user details.
     *
     */
    authenticateUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if email and password are provided
            if (!email || !password) {
                return { code: 400, message: 'Debes proporcionar un correo electrónico y contraseña' };
            }
            // Find the user by email
            const user = yield User.findOne({ where: { email } });
            const hashedPassword = __classPrivateFieldGet(this, _AuthService_instances, "m", _AuthService_hashPassword).call(this, password);
            // Check if user exists and password matches
            if (!(user && hashedPassword === user.password)) {
                return { code: 401, message: 'Error usuario o contraseña no validos' };
            }
            // Generate a verification code and set expiration date
            const authCode = __classPrivateFieldGet(this, _AuthService_instances, "m", _AuthService_generateVerificationCode).call(this);
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);
            // Create the authentication record
            const createdAuthRecord = yield Authentication.create({
                code: authCode, user_id: user.id, used: false, expiration_date: expirationDate
            });
            if (!createdAuthRecord) {
                return { code: 500, message: 'Error al crear el código de autenticación' };
            }
            const emailSender = new emailService();
            return yield emailSender.sendVerificationEmail(user.email, authCode);
        });
    }
    /**
     * Verifies the authentication code provided by the user.
     * @async
     * @param {string} email - The user's email address.
     * @param {string} code - The verification code sent to the user's email.
     * @returns {Promise<{code: number, message: string}|{code: number, token: string, user: Object}>}
     * */
    verifyCode(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !code) {
                return { code: 400, message: 'Debes proporcionar un correo electrónico y código de verificación' };
            }
            const user = yield User.findOne({ where: { email } });
            if (!user) {
                return { code: 401, message: 'Código de autenticación inválido o expirado' };
            }
            const authRecord = yield Authentication.findOne({
                where: {
                    code, user_id: user.id, used: false, expiration_date: {
                        [Sequelize.Op.gt]: new Date()
                    }
                }
            });
            if (!authRecord) {
                return { code: 401, message: 'Código de autenticación inválido o expirado' };
            }
            yield authRecord.update({ used: true });
            yield user.update({ last_start: new Date() });
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
            const hospital = yield Hospital.findOne({ where: { id: user.hospital_id } });
            const hospital_name = hospital.name;
            const role = yield Role.findOne({ where: { id: user.role_id } });
            const role_name = role.name;
            const specialty = yield Specialty.findOne({ where: { id: user.specialty_id } });
            const specialty_name = specialty.name;
            const _a = user.toJSON(), { id, role_id, specialty_id, hospital_id, password, creation_date, last_start } = _a, professionalWithoutPassword = __rest(_a, ["id", "role_id", "specialty_id", "hospital_id", "password", "creation_date", "last_start"]);
            const sendUser = Object.assign(Object.assign({}, professionalWithoutPassword), { hospital_name, specialty_name, role_name });
            return {
                code: 200,
                token,
                user: sendUser,
            };
        });
    }
}
_AuthService_instances = new WeakSet(), _AuthService_hashPassword = function _AuthService_hashPassword(password) {
    const cleanPassword = password.trim();
    const sha256 = crypto.createHash('sha256');
    sha256.update(cleanPassword, 'utf8'); // Se especifica la codificación de texto
    return sha256.digest('hex');
}, _AuthService_generateVerificationCode = function _AuthService_generateVerificationCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};
module.exports = new AuthService();
