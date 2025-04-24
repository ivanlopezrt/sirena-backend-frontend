import ChatWebSocket from "./ChatWebSocket";
import MessageInterface from "../messages/MessageInterface";
import { MessageType } from "../messages/MessageType";
import WebSocketClient from "../websocket/WebSocketClient";
import SocketMessageInterface from "../websocket/SocketMessageInterface";
import MessageFactory from "../messages/MessageFactory";
import ChatMessageProcessor from "./ChatMessageProcessor";
import { ChatConfig } from "./ChatConfig";
import QuestionMessage from "../messages/QuestionMessage";
import { RawData } from "ws";

/**
 * Clase principal que gestiona un chat con múltiples miembros y un cliente WebSocket remoto.
 */
export default class Chat {

    config: ChatConfig;
    members: ChatWebSocket[] = [];
    remoteSocketClient: WebSocketClient;
    messageProcessor: ChatMessageProcessor;

    /**
     * Crea una nueva instancia del chat.
     * @param config Configuración del chat.
     */
    constructor(config: ChatConfig) {
        this.config = config;
        this.messageProcessor = new ChatMessageProcessor(config);
        this.remoteSocketClient = new WebSocketClient(process.env.WS_HOST!+"?token="+this.config.token);
        this.initializeRemoteClient();
    }

    /**
     * Obtiene el ID único del chat.
     * @returns ID del chat.
     */
    public getId() {
        return this.config.chatId;
    }

    /**
     * Añade un nuevo miembro al chat.
     * @param ws WebSocket del miembro que se va a añadir.
     */
    public addMember(ws: ChatWebSocket) {
        this.members.push(ws);
        ws.on("close", () => this.removeMember(ws));
    }

    /**
     * Elimina un miembro del chat.
     * @param ws WebSocket del miembro que se va a eliminar.
     */
    public removeMember(ws: ChatWebSocket) {
        this.members = this.members.filter(member => member !== ws);
        ws.close();
    }

    /**
     * Envía un mensaje a todos los miembros y lo procesa.
     * @param message Mensaje a enviar.
     */
    public async sendMessage(message: MessageInterface) {
        this.sendMessageToMembers(message);
        await this.processMessage(message);
    }

    /**
     * Envía un mensaje a todos los miembros conectados al chat.
     * @param message Mensaje a enviar.
     */
    private sendMessageToMembers(message: MessageInterface) {
        this.members.forEach(member => member.send(JSON.stringify(message)));
    }

    /**
     * Procesa un mensaje recibido.
     * Si es una pregunta, también se reenvía al cliente remoto.
     * @param message Mensaje a procesar.
     */
    private async processMessage(message: MessageInterface) {
        switch (message.getType()) {
            case MessageType.QUESTION: {
                await this.messageProcessor.process(message);
                this.forwardMessageToRemote(message as QuestionMessage);
                break;
            }
            default:
                await this.messageProcessor.process(message);
        }
    }

    /**
     * Reenvía un mensaje tipo pregunta al cliente WebSocket remoto.
     * @param message Mensaje tipo pregunta.
     */
    private forwardMessageToRemote(message: QuestionMessage) {
        this.remoteSocketClient.sendMessage(message);
    }

    /**
     * Finaliza el chat y desconecta a todos los miembros.
     */
    public shutdown() {
        this.members.forEach(member => this.removeMember(member));
    }

    /**
     * Inicializa el cliente remoto y sus controladores de eventos.
     */
    private initializeRemoteClient() {
        this.remoteSocketClient.onOpen = this.onClientOpened.bind(this);
        this.remoteSocketClient.onClose = this.onClientClosed.bind(this);
        this.remoteSocketClient.onMessage = this.onMessageReceivedFromRemote.bind(this);
    }

    /**
     * Evento que se dispara cuando el cliente remoto se conecta.
     */
    private onClientOpened() {
        console.log("Cliente remoto conectado");
    }

    /**
     * Evento que se dispara cuando el cliente remoto se desconecta.
     */
    private onClientClosed() {
        console.log("Cliente remoto desconectado");
    }

    /**
     * Maneja los mensajes recibidos desde el cliente remoto.
     * @param message Mensaje recibido del cliente remoto.
     */
    private onMessageReceivedFromRemote(message: RawData) {
        const responseMessage: MessageInterface | null = this.extractMessage(message);
        if (responseMessage) {
            this.sendMessage(responseMessage);
        }
    }

    /**
     * Extrae un mensaje del socket remoto y lo transforma en una instancia de mensaje.
     * @param socketMessage Mensaje del socket remoto.
     * @returns Instancia de MessageInterface o null si no es válido.
     */
    extractMessage(socketMessage: RawData): MessageInterface | null {

        const jsonMessage = JSON.parse(socketMessage.toString());

        const message: MessageInterface | null = MessageFactory.create(jsonMessage);
        return message;
    }

}
