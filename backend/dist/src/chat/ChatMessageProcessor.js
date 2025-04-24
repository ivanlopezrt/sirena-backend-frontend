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
const AnswerMessage_1 = __importDefault(require("../messages/AnswerMessage"));
const MessageType_1 = require("../messages/MessageType");
const MessageService_1 = __importDefault(require("../services/MessageService"));
/**
 * Clase encargada de procesar mensajes dentro de un chat, incluyendo preguntas,
 * respuestas (completas o parciales), y mensajes de finalización.
 */
class ChatMessageProcessor {
    /**
     * Crea una instancia del procesador de mensajes.
     * @param config Configuración del chat.
     */
    constructor(config) {
        /**
         * Mapa que mantiene mensajes de respuestas aún no finalizadas, agrupados por ID.
         */
        this.nonFinishedMessages = new Map();
        this.chatConfig = config;
        this.messageService = new MessageService_1.default();
    }
    /**
     * Procesa un mensaje en función de su tipo (pregunta, respuesta, parcial, o finalización).
     * @param message Mensaje a procesar.
     */
    process(message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (message.getType()) {
                case MessageType_1.MessageType.ANSWER:
                case MessageType_1.MessageType.PARTIAL_ANSWER:
                    this.addMessageToNonFinished(message);
                    break;
                case MessageType_1.MessageType.QUESTION:
                    yield this.handleQuestion(message);
                    break;
                case MessageType_1.MessageType.END:
                    yield this.processEndMessage(message);
                    break;
            }
        });
    }
    /**
     * Maneja un mensaje de tipo pregunta, guardándolo y completando su historial.
     * @param question Pregunta recibida del usuario.
     */
    handleQuestion(question) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveQuestion(question);
            yield this.fillHistory(question);
        });
    }
    /**
     * Procesa un mensaje de tipo END, identificando si cierra una secuencia de respuestas.
     * @param message Mensaje de finalización.
     */
    processEndMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.getFinishedMessageType(message)) {
                case MessageType_1.MessageType.ANSWER:
                    yield this.processEndAnswerMessage(message);
            }
            this.finishMessage(message);
        });
    }
    /**
     * Agrega un mensaje parcial o completo a la lista de respuestas no terminadas.
     * @param message Mensaje parcial o completo.
     */
    addMessageToNonFinished(message) {
        const existing = this.nonFinishedMessages.get(message.getId()) || [];
        this.nonFinishedMessages.set(message.getId(), [...existing, message]);
    }
    /**
     * Elimina una secuencia de mensajes que ha sido marcada como finalizada.
     * @param message Mensaje de finalización.
     */
    finishMessage(message) {
        this.nonFinishedMessages.delete(message.getId());
    }
    /**
     * Determina qué tipo de mensaje estaba siendo completado por un mensaje END.
     * @param endMessage Mensaje de finalización.
     * @returns Tipo de mensaje finalizado, o UNKNOWN si no hay coincidencias.
     */
    getFinishedMessageType(endMessage) {
        const messages = this.nonFinishedMessages.get(endMessage.getId());
        if (messages && messages[0]) {
            return messages[0].getType();
        }
        return MessageType_1.MessageType.UNKNOWN;
    }
    /**
     * Procesa el cierre de una secuencia de respuestas, guardando el mensaje final combinado.
     * @param endMessage Mensaje de finalización de respuesta.
     */
    processEndAnswerMessage(endMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveAnswer(endMessage);
        });
    }
    /**
     * Combina y guarda todas las partes de una respuesta parcial como un solo mensaje completo.
     * @param endMessage Mensaje de finalización.
     * @returns Mensaje de respuesta combinada guardado.
     */
    saveAnswer(endMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const completeAnswerText = (_a = this.nonFinishedMessages
                .get(endMessage.getId())) === null || _a === void 0 ? void 0 : _a.map((message) => message.getContent().text || "").join("");
            const mergedAnswer = new AnswerMessage_1.default(endMessage.getId(), {
                text: completeAnswerText || ""
            });
            yield this.messageService.createMessage(this.chatConfig.ownerId, this.chatConfig.chatId, mergedAnswer.getId(), "assistant", mergedAnswer.getContent().text);
            return mergedAnswer;
        });
    }
    /**
     * Guarda una pregunta enviada por el usuario en el servicio de mensajes.
     * @param question Pregunta enviada.
     */
    saveQuestion(question) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageService.createMessage(this.chatConfig.ownerId, this.chatConfig.chatId, question.getId(), "user", question.getContent().question);
        });
    }
    /**
     * Completa el historial de una pregunta con mensajes anteriores del chat.
     * @param question Pregunta a la que se agregará el historial.
     */
    fillHistory(question) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messageService.getMessages(this.chatConfig.ownerId, this.chatConfig.chatId);
            const [, ...rest] = messages;
            question.content.history = rest.map(m => ({
                role: m.role,
                content: m.text
            }));
        });
    }
}
exports.default = ChatMessageProcessor;
