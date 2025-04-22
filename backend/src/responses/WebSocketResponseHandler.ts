import MessageInterface from "../messages/MessageInterface";
import ResponseHandlerInterface from "./ResponseHandlerInterface";
import WebSocket from 'ws';

export default class WebSocketResponseHandler implements ResponseHandlerInterface {

    ws: WebSocket

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    handle(message:MessageInterface): void {
        this.ws.send(JSON.stringify(message));
    }
}
