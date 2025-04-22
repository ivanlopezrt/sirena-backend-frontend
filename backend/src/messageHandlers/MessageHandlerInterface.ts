import ResponseHandlerInterface from "../responses/ResponseHandlerInterface";
import MessageInterface from "../messages/MessageInterface";

export default interface MessageHandlerInterface
{
    handle<T>(message:MessageInterface):void;
}