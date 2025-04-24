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
const { Chat, Message, Feedback } = require('../src/models');
const { Sequelize } = require("sequelize");
const { response } = require("express");
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
    createFeedback(req_user_id, chat_id, message_id, user_feedback, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chat_id) {
                return { code: 400, message: "Se necesita el id del chat" };
            }
            if (!message_id) {
                return { code: 400, message: "Se necesita el id del mensaje" };
            }
            if (!rating) {
                return { code: 400, message: "Se necesita el valor rating" };
            }
            if (rating !== "success" && rating !== "mistake") {
                return { code: 400, message: "El valor rating no es valido" };
            }
            if (!user_feedback && rating !== "success") {
                return { code: 400, message: "Falta el mensaje de feedback" };
            }
            if (!user_feedback) {
                user_feedback = "";
            }
            const message = yield Message.findOne({ where: { id: message_id } });
            if (message) {
                const chat = yield Chat.findOne({ where: { id: message.dataValues.chat_id, user_id: req_user_id } });
                if (!chat || !message.dataValues.rateable) {
                    return { code: 403, message: "No puedes añadir feedback a este mensaje" };
                }
                const findFeedback = yield Feedback.findOne({
                    where: { message_id: message_id }
                });
                if (!findFeedback) {
                    const createdFeedback = yield Feedback.create({
                        message_id: message_id,
                        feedback: user_feedback,
                        rating: rating,
                    });
                    if (!createdFeedback) {
                        return { code: 500, message: "Fallo al añadir el feedback al mensaje" };
                    }
                    const _a = createdFeedback.toJSON(), { id } = _a, feedback = __rest(_a, ["id"]);
                    return { code: 200, message: Object.assign(Object.assign({}, message.dataValues), { rating: feedback.rating }) };
                }
                const _b = findFeedback.toJSON(), { id } = _b, feedback = __rest(_b, ["id"]);
                return { code: 200, message: Object.assign(Object.assign({}, message.dataValues), { rating: feedback.rating }) };
            }
            return { code: 404, message: "No se ha encontrado el mensaje" };
        });
    }
}
module.exports = new feedbackService();
