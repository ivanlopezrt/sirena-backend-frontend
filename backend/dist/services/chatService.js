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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const { Chat } = require('../src/models');
const { Sequelize } = require("sequelize");
/**
 * Service for managing chat conversations.
 * @class ChatService
 */
class ChatService {
    /**
     * Retrieves all chats for a specified user.
     * @async
     * @param {number} req_user_id - The ID of the user requesting chats.
     * @returns {Promise<Array<Object>>} - List of chat objects for the user.
     */
    getChats(req_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield Chat.findAll({ where: { user_id: req_user_id } });
            return chats;
        });
    }
    /**
     * Retrieves a specific chat for a user by chat ID.
     * @async
     * @param {number} req_user_id - The ID of the user requesting the chat.
     * @param {number} chat_id - The ID of the chat to retrieve.
     * @returns {Promise<Object>} - The chat object if found, otherwise an empty object.
     */
    getChat(req_user_id, chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chat_id) {
                const filters = { id: chat_id, user_id: req_user_id };
                const chat = yield Chat.findOne({ where: filters });
                if (chat) {
                    return chat;
                }
            }
            return {};
        });
    }
    /**
     * Creates a new chat for a user with a specified title.
     * @async
     * @param {number} req_user_id - The ID of the user creating the chat.
     * @param {string} title - The title of the chat.
     * @returns {Promise<Object>} - Object containing the status code and either the created chat or an error message.
     */
    createChat(req_user_id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (title && title.trim() != '') {
                const createdChat = yield Chat.create({
                    user_id: req_user_id,
                    title: title,
                    creation_date: new Date()
                });
                if (!createdChat) {
                    return { code: 500, message: "Fallo al crear la conversación" };
                }
                const _a = createdChat.toJSON(), { user_id } = _a, chat = __rest(_a, ["user_id"]);
                return { code: 200, chat: chat };
            }
            return { code: 400, message: "Se debe de establecer un título para la conversación" };
        });
    }
    /**
     * Deletes a specified chat for a user.
     * @async
     * @param {number} req_user_id - The ID of the user requesting the deletion.
     * @param {number} chat_id - The ID of the chat to delete.
     * @returns {Promise<Object>} - Object containing the status code and message indicating the result of the deletion.
     */
    deleteChat(req_user_id, chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chat_id) {
                const filters = { id: chat_id, user_id: req_user_id };
                const chat = yield Chat.findOne({ where: filters });
                if (!chat) {
                    return { code: 403, message: "No puedes eliminar esta conversación" };
                }
                yield Chat.destroy({ where: filters });
                return { code: 200, message: "Conversación eliminada" };
            }
            return { code: 400, message: "Se requiere un id de chat" };
        });
    }
}
module.exports = new ChatService();
