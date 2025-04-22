
import { MessageType } from "./MessageType";
import BaseMessage from "./BaseMessage";
import { UnknownMessageData } from "./UnknownMessageData";
import { UUID } from "../shared/UUIDType";

export default class UnknowMessage extends BaseMessage {
    
    type: MessageType = MessageType.UNKNOWN;
    
    content:UnknownMessageData;

    constructor() {
        super();
        this.content = {content:"Lo siento. No puedo entenderte."};
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
    getContent<T = UnknownMessageData>(): T {
        return this.content as T;
    }
}