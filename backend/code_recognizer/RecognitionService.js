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
        }
    }

    /**
     * Recognizes and processes messages.
     * @param {Array} messages - The array of messages to be processed.
     * @returns {Promise<Object>} The assistant's response message or an error message.
     */
    async recognize(messages) {

        const recognitionResult = await this.recognizer.ask(messages);

        if(!recognitionResult.error){
            const assistantMessage = await messageService.createMessage(this.userId, this.chatId, crypto.randomUUID(), "assistant", recognitionResult.message);
            return assistantMessage.message;
        }

        return this.defaultErrorMessage;
    }

}

module.exports = RecognitionService;
