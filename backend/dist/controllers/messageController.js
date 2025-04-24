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
const RecognitionService = require('../code_recognizer/RecognitionService');
const messageService = require('../services/messageService');
exports.getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat_id } = req.params;
        const { page } = req.query;
        const messages = yield messageService.getMessages(req.user.id, chat_id, page);
        res.status(200).json(messages);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat_id } = req.params;
        const { role, text, id } = req.body;
        const response = yield messageService.createMessage(req.user.id, chat_id, id, role, text);
        if (response.code === 200) {
            const messages = (yield messageService.getMessages(req.user.id, chat_id));
            const recognizer = new RecognitionService(req.user.id, chat_id);
            res.status(response.code).json(yield recognizer.recognize(messages));
        }
        else {
            res.status(response.code).json({ message: response.message });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.editResponseMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat_id } = req.params;
        const { id: message_id, alternative_text } = req.body;
        const response = yield messageService.editResponseMessage(req.user.id, chat_id, message_id, alternative_text);
        res.status(response.code).json({ message: response.message });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
