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
const messageService = require("../../services/messageService");
const RecognitionResult = require("../RecognitionResult");
/**
 * Class representing a recognizer that interacts with the Ribera API.
 */
class RiberaCodeRecognizer {
    /**
     * Creates an instance of RiberaCodeRecognizer.
     */
    constructor() {
        this._HOST = process.env.RIBERA_HOST;
        process.env.EMAIL_USER;
    }
    /**
     * Sends the latest message and the message history to the Ribera API.
     *
     * @param {Array} messages - An array of message objects, where each object contains role and text.
     * @returns {Promise<RecognitionResult>} The result of the recognition process.
     */
    ask(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const [last_message, ...rest] = messages;
            const new_message = { role: last_message.role, content: last_message.text };
            const history = rest.map(m => {
                return { role: m.role, content: m.text };
            });
            const body = { history: history, new_message: new_message };
            return yield this._request(body);
        });
    }
    /**
     * Sends a request to the Ribera API with the provided body.
     *
     * @param {Object} body - The request body containing message history and the new message.
     * @returns {Promise<RecognitionResult>} The result of the API request.
     * @private
     */
    _request(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this._HOST + "/generate", {
                    method: 'POST',
                    headers: {},
                    body: JSON.stringify(body),
                });
                if (response.ok) {
                    const data = yield response.json();
                    if (data && data.length) {
                        return new RecognitionResult(data[0].generated_text, false);
                    }
                }
                return new RecognitionResult("Lo siento. Algo ha fallado", true);
            }
            catch (_a) {
                return new RecognitionResult("Lo siento. Algo ha fallado", true);
            }
        });
    }
}
module.exports = RiberaCodeRecognizer;
