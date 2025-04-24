import WebSocket, { RawData } from 'ws';
import { IncomingMessage } from 'http';
import TokenValidatorInterface from '../auth/TokenValidator/TokenValidatorInterface';
import MessageInterface from '../messages/MessageInterface';
import MessageFactory from '../messages/MessageFactory';
import ChatConfigRetriever from '../chat/ChatConfigRetriever';
import { ChatConfig } from '../chat/ChatConfig';
import ChatWebSocket from '../chat/ChatWebSocket';
import ChatProvider from '../chat/ChatProvider';
import Chat from '../chat/Chat';

/**
 * Clase que representa un servidor WebSocket.
 */
export default class WebSocketServer {
    server: WebSocket.Server;
    tokenValidator: TokenValidatorInterface;
    clients: WebSocket[];

    /**
     * Crea una instancia del servidor WebSocket.
     * @param port - El puerto en el que se ejecutará el servidor WebSocket.
     * @param tokenValidator - Instancia del validador de tokens.
     */
    constructor(tokenValidator: TokenValidatorInterface) {
        this.server = new WebSocket.Server({ noServer:true });
        this.tokenValidator = tokenValidator;
        this.clients = [];
    }

    /**
     * Inicia la escucha de conexiones WebSocket.
     */
    listen() {
        this.server.on("connection", async (ws: WebSocket, message: IncomingMessage) => {

            const config = await this.getChatConfig(message);

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
            const chatWS = ws as ChatWebSocket;
            chatWS.config = config;

            //Creamos el chat (o recuperamos si existe) y añadimos al miembro a ese chat
            const chat: Chat = ChatProvider.getChat(config!)
            chat.addMember(ws);

            this.clients.push(ws);

            this.handleConnection(ws);
        });

        console.log(`Servidor WebSocket corriendo en ws://localhost:${this.server.options.port}`);
    }

    /**
     * Envía un mensaje a todos los clientes conectados.
     * @param message - El mensaje a enviar.
     */
    all(message: MessageInterface) {
        this.clients.forEach(client => client.send(JSON.stringify(message)));
    }

    async getChatConfig(message: IncomingMessage): Promise<ChatConfig> {
        const configRetriever = new ChatConfigRetriever(this.tokenValidator)
        return configRetriever.getChatConfig(message);
    }

    /**
     * Maneja la conexión de un nuevo cliente WebSocket.
     * @param ws - El cliente ChatWebSocket conectado.
     */
    handleConnection(ws: ChatWebSocket) {
        
        ws.on("message", (socketMessage: RawData) => {
            const chat: Chat = ChatProvider.getChat(ws.config!)
            if (chat) {
                const message: MessageInterface | null = this.createMessageFromInputData(socketMessage, ws);
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
    createMessageFromInputData(socketMessage: RawData,from:ChatWebSocket): MessageInterface | null {
        const jsonMessage = JSON.parse(socketMessage.toString());
        return MessageFactory.create(jsonMessage);
    }
}
