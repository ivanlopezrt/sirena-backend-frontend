"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
/**
 * Clase que representa un cliente WebSocket con capacidad de reenviar mensajes encolados.
 */
class WebSocketClient {
    /**
     * Crea una nueva instancia de WebSocketClient.
     * @param url - URL del servidor WebSocket.
     */
    constructor(url) {
        this.client = new ws_1.default(url);
        this.enqueuedMessages = [];
        this.initialize();
    }
    /**
     * Inicializa los eventos del WebSocket.
     */
    initialize() {
        this.client.on("open", () => {
            var _a;
            console.error("Cliente remoto conectado. Enviando mensajes encolados");
            this.sendEnqueuedMessages();
            (_a = this.onOpen) === null || _a === void 0 ? void 0 : _a.call(this);
        });
        this.client.on("close", () => { var _a; return (_a = this.onClose) === null || _a === void 0 ? void 0 : _a.call(this); });
        this.client.on("message", (message) => { var _a; return (_a = this.onMessage) === null || _a === void 0 ? void 0 : _a.call(this, message); });
        this.client.on("error", console.error);
    }
    /**
     * Envía los mensajes que están en la cola de espera.
     */
    sendEnqueuedMessages() {
        if (this.enqueuedMessages.length) {
            this.enqueuedMessages.forEach((message) => this.sendMessage(message));
        }
        this.enqueuedMessages = [];
    }
    /**
     * Envía un mensaje a través del WebSocket.
     * Si el cliente no está conectado, el mensaje se encola para ser enviado posteriormente.
     * @param message - Mensaje a enviar.
     */
    sendMessage(message) {
        var _a;
        if (this.client.readyState === ws_1.default.OPEN) {
            this.client.send(JSON.stringify(message));
        }
        else {
            (_a = this.onMessage) === null || _a === void 0 ? void 0 : _a.call(this, this.convertMessageToBuffer(new ErrorMessage_1.default("No se puede conectar al servicio de reconocimiento.\nIntente de nuevo pasados unos segundos")));
            this.enqueuedMessages.push(message);
        }
    }
    /**
     * Convierte un mensaje en un buffer de datos.
     *
     * Este método toma un objeto de tipo `MessageInterface`, lo convierte a una cadena JSON
     * y luego lo convierte en un buffer utilizando codificación UTF-8.
     *
     * @param message El mensaje a convertir en buffer. Debe ser un objeto que cumpla con la interfaz `MessageInterface`.
     * @returns Un buffer que contiene el mensaje en formato UTF-8.
     */
    convertMessageToBuffer(message) {
        const stringMessage = JSON.stringify(message);
        return Buffer.from(stringMessage, "utf-8");
    }
}
exports.default = WebSocketClient;
