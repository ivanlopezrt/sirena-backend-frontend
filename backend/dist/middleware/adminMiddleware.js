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
const { Role, User } = require('../src/models');
/**
 * Middleware to ensure that the user has admin privileges.
 * @function adminMiddleware
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Calls next() if the user is an admin, otherwise responds with an error.
 */
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const findUser = yield User.findOne({ where: { id: user.id } });
    if (!findUser) {
        return res.status(400).json({ message: 'Usuario no valido' });
    }
    const role = yield Role.findOne({ where: { id: findUser.dataValues.role_id } });
    if (role.dataValues.name !== "Admin") {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
});
module.exports = adminMiddleware;
