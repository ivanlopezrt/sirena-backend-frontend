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
const IncomingMessageParamRetriever_1 = __importDefault(require("../utils/IncomingMessageParamRetriever"));
/**
 * Clase encargada de extraer y construir una configuración de chat (`ChatConfig`)
 * a partir de los parámetros de una solicitud HTTP entrante.
 */
class ChatConfigRetriever {
    /**
     * Crea una nueva instancia de `ChatConfigRetriever`.
     * @param tokenValidator Instancia para validar el token JWT o similar.
     */
    constructor(tokenValidator) {
        this.tokenValidator = tokenValidator;
        this.paramRetriever = null;
    }
    /**
     * Extrae y valida el user ID desde el encabezado `authorization`.
     *
     * @returns El UUID del usuario si es válido, o `null` si es inválido.
     */
    getUserId() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = this.paramRetriever.retrieve("authorization");
            return ((_a = (yield this.tokenValidator.validate(token))) === null || _a === void 0 ? void 0 : _a.id) || null;
        });
    }
    /**
     * Extrae el chat ID desde los parámetros de la solicitud entrante.
     *
     * @returns El UUID del chat o `null` si no está presente.
     */
    getChatId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paramRetriever.retrieve("chatId");
        });
    }
    /**
     * Construye y retorna la configuración del chat (`ChatConfig`) a partir de una solicitud.
     *
     * @param message Solicitud HTTP entrante.
     * @returns Objeto `ChatConfig` con `ownerId` y `chatId`.
     */
    getChatConfig(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.paramRetriever = new IncomingMessageParamRetriever_1.default(message);
            const userId = yield this.getUserId();
            const chatId = yield this.getChatId();
            const token = this.paramRetriever.retrieve("authorization");
            return { ownerId: userId, chatId: chatId, token: token };
        });
    }
}
exports.default = ChatConfigRetriever;
