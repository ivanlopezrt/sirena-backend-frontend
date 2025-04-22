import WebSocket from 'ws';
import SocketMessageInterface from './SocketMessageInterface';
import MessageInterface from '../messages/MessageInterface';

/**
 * Clase que representa un cliente WebSocket con capacidad de reenviar mensajes encolados.
 */
export default class WebSocketClient {

    /** Cliente WebSocket. */
    client: WebSocket;
    
    /** Callback opcional que se ejecuta cuando la conexión se abre. */
    onOpen?: () => void;
    
    /** Callback opcional que se ejecuta cuando la conexión se cierra. */
    onClose?: () => void;
    
    /** Callback opcional que se ejecuta cuando se recibe un mensaje. */
    onMessage?: (message: SocketMessageInterface) => void;
    
    /** Cola de mensajes en espera de ser enviados. */
    enqueuedMessages: MessageInterface[];

    /**
     * Crea una nueva instancia de WebSocketClient.
     * @param url - URL del servidor WebSocket.
     */
    constructor(url: string) {
        this.client = new WebSocket(url);
        this.enqueuedMessages = []; 
        this.initialize();
    }

    /**
     * Inicializa los eventos del WebSocket.
     */
    initialize() {
        this.client.on("open", () => {
            console.error("Cliente remoto conectado. Enviando mensajes encolados");
            this.sendEnqueuedMessages();
            this.onOpen?.();
        });
        this.client.on("close", () => this.onClose?.());
        this.client.on("message", (message: SocketMessageInterface) => this.onMessage?.(message));
        this.client.on("error", console.error);
    }

    /**
     * Envía los mensajes que están en la cola de espera.
     */
    sendEnqueuedMessages() {
        if (this.enqueuedMessages.length) {
            this.enqueuedMessages.forEach((message: MessageInterface) => this.sendMessage(message));
        }
        this.enqueuedMessages = [];
    }

    /**
     * Envía un mensaje a través del WebSocket.
     * Si el cliente no está conectado, el mensaje se encola para ser enviado posteriormente.
     * @param message - Mensaje a enviar.
     */
    sendMessage(message: MessageInterface) {
        if (this.client.readyState === WebSocket.OPEN) {
            this.client.send(JSON.stringify(message));
        } else {
            this.enqueuedMessages.push(message);
            console.error("El cliente no está conectado. El mensaje será enviado al terminar de conectar");
        }
    }
}
