"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["QUESTION"] = "question";
    MessageType["ANSWER"] = "answer";
    MessageType["PARTIAL_ANSWER"] = "partial_answer";
    MessageType["END"] = "end";
    MessageType["STATUS"] = "status";
    MessageType["UNKNOWN"] = "unknown";
    MessageType["ERROR"] = "error";
})(MessageType || (exports.MessageType = MessageType = {}));
