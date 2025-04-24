
import { MessageType } from "./MessageType";
import BaseMessage from "./BaseMessage";
import { UnknownMessageData } from "./UnknownMessageData";
import { UUID } from "../shared/UUIDType";
import { ErrorMessageData } from "./ErrorMessageData";

export default class ErrorMessage extends BaseMessage {
    
    type: MessageType = MessageType.ERROR;
    
    content:ErrorMessageData;

    constructor(content:ErrorMessageData = {description:"Lo siento. Ha ocurrido un error."}) {
        super();
        this.content = content;
    }

    /**
     * Obtiene el identificador del mensaje.
     * @returns El UUID del mensaje.
     */
    getId(): UUID {
        return this.id;
    }
    
    /**
     * Obtiene el tipo del mensaje.
     * @returns El tipo del mensaje, en este caso, MessageType.ANSWER.
     */
    getType(): MessageType {
        return this.type;
    }

    /**
     * Obtiene el contenido del mensaje.
     * @returns El contenido del mensaje, de tipo AnswerMessageData.
     */
    getContent<T = ErrorMessageData>(): T {
        return this.content as T;
    }
}