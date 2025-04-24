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
const { Chat, Message, Feedback, EditedAnswer } = require('../src/models');
const { Sequelize } = require("sequelize");
const { response } = require("express");
/**
 * messageService manages messages within chats, allowing for retrieval, creation, and feedback integration.
 */
class messageService {
    /**
     * Retrieves messages for a given chat, optionally paginated, including feedback if applicable.
     * @async
     * @param {number} req_user_id - The ID of the requesting user to ensure chat access.
     * @param {number} chat_id - The ID of the chat from which messages are retrieved.
     * @param {number} [page] - Optional page number for pagination.
     * @returns {Promise<Array<Object>>} - An array of message objects, including feedback and rating if available.
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
                    const messages = yield Message.findAll(Object.assign({ where: { chat_id: chat_id }, order: [['date', 'DESC'], ["id", "DESC"]] }, filter));
                    const enrichedMessages = yield Promise.all(messages.map((message) => __awaiter(this, void 0, void 0, function* () {
                        let messageData = message.toJSON();
                        if (messageData === null || messageData === void 0 ? void 0 : messageData.rateable) {
                            const feedback = yield Feedback.findOne({ where: { message_id: message.id } });
                            if (feedback) {
                                messageData = feedback.rating === "mistake"
                                    ? Object.assign(Object.assign({}, messageData), { feedback: feedback.feedback, rating: feedback.rating }) : Object.assign(Object.assign({}, messageData), { rating: feedback.rating });
                            }
                        }
                        if ((messageData === null || messageData === void 0 ? void 0 : messageData.role) === "assistant") {
                            const responseEdit = yield EditedAnswer.findOne({ where: { message_id: messageData.id } });
                            if (responseEdit) {
                                messageData = Object.assign(Object.assign({}, messageData), { alternative_text: responseEdit.response });
                            }
                        }
                        return messageData;
                    })));
                    return enrichedMessages;
                }
            }
            return [];
        });
    }
    /**
     * Creates a message within a chat. Creates the chat if it does not exist.
     * @async
     * @param {number} req_user_id - The ID of the user creating the message.
     * @param {number} chat_id - The ID of the chat to which the message is added.
     * @param {number} message_id - The ID of the message to be created.
     * @param {string} role - The role of the sender, either 'user' or 'assistant'.
     * @param {string} text - The message text.
     * @returns {Promise<Object>} - An object containing the response code and the created message.
     */
    createMessage(req_user_id, chat_id, message_id, role, text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(text && text.trim() !== "")) {
                return { code: 400, message: "El texto del mensaje está vacío" };
            }
            if (!(role && role.trim() !== "" && (role === "user" || role === "assistant"))) {
                return { code: 400, message: "Se necesita un rol valido" };
            }
            if (!chat_id) {
                return { code: 400, message: "Se necesita un chat_id valido" };
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
                    return { code: 500, message: "Fallo al crear el mensaje" };
                }
            }
            else if (chat.dataValues.user_id !== req_user_id) {
                return { code: 403, message: "No puedes añadir un mensaje a este chat" };
            }
            const findMesssage = yield Message.findOne({
                where: {
                    id: message_id,
                    chat_id: chat_id
                }
            });
            if (findMesssage) {
                return { code: 200, message: findMesssage.toJSON() };
            }
            const createdMesssage = yield Message.create({
                id: message_id,
                chat_id: chat_id,
                role: role,
                text: text,
                rateable: role == "user" ? false : true,
                date: new Date()
            });
            if (!createdMesssage) {
                return { code: 500, message: "Fallo al crear el mensaje" };
            }
            return { code: 200, message: createdMesssage.toJSON() };
        });
    }
    /**
     * Creates a record with the modified message text.
     * @async
     * @param {number} req_user_id: The ID of the user who is going to modify the message text.
     * @param {number} chat_id: The ID of the chat to which the message belongs.
     * @param {number} message_id: The ID of the message whose text we will modify.
     * @param {string} alternative_text: The text of the modified message.
     * @returns {Promise<Object>}: An object containing the response code and the modified message.
     */
    editResponseMessage(req_user_id, chat_id, message_id, alternative_text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(alternative_text && alternative_text.trim() !== "")) {
                return { code: 400, message: "El texto del mensaje está vacío" };
            }
            if (!chat_id) {
                return { code: 400, message: "Se necesita un chat_id valido" };
            }
            let chat = yield Chat.findOne({ where: { id: chat_id } });
            if (!chat) {
                return { code: 500, message: "Fallo al actualizar la respuesta del mensaje" };
            }
            else if (chat.user_id !== req_user_id) {
                return { code: 401, message: "No puedes actualizar la respuesta del mensaje" };
            }
            const findMesssage = yield Message.findOne({
                where: {
                    id: message_id,
                    chat_id: chat_id
                }
            });
            if (!findMesssage) {
                return { code: 500, message: "Fallo al actualizar la respuesta del mensaje" };
            }
            if (findMesssage.role !== 'assistant') {
                return { code: 401, message: "No puedes actualizar la respuesta del mensaje" };
            }
            const createdEditedAnswer = yield EditedAnswer.create({
                message_id: message_id,
                response: alternative_text,
            });
            if (!createdEditedAnswer) {
                return { code: 500, message: "Fallo al crear el mensaje" };
            }
            const enrichedMessages = Object.assign(Object.assign({}, findMesssage.toJSON()), { alternative_text: alternative_text });
            return { code: 200, message: enrichedMessages };
        });
    }
}
module.exports = new messageService();
