import ResponseHandlerInterface from "../responses/ResponseHandlerInterface";
import MessageInterface from "../messages/MessageInterface";
import MessageHandlerInterface from "./MessageHandlerInterface";
import UnknowMessage from "../messages/UnknowMessage";

export default class UnknownMessageHandler implements MessageHandlerInterface{
    responseHandler: ResponseHandlerInterface

    constructor(responseHandler: ResponseHandlerInterface){
        this.responseHandler = responseHandler;
    }

    handle(message: MessageInterface): void {
        this.responseHandler.handle(new UnknowMessage());
    }

}
 