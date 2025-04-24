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
const authService = require('../services/authService');
exports.authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const authCode = yield authService.authenticateUser(email, password);
        res.status(authCode.code).json({ message: authCode.message });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    try {
        const verifyLogin = yield authService.verifyCode(email, code);
        if (verifyLogin.code === 200) {
            res.status(verifyLogin.code).json({ token: verifyLogin.token, user: verifyLogin.user });
        }
        else {
            res.status(verifyLogin.code).json({ message: verifyLogin.message });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
