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
const ChatConfigRetriever_1 = __importDefault(require("../chat/ChatConfigRetriever"));
const ChatProvider_1 = __importDefault(require("../chat/ChatProvider"));
/**
 * Clase que representa un servidor WebSocket.
 */
class WebSocketServer {
    /**
     * Crea una instancia del servidor WebSocket.
     * @param port - El puerto en el que se ejecutará el servidor WebSocket.
     * @param tokenValidator - Instancia del validador de tokens.
     */
    constructor(tokenValidator) {
        this.server = new ws_1.default.Server({ noServer: true });
        this.tokenValidator = tokenValidator;
        this.clients = [];
    }
    /**
     * Inicia la escucha de conexiones WebSocket.
     */
    listen() {
        this.server.on("connection", (ws, message) => __awaiter(this, void 0, void 0, function* () {
            const config = yield this.getChatConfig(message);
            if (!config.ownerId) {
                console.log("Conexión rechazada: Token inválido");
                ws.close();
                return;
            }
            if (!config.chatId) {
                console.log("Conexión rechazada: Chat no válido");
                ws.close();
                return;
            }
            //Seteamos la config en el ws
            const chatWS = ws;
            chatWS.config = config;
            //Creamos el chat (o recuperamos si existe) y añadimos al miembro a ese chat
            const chat = ChatProvider_1.default.getChat(config);
            chat.addMember(ws);
            this.clients.push(ws);
            this.handleConnection(ws);
        }));
        console.log(`Servidor WebSocket corriendo en ws://localhost:${this.server.options.port}`);
    }
    /**
     * Envía un mensaje a todos los clientes conectados.
     * @param message - El mensaje a enviar.
     */
    all(message) {
        this.clients.forEach(client => client.send(JSON.stringify(message)));
    }
    getChatConfig(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const configRetriever = new ChatConfigRetriever_1.default(this.tokenValidator);
            return configRetriever.getChatConfig(message);
        });
    }
    /**
     * Maneja la conexión de un nuevo cliente WebSocket.
     * @param ws - El cliente ChatWebSocket conectado.
     */
    handleConnection(ws) {
        ws.on("message", (socketMessage) => {
            const chat = ChatProvider_1.default.getChat(ws.config);
            if (chat) {
                const message = this.createMessageFromInputData(socketMessage, ws);
                if (message) {
                    chat.sendMessage(message);
                }
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
    createMessageFromInputData(socketMessage, from) {
        const jsonMessage = JSON.parse(socketMessage.toString());
        return MessageFactory_1.default.create(jsonMessage);
    }
}
exports.default = WebSocketServer;
