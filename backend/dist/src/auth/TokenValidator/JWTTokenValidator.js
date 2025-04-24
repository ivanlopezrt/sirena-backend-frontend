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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTTokenValidator {
    validate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                return null;
            }
            const secretKey = "6e2d3f3e4b3a2d1c4f5e6d7b8c9e0a1f2b3d4e5f6a7b8c9d0e1f2g3h4i5j6k7";
            try {
                const decoded = jsonwebtoken_1.default.verify(token, secretKey);
                console.log("decoded", decoded);
                return decoded;
            }
            catch (err) {
                console.error("Error al verificar token:", err);
                return null;
            }
        });
    }
}
exports.default = JWTTokenValidator;
