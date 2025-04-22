import MessageInterface from "../messages/MessageInterface";

export default interface ResponseHandlerInterface{
    handle(message:MessageInterface):void;
}
