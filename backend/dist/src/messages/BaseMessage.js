"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
 * Clase base abstracta para representar un mensaje.
 * Proporciona una implementación básica para manejar identificadores de mensajes.
 */
class BaseMessage {
    /**
     * Crea una nueva instancia de BaseMessage.
     * @param messageId - (Opcional) Identificador del mensaje. Si no se proporciona, se genera un UUID aleatorio.
     */
    constructor(messageId, userId) {
        this.id = messageId ? messageId : (0, crypto_1.randomUUID)();
        this.timeStamp = new Date().getTime();
        this.userId = userId;
    }
    setUserId(uuid) {
        this.userId = uuid;
    }
    getUserId() {
        return this.userId || null;
    }
    /**
     * Obtiene el identificador del mensaje.
     * @returns El UUID del mensaje.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene el tiempo del mensaje.
     * @returns El tiempo del mensaje.
     */
    getTimeStamp() {
        return this.timeStamp;
    }
}
exports.default = BaseMessage;
