"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const BaseMessage_1 = __importDefault(require("./BaseMessage"));
class UnknowMessage extends BaseMessage_1.default {
    constructor() {
        super();
        this.type = MessageType_1.MessageType.UNKNOWN;
        this.content = { content: "Lo siento. No puedo entenderte." };
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
     * @returns El tipo del mensaje, en este caso, MessageType.ANSWER.
     */
    getType() {
        return this.type;
    }
    /**
     * Obtiene el contenido del mensaje.
     * @returns El contenido del mensaje, de tipo AnswerMessageData.
     */
    getContent() {
        return this.content;
    }
}
exports.default = UnknowMessage;
