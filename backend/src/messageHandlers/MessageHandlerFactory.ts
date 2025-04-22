import WebSocketResponseHandler from "../responses/WebSocketResponseHandler";
import MessageInterface from "../messages/MessageInterface";
import { MessageType } from "../messages/MessageType";
import MessageHandlerInterface from "./MessageHandlerInterface";
import WebSocket from 'ws';
import UnknownMessageHandler from "./UnknownMessageHandler";
import RecognizerAPIHandler from "./RecognizerAPIHandler";
import WSRiberaQuestionHandler from "./WSRiberaQuestionHandler";
import { ChatConfig } from "../chat/ChatConfig";

export default class MessageHandlerFactory{

    ws: WebSocket

    constructor(ws: WebSocket){
        this.ws = ws;
    }

    createFor(message:MessageInterface, chatConfig:ChatConfig): MessageHandlerInterface{
        
        switch(message.getType()){
            case MessageType.QUESTION:
                return new RecognizerAPIHandler(chatConfig, new WebSocketResponseHandler(this.ws))
               //return new WSRiberaQuestionHandler (chatConfig,"ws://localhost:9015",new WebSocketResponseHandler(this.ws))

            default:
                return new UnknownMessageHandler(new WebSocketResponseHandler(this.ws))
        }
    }
}