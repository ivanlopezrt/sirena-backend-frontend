"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IncomingMessageParamRetriever {
    constructor(message) {
        this.message = message;
    }
    retrieve(param) {
        const queryString = this.message.url;
        const url = new URL(queryString ? queryString : "", "https://localhost");
        return url.searchParams.get(param);
    }
}
exports.default = IncomingMessageParamRetriever;
