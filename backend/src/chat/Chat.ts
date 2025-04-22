import ChatWebSocket from "./ChatWebSocket";
import MessageInterface from "../messages/MessageInterface";
import { ChatParameters } from "./ChatParameters";
import { MessageType } from "../messages/MessageType";
import WebSocketClient from "../websocket/WebSocketClient";
import SocketMessageInterface from "../websocket/SocketMessageInterface";
import MessageFactory from "../messages/MessageFactory";
import ChatMessageProcessor from "./ChatMessageProcessor";
import { ChatConfig } from "./ChatConfig";
import QuestionMessage from "../messages/QuestionMessage";

export default class Chat {

    config: ChatConfig;
    members: ChatWebSocket[] = [];
    remoteSocketClient: WebSocketClient;
    messageProcessor:ChatMessageProcessor;

    constructor(config: ChatConfig) {
        this.config = config;
        this.messageProcessor = new ChatMessageProcessor(config);
        //this.remoteSocketClient = new WebSocketClient("ws://localhost:9015")
        this.remoteSocketClient = new WebSocketClient("ws://127.0.0.1:8008/ws")
        this.initializeRemoteClient();
    }

    public getId() {
        return this.config.chatId;
    }

    public addMember(ws: ChatWebSocket) {
        this.members.push(ws);
        ws.on("close", () => this.removeMember(ws))
    }

    public removeMember(ws: ChatWebSocket) {
        this.members = this.members.filter(member => member != ws)
        ws.close();
    }

    public async sendMessage(message: MessageInterface) {
        this.sendMessageToMembers(message);
        await this.processMessage(message);
    }

    private sendMessageToMembers(message: MessageInterface) {
        this.members.forEach(member => member.send(JSON.stringify(message)));
    }

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

    private forwardMessageToRemote(message: QuestionMessage){
        console.log("REDIRIGIENDO MENSAJE a REMOTO")
        this.remoteSocketClient.sendMessage(message);
    }

    public shutdown() {
        this.members.forEach(member => this.removeMember(member));
    }

    private initializeRemoteClient() {
        this.remoteSocketClient.onOpen = this.onClientOpened.bind(this);
        this.remoteSocketClient.onClose = this.onClientClosed.bind(this);
        this.remoteSocketClient.onMessage = this.onMessageReceivedFromRemote.bind(this);

    }

    private onClientOpened() {
        console.log("Cliente remoto conectado");
    }

    private onClientClosed() {
        console.log("Cliente remoto desconectado");
    }

    private onMessageReceivedFromRemote(message: SocketMessageInterface) {
        const responseMessage: MessageInterface | null = this.extractMessage(message);
        if (responseMessage) {
            this.sendMessage(responseMessage);
            console.log("EN¡VIANDO MENSAJE")
            //this.messageProcessor.process(responseMessage);
        }

    }

    extractMessage(socketMessage: SocketMessageInterface): MessageInterface | null {
        console.log("extractMessage",socketMessage);
        const jsonMessage = JSON.parse(socketMessage.toString());
        const message: MessageInterface | null = MessageFactory.create(jsonMessage);
        return message;
    }

}