"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const BaseMessage_1 = __importDefault(require("./BaseMessage"));
/**
 * Representa un mensaje de tipo pregunta, extendiendo la funcionalidad de BaseMessage.
 */
class QuestionMessage extends BaseMessage_1.default {
    /**
     * Crea una nueva instancia de QuestionMessage.
     * @param id - Identificador único del mensaje.
     * @param content - Contenido del mensaje con la pregunta y su historial.
     */
    constructor(id, content) {
        super(id);
        /** Tipo del mensaje, en este caso, una pregunta. */
        this.type = MessageType_1.MessageType.QUESTION;
        /** Contenido del mensaje, incluyendo la pregunta y el historial de conversación. */
        this.content = { question: "", messageId: null };
        this.content = content;
    }
    /**
     * Obtiene el identificador del mensaje.
     * @returns El UUID del mensaje.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene el tipo del mensaje.
     * @returns El tipo del mensaje, en este caso, MessageType.QUESTION.
     */
    getType() {
        return this.type;
    }
    /**
     * Obtiene el contenido del mensaje.
     * @returns El contenido del mensaje, de tipo QuestionMessageData.
     */
    getContent() {
        return this.content;
    }
}
exports.default = QuestionMessage;
