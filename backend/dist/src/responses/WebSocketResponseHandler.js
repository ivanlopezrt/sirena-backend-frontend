"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketResponseHandler {
    constructor(ws) {
        this.ws = ws;
    }
    handle(message) {
        this.ws.send(JSON.stringify(message));
    }
}
exports.default = WebSocketResponseHandler;
