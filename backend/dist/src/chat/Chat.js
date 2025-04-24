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
const MessageType_1 = require("../messages/MessageType");
const WebSocketClient_1 = __importDefault(require("../websocket/WebSocketClient"));
const MessageFactory_1 = __importDefault(require("../messages/MessageFactory"));
const ChatMessageProcessor_1 = __importDefault(require("./ChatMessageProcessor"));
/**
 * Clase principal que gestiona un chat con múltiples miembros y un cliente WebSocket remoto.
 */
class Chat {
    /**
     * Crea una nueva instancia del chat.
     * @param config Configuración del chat.
     */
    constructor(config) {
        this.members = [];
        this.config = config;
        this.messageProcessor = new ChatMessageProcessor_1.default(config);
        this.remoteSocketClient = new WebSocketClient_1.default(process.env.WS_HOST + "?token=" + this.config.token);
        this.initializeRemoteClient();
    }
    /**
     * Obtiene el ID único del chat.
     * @returns ID del chat.
     */
    getId() {
        return this.config.chatId;
    }
    /**
     * Añade un nuevo miembro al chat.
     * @param ws WebSocket del miembro que se va a añadir.
     */
    addMember(ws) {
        this.members.push(ws);
        ws.on("close", () => this.removeMember(ws));
    }
    /**
     * Elimina un miembro del chat.
     * @param ws WebSocket del miembro que se va a eliminar.
     */
    removeMember(ws) {
        this.members = this.members.filter(member => member !== ws);
        ws.close();
    }
    /**
     * Envía un mensaje a todos los miembros y lo procesa.
     * @param message Mensaje a enviar.
     */
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendMessageToMembers(message);
            yield this.processMessage(message);
        });
    }
    /**
     * Envía un mensaje a todos los miembros conectados al chat.
     * @param message Mensaje a enviar.
     */
    sendMessageToMembers(message) {
        this.members.forEach(member => member.send(JSON.stringify(message)));
    }
    /**
     * Procesa un mensaje recibido.
     * Si es una pregunta, también se reenvía al cliente remoto.
     * @param message Mensaje a procesar.
     */
    processMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (message.getType()) {
                case MessageType_1.MessageType.QUESTION: {
                    yield this.messageProcessor.process(message);
                    this.forwardMessageToRemote(message);
                    break;
                }
                default:
                    yield this.messageProcessor.process(message);
            }
        });
    }
    /**
     * Reenvía un mensaje tipo pregunta al cliente WebSocket remoto.
     * @param message Mensaje tipo pregunta.
     */
    forwardMessageToRemote(message) {
        this.remoteSocketClient.sendMessage(message);
    }
    /**
     * Finaliza el chat y desconecta a todos los miembros.
     */
    shutdown() {
        this.members.forEach(member => this.removeMember(member));
    }
    /**
     * Inicializa el cliente remoto y sus controladores de eventos.
     */
    initializeRemoteClient() {
        this.remoteSocketClient.onOpen = this.onClientOpened.bind(this);
        this.remoteSocketClient.onClose = this.onClientClosed.bind(this);
        this.remoteSocketClient.onMessage = this.onMessageReceivedFromRemote.bind(this);
    }
    /**
     * Evento que se dispara cuando el cliente remoto se conecta.
     */
    onClientOpened() {
        console.log("Cliente remoto conectado");
    }
    /**
     * Evento que se dispara cuando el cliente remoto se desconecta.
     */
    onClientClosed() {
        console.log("Cliente remoto desconectado");
    }
    /**
     * Maneja los mensajes recibidos desde el cliente remoto.
     * @param message Mensaje recibido del cliente remoto.
     */
    onMessageReceivedFromRemote(message) {
        const responseMessage = this.extractMessage(message);
        if (responseMessage) {
            this.sendMessage(responseMessage);
        }
    }
    /**
     * Extrae un mensaje del socket remoto y lo transforma en una instancia de mensaje.
     * @param socketMessage Mensaje del socket remoto.
     * @returns Instancia de MessageInterface o null si no es válido.
     */
    extractMessage(socketMessage) {
        const jsonMessage = JSON.parse(socketMessage.toString());
        const message = MessageFactory_1.default.create(jsonMessage);
        return message;
    }
}
exports.default = Chat;
