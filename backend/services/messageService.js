const {Chat, Message, Feedback} = require('../models');
const {Sequelize} = require("sequelize");
const {response} = require("express");

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
    async getMessages(req_user_id, chat_id, page) {

        let filter = {};
        const pageSize = 100;

        if (page) {
            filter = {
                limit: 100,
                offset: (page - 1) * pageSize
            }
        }

        if (chat_id) {
            const chat = await Chat.findOne({where: {id: chat_id, user_id: req_user_id}});

            if (chat) {

                const messages = await Message.findAll({
                    where: {chat_id: chat_id},
                    order: [['date', 'DESC'],["id","DESC"]],
                    ...filter
                });

                const messagesWithFeedback = await Promise.all(messages.map(async (message) => {
                    if (message?.rateable) {
                        const feedback = await Feedback.findOne({where: {message_id: message.id}});
                        if (feedback) {
                            message = feedback.rating == "mistake" ? {
                                ...message.toJSON(),
                                feedback: feedback.feedback,
                                rating: feedback.rating
                            } : {
                                ...message.toJSON(),
                                rating: feedback.rating
                            };
                        }
                    }
                    return message;
                }));

                return messagesWithFeedback;
            }
        }

        return []
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
    async createMessage(req_user_id, chat_id, message_id, role, text) {

        if (!(text && text.trim() !== "")) {
            return {code: 400, message: "El texto del mensaje está vacío"}
        }

        if (!(role && role.trim() !== "" && (role === "user" || role === "assistant"))) {
            return {code: 400, message: "Se necesita un rol valido"}
        }

        if (!chat_id) {
            return {code: 400, message: "Se necesita un chat_id valido"}
        }

        let chat = await Chat.findOne({where: {id: chat_id}});

        if (!chat) {
            chat = await Chat.create({
                id: chat_id,
                user_id: req_user_id,
                title: text,
                creation_date: new Date()
            });

            if (!chat) {
                return {code: 500, message: "Fallo al crear el mensaje"}
            }

        } else if (chat.dataValues.user_id !== req_user_id) {
            return {code: 403, message: "No puedes añadir un mensaje a este chat"}
        }

        const findMesssage = await Message.findOne({
            where: {
                id: message_id,
                chat_id: chat_id
            }
        });

        if (findMesssage) {
            return {code: 200, message: findMesssage.toJSON()};
        }

        const createdMesssage = await Message.create({
            id: message_id,
            chat_id: chat_id,
            role: role,
            text: text,
            rateable: role == "user" ? false : true,
            date: new Date()
        });

        if (!createdMesssage) {
            return {code: 500, message: "Fallo al crear el mensaje"}
        }

        return {code: 200, message: createdMesssage.toJSON()};

    }

}

module.exports = new messageService();
