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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const MessageFactory_1 = __importDefault(require("../messages/MessageFactory"));
const AnswerMessage_1 = __importDefault(require("../messages/AnswerMessage"));
const crypto_1 = require("crypto");
const StatusMessage_1 = __importDefault(require("../messages/StatusMessage"));
const EndMessage_1 = __importDefault(require("../messages/EndMessage"));
/**
 * Clase que representa un servidor WebSocket.
 */
class RemoteDummyWebServer {
    /**
     * Crea una instancia del servidor WebSocket.
     * @param port - El puerto en el que se ejecutará el servidor WebSocket.
     * @param tokenValidator - Instancia del validador de tokens.
     */
    constructor(port, tokenValidator) {
        this.server = new ws_1.default.Server({ port });
        this.tokenValidator = tokenValidator;
        this.clients = [];
    }
    /**
     * Inicia la escucha de conexiones WebSocket.
     */
    listen() {
        this.server.on("connection", (ws, message) => __awaiter(this, void 0, void 0, function* () {
            this.handleConnection(ws);
        }));
        console.log(`Servidor WebSocket corriendo en ws://localhost:${this.server.options.port}`);
    }
    /**
     * Maneja la conexión de un nuevo cliente WebSocket.
     * @param ws - El cliente AuthenticatedWebSocket conectado.
     */
    handleConnection(ws) {
        ws.on("message", (socketMessage) => {
            const message = this.createMessageFromInputData(socketMessage);
            if (message) {
                const messageUUID = (0, crypto_1.randomUUID)();
                // ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "" })))
                // ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"PENSANDO"})))
                // ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "Respuesta parcial desde segundo servidor al mensaje usan" })))
                // ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"Generando nuevo texto..."})))
                // ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "do 2 intervalos para mostrar el valor" })))
                // ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"Finalizando..."})))
                // ws.send(JSON.stringify(new EndMessage(messageUUID)))
                ws.send(JSON.stringify(new AnswerMessage_1.default(messageUUID, { text: "Segunda respuesta parcial desde segundo servidor al mensaje usan" })));
                setTimeout(() => {
                    // const messageUUID = randomUUID();
                    ws.send(JSON.stringify(new AnswerMessage_1.default(messageUUID, { text: "Segunda respuesta parcial desde segundo servidor al mensaje usan" })));
                    setTimeout(() => {
                        ws.send(JSON.stringify(new StatusMessage_1.default(messageUUID, { state: "Generando nuevo texto..." })));
                    }, 1000);
                    setTimeout(() => {
                        ws.send(JSON.stringify(new AnswerMessage_1.default(messageUUID, { text: "do 2 intervalos para mostrar el valor" })));
                    }, 2000);
                    setTimeout(() => {
                        ws.send(JSON.stringify(new StatusMessage_1.default(messageUUID, { state: "Finalizando..." })));
                    }, 3000);
                    setTimeout(() => {
                        ws.send(JSON.stringify(new EndMessage_1.default(messageUUID)));
                    }, 4000);
                }, 2000);
                //setInterval(() => {
                //    ws.send(JSON.stringify(new StatusMessage(messageUUID, { state: "Cambio de estado a " + (new Date().getSeconds() % 2 == 0) })))
                //}, 1000)
            }
        });
        ws.on("close", () => {
            console.log("Cliente desconectado");
        });
    }
    /**
     * Crea un mensaje de los datos sin procesar recibidos por WebSocket.
     * @param socketMessage - Los datos sin procesar recibidos.
     * @returns Una instancia de `MessageInterface` si la extracción es exitosa, de lo contrario, `null`.
     */
    createMessageFromInputData(socketMessage) {
        const jsonMessage = JSON.parse(socketMessage.toString());
        return MessageFactory_1.default.create(jsonMessage);
    }
}
exports.default = RemoteDummyWebServer;
