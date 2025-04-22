import ResponseHandlerInterface from "../responses/ResponseHandlerInterface";
import MessageInterface from "../messages/MessageInterface";
import MessageHandlerInterface from "./MessageHandlerInterface";
import WebSocketClient from "../websocket/WebSocketClient";
import SocketMessageInterface from "../websocket/SocketMessageInterface";
import MessageFactory from "../messages/MessageFactory";
import { ChatConfig } from "../chat/ChatConfig";

export default class WSRiberaQuestionHandler implements MessageHandlerInterface{
    responseHandler: ResponseHandlerInterface
    remoteClientURL: string
    _client: WebSocketClient;
    chatConfig: ChatConfig;

    constructor(chatConfig:ChatConfig, remoteClientURL: string,responseHandler:ResponseHandlerInterface){
        this.chatConfig = chatConfig;
        this.remoteClientURL = remoteClientURL;
        this.responseHandler = responseHandler;
        this._client = new WebSocketClient(this.remoteClientURL);
        this.initializeRemoteClient();

    }
    
    private initializeRemoteClient(){
        this._client.onOpen = this.onClientOpened.bind(this);
        this._client.onClose = this.onClientClosed.bind(this);
        this._client.onMessage = this.onMessageReceived.bind(this);

    }

    private onClientOpened(){
        console.log("Cliente remoto conectado");
    }

    private onClientClosed(){
        console.log("Cliente remoto desconectado");
    }
    
    private onMessageReceived(message:SocketMessageInterface){
        const extractedMessage: MessageInterface | null  = this.extractMessage(message);
        if(extractedMessage){
            this.responseHandler.handle(extractedMessage)
        }
    }

    handle(message: MessageInterface): void {
        this._client.sendMessage(message);
    }

    extractMessage(socketMessage:SocketMessageInterface):MessageInterface | null{
        const jsonMessage = JSON.parse(socketMessage.toString());
        const message: MessageInterface | null = MessageFactory.create(jsonMessage);
        return message;
    }   

}
 