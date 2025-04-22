import WebSocket, { RawData } from 'ws';
import { IncomingMessage } from 'http';
import TokenValidatorInterface from '../auth/TokenValidator/TokenValidatorInterface';
import MessageInterface from '../messages/MessageInterface';
import MessageFactory from '../messages/MessageFactory';
import AuthenticatedWebSocket from '../chat/ChatWebSocket';
import AnswerMessage from '../messages/AnswerMessage';
import { randomUUID } from 'crypto';
import StatusMessage from '../messages/StatusMessage';
import EndMessage from '../messages/EndMessage';

/**
 * Clase que representa un servidor WebSocket.
 */
export default class RemoteDummyWebServer {
    server: WebSocket.Server;
    tokenValidator: TokenValidatorInterface;
    clients: WebSocket[];

    /**
     * Crea una instancia del servidor WebSocket.
     * @param port - El puerto en el que se ejecutará el servidor WebSocket.
     * @param tokenValidator - Instancia del validador de tokens.
     */
    constructor(port: number, tokenValidator: TokenValidatorInterface) {
        this.server = new WebSocket.Server({ port });
        this.tokenValidator = tokenValidator;
        this.clients = [];
    }

    /**
     * Inicia la escucha de conexiones WebSocket.
     */
    listen() {
        this.server.on("connection", async (ws: WebSocket, message: IncomingMessage) => {
            this.handleConnection(ws);
        });

        console.log(`Servidor WebSocket corriendo en ws://localhost:${this.server.options.port}`);
    }

    /**
     * Maneja la conexión de un nuevo cliente WebSocket.
     * @param ws - El cliente AuthenticatedWebSocket conectado.
     */
    handleConnection(ws: AuthenticatedWebSocket) {

        ws.on("message", (socketMessage: RawData) => {
            const message: MessageInterface | null = this.createMessageFromInputData(socketMessage);
            if (message) {
               
                const messageUUID = randomUUID();
               
                // ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "" })))
                // ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"PENSANDO"})))
                // ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "Respuesta parcial desde segundo servidor al mensaje usan" })))

                // ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"Generando nuevo texto..."})))
                // ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "do 2 intervalos para mostrar el valor" })))
                // ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"Finalizando..."})))
             
                // ws.send(JSON.stringify(new EndMessage(messageUUID)))
               
                ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "Segunda respuesta parcial desde segundo servidor al mensaje usan" })))
                
                setTimeout(() => {

                   // const messageUUID = randomUUID();

                    ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "Segunda respuesta parcial desde segundo servidor al mensaje usan" })))

                    setTimeout(() => {
                        ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"Generando nuevo texto..."})))
                    }, 1000)

                    setTimeout(() => {
                        ws.send(JSON.stringify(new AnswerMessage(messageUUID, { text: "do 2 intervalos para mostrar el valor" })))
                    }, 2000)

                    setTimeout(() => {
                        ws.send(JSON.stringify(new StatusMessage(messageUUID, { state:"Finalizando..."})))
                    }, 3000)
                  
                   setTimeout(() => {
                        ws.send(JSON.stringify(new EndMessage(messageUUID)))
                    }, 4000)
                }, 2000)

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
    createMessageFromInputData(socketMessage: RawData): MessageInterface | null {
        const jsonMessage = JSON.parse(socketMessage.toString());
        return MessageFactory.create(jsonMessage);
    }

}
