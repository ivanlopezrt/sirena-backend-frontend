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
Object.defineProperty(exports, "__esModule", { value: true });
const { Chat, Message, Feedback } = require('../models');
/**
 * messageService gestiona los mensajes dentro de los chats, permitiendo su recuperación, creación e integración de comentarios.
 */
class MessageService {
    /**
     * Recupera los mensajes para un chat dado, opcionalmente paginados, incluyendo retroalimentación si es aplicable.
     * @async
     * @param {UUID} req_user_id - El ID del usuario que hace la solicitud para garantizar el acceso al chat.
     * @param {UUID} chat_id - El ID del chat desde el que se recuperan los mensajes.
     * @param {number} [page] - Número de página opcional para la paginación.
     * @returns {Promise<Array<Object>>} - Un array de objetos de mensaje, incluyendo retroalimentación y calificación si están disponibles.
     */
    getMessages(req_user_id, chat_id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            const pageSize = 100;
            if (page) {
                filter = {
                    limit: 100,
                    offset: (page - 1) * pageSize
                };
            }
            if (chat_id) {
                const chat = yield Chat.findOne({ where: { id: chat_id, user_id: req_user_id } });
                if (chat) {
                    const messages = yield Message.findAll(Object.assign({ where: { chat_id: chat_id }, order: [['date', 'DESC'], ['id', 'DESC']] }, filter));
                    const messagesWithFeedback = yield Promise.all(messages.map((message) => __awaiter(this, void 0, void 0, function* () {
                        if (message === null || message === void 0 ? void 0 : message.rateable) {
                            const feedback = yield Feedback.findOne({ where: { message_id: message.id } });
                            if (feedback) {
                                message = feedback.rating === "mistake" ? Object.assign(Object.assign({}, message.toJSON()), { feedback: feedback.feedback, rating: feedback.rating }) : Object.assign(Object.assign({}, message.toJSON()), { rating: feedback.rating });
                            }
                        }
                        return message;
                    })));
                    return messagesWithFeedback;
                }
            }
            return [];
        });
    }
    /**
     * Crea un mensaje dentro de un chat. Crea el chat si no existe.
     * @async
     * @param {UUID} req_user_id - El ID del usuario que está creando el mensaje.
     * @param {UUID} chat_id - El ID del chat al que se añade el mensaje.
     * @param {UUID} message_id - El ID del mensaje a crear.
     * @param {string} role - El rol del remitente, puede ser 'user' o 'assistant'.
     * @param {string} text - El texto del mensaje.
     * @returns {Promise<Object>} - Un objeto que contiene el código de respuesta y el mensaje creado.
     */
    createMessage(req_user_id, chat_id, message_id, role, text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(text && text.trim() !== "")) {
                return { code: 400, message: "El texto del mensaje está vacío" };
            }
            if (!(role && role.trim() !== "" && (role === "user" || role === "assistant"))) {
                return { code: 400, message: "Se necesita un rol válido" };
            }
            if (!chat_id) {
                return { code: 400, message: "Se necesita un chat_id válido" };
            }
            let chat = yield Chat.findOne({ where: { id: chat_id } });
            if (!chat) {
                chat = yield Chat.create({
                    id: chat_id,
                    user_id: req_user_id,
                    title: text,
                    creation_date: new Date()
                });
                if (!chat) {
                    return { code: 500, message: "Falló al crear el mensaje" };
                }
            }
            else if (chat.dataValues.user_id !== req_user_id) {
                return { code: 403, message: "No puedes añadir un mensaje a este chat" };
            }
            const findMessage = yield Message.findOne({
                where: {
                    id: message_id,
                    chat_id: chat_id
                }
            });
            if (findMessage) {
                console.log({ code: 200, message: findMessage.toJSON() });
                return { code: 200, message: findMessage.toJSON() };
            }
            const createdMessage = yield Message.create({
                id: message_id,
                chat_id: chat_id,
                role: role,
                text: text,
                rateable: role === "user" ? false : true,
                date: new Date()
            });
            if (!createdMessage) {
                return { code: 500, message: "Falló al crear el mensaje" };
            }
            console.log({ code: 200, message: createdMessage.toJSON() });
            return { code: 200, message: createdMessage.toJSON() };
        });
    }
}
exports.default = MessageService;
