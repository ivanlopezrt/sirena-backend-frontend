const {Chat} = require('../models');
const {Sequelize} = require("sequelize");

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
    async getChats(req_user_id) {
        const chats = await Chat.findAll({where: {user_id: req_user_id}});
        return chats;
    }

    /**
     * Retrieves a specific chat for a user by chat ID.
     * @async
     * @param {number} req_user_id - The ID of the user requesting the chat.
     * @param {number} chat_id - The ID of the chat to retrieve.
     * @returns {Promise<Object>} - The chat object if found, otherwise an empty object.
     */
    async getChat(req_user_id, chat_id) {
        if (chat_id) {
            const filters = {id: chat_id, user_id: req_user_id};
            const chat = await Chat.findOne({where: filters});
            if (chat) {
                return chat;
            }
        }
        return {}

    }

    /**
     * Creates a new chat for a user with a specified title.
     * @async
     * @param {number} req_user_id - The ID of the user creating the chat.
     * @param {string} title - The title of the chat.
     * @returns {Promise<Object>} - Object containing the status code and either the created chat or an error message.
     */
    async createChat(req_user_id, title) {

        if (title && title.trim() != '') {

            const createdChat = await Chat.create({
                user_id: req_user_id,
                title: title,
                creation_date: new Date()
            });

            if (!createdChat) {
                return {code: 500, message: "Fallo al crear la conversación"}
            }

            const {user_id, ...chat} = createdChat.toJSON();
            return {code: 200, chat: chat};
        }

        return {code: 400, message: "Se debe de establecer un título para la conversación"}

    }

    /**
     * Deletes a specified chat for a user.
     * @async
     * @param {number} req_user_id - The ID of the user requesting the deletion.
     * @param {number} chat_id - The ID of the chat to delete.
     * @returns {Promise<Object>} - Object containing the status code and message indicating the result of the deletion.
     */
    async deleteChat(req_user_id, chat_id) {

        if (chat_id) {

            const filters = {id: chat_id, user_id: req_user_id};
            const chat = await Chat.findOne({where: filters});

            if (!chat) {
                return {code: 403, message: "No puedes eliminar esta conversación"}
            }

            await Chat.destroy({where: filters});
            return {code: 200, message: "Conversación eliminada"};
        }

        return {code: 400, message: "Se requiere un id de chat"}

    }

}

module.exports = new ChatService();
