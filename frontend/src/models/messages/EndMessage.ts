
import { MessageType } from "./MessageType";
import BaseMessage from "./BaseMessage";
import { UUID } from "../shared/UUIDType";

export default class EndMessage extends BaseMessage {
    
    type: MessageType = MessageType.END;
    
    content:{};

    constructor(messageId:UUID) {
        super(messageId);
        this.content = {};
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
    getContent<T = {}>(): T {
        return this.content as T;
    }
}