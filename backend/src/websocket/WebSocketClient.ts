import WebSocket, { RawData } from "ws";
import SocketMessageInterface from "./SocketMessageInterface";
import MessageInterface from "../messages/MessageInterface";
import ErrorMessage from "../messages/ErrorMessage";

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
    onMessage?: (message: RawData) => void;

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
            console.error(
                "Cliente remoto conectado. Enviando mensajes encolados"
            );
            this.sendEnqueuedMessages();
            this.onOpen?.();
        });
        this.client.on("close", () => this.onClose?.());
        this.client.on("message", (message: RawData) =>
            this.onMessage?.(message)
        );
        this.client.on("error", console.error);
    }

    /**
     * Envía los mensajes que están en la cola de espera.
     */
    sendEnqueuedMessages() {
        if (this.enqueuedMessages.length) {
            this.enqueuedMessages.forEach((message: MessageInterface) =>
                this.sendMessage(message)
            );
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
            this.onMessage?.(
                this.convertMessageToBuffer(
                    new ErrorMessage(
                        "No se puede conectar al servicio de reconocimiento.\nIntente de nuevo pasados unos segundos"
                    )
                )
            );
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
    convertMessageToBuffer(message: MessageInterface): RawData {
        const stringMessage = JSON.stringify(message);
        return Buffer.from(stringMessage, "utf-8");
    }
}
