"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("./MessageType");
const QuestionMessage_1 = __importDefault(require("./QuestionMessage"));
const AnswerMessage_1 = __importDefault(require("./AnswerMessage"));
const UnknowMessage_1 = __importDefault(require("./UnknowMessage"));
const StatusMessage_1 = __importDefault(require("./StatusMessage"));
const EndMessage_1 = __importDefault(require("./EndMessage"));
const ErrorMessage_1 = __importDefault(require("./ErrorMessage"));
/**
 * Fábrica de mensajes que crea instancias de diferentes tipos de mensajes basados en el tipo recibido.
 */
class MessageFactory {
    /**
     * Crea una instancia de un mensaje basado en la información recibida.
     * @param message - Objeto de tipo SocketMessageInterface que contiene los datos del mensaje.
     * @returns Una instancia de MessageInterface si el tipo de mensaje es válido, de lo contrario, retorna null.
     */
    static create(message) {
        switch (message.type) {
            case MessageType_1.MessageType.QUESTION:
                return new QuestionMessage_1.default(message.id, message.content);
            case MessageType_1.MessageType.ANSWER:
                return new AnswerMessage_1.default(message.id, message.content);
            case MessageType_1.MessageType.STATUS:
                return new StatusMessage_1.default(message.id, message.content);
            case MessageType_1.MessageType.END:
                return new EndMessage_1.default(message.id);
            case MessageType_1.MessageType.ERROR:
                return new ErrorMessage_1.default(message.content);
            default:
                return new UnknowMessage_1.default();
        }
    }
}
exports.default = MessageFactory;
