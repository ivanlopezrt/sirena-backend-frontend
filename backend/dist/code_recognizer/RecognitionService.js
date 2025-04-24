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
const messageService = require("../services/messageService");
const RiberaCodeRecognizer = require("./ribera/RiberaCodeRecognizer");
const crypto = require('crypto');
/**
 * Service to handle recognition of messages using Ribera Code Recognizer.
 */
class RecognitionService {
    /**
     * Service to handle recognition of messages using Ribera Code Recognizer.
     */
    constructor(userId, chatId) {
        this.recognizer = new RiberaCodeRecognizer();
        this.userId = userId;
        this.chatId = chatId;
        this.defaultErrorMessage = {
            id: crypto.randomUUID(),
            chat_id: chatId,
            role: "assistant",
            text: "Vaya... parece que estoy teniendo problemas en este momento...\nInténtalo de nuevo más tarde",
            rateable: false,
            date: new Date()
        };
    }
    /**
     * Recognizes and processes messages.
     * @param {Array} messages - The array of messages to be processed.
     * @returns {Promise<Object>} The assistant's response message or an error message.
     */
    recognize(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const recognitionResult = yield this.recognizer.ask(messages);
            if (!recognitionResult.error) {
                const assistantMessage = yield messageService.createMessage(this.userId, this.chatId, crypto.randomUUID(), "assistant", recognitionResult.message);
                return assistantMessage.message;
            }
            return this.defaultErrorMessage;
        });
    }
}
module.exports = RecognitionService;
