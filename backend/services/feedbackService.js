const {Chat, Message, Feedback} = require('../models');
const {Sequelize} = require("sequelize");
const {response} = require("express");

/**
 * feedbackService handles the creation of feedback for messages within chats.
 */
class feedbackService {

    /**
     * Creates feedback for a specific message in a chat.
     * Validates chat, message, and rating values, and checks if feedback already exists.
     * @async
     * @param {number} req_user_id - The ID of the user requesting to add feedback.
     * @param {number} chat_id - The ID of the chat associated with the feedback.
     * @param {number} message_id - The ID of the message being rated.
     * @param {string} user_feedback - Optional text feedback provided by the user.
     * @param {string} rating - The rating for the message, either "success" or "mistake".
     * @returns {Promise<Object>} - An object containing the response code and either a success message with feedback or an error message.
     */
    async createFeedback(req_user_id, chat_id, message_id, user_feedback, rating) {

        if (!chat_id) {
            return {code: 400, message: "Se necesita el id del chat"}
        }

        if (!message_id) {
            return {code: 400, message: "Se necesita el id del mensaje"}
        }

        if (!rating) {
            return {code: 400, message: "Se necesita el valor rating"}
        }

        if (rating !== "success" && rating !== "mistake") {
            return {code: 400, message: "El valor rating no es valido"}
        }

        if (!user_feedback && rating !== "success") {
            return {code: 400, message: "Falta el mensaje de feedback"}
        }

        if (!user_feedback) {
            user_feedback = ""
        }

        const message = await Message.findOne({where: {id: message_id}});

        if (message) {
            const chat = await Chat.findOne({where: {id: message.dataValues.chat_id, user_id: req_user_id}});

            if (!chat || !message.dataValues.rateable) {
                return {code: 403, message: "No puedes añadir feedback a este mensaje"}
            }

            const findFeedback = await Feedback.findOne({
                where: {message_id: message_id}
            });

            if (!findFeedback) {
                const createdFeedback = await Feedback.create({
                    message_id: message_id,
                    feedback: user_feedback,
                    rating: rating,
                });

                if (!createdFeedback) {
                    return {code: 500, message: "Fallo al añadir el feedback al mensaje"}
                }

                const {id, ...feedback} = createdFeedback.toJSON();
                return {code: 200, message: {...message.dataValues, rating: feedback.rating}};
            }

            const {id, ...feedback} = findFeedback.toJSON();
            return {code: 200, message: {...message.dataValues, rating: feedback.rating}};

        }
        return {code: 404, message: "No se ha encontrado el mensaje"}
    }

}

module.exports = new feedbackService();
