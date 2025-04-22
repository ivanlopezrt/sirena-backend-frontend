
import { MessageType } from "./MessageType";
import BaseMessage from "./BaseMessage";
import { AnswerMessageData } from "./AnswerMessageData";
import { UUID } from "../shared/UUIDType";

/**
 * Representa un mensaje de respuesta, extendiendo la funcionalidad de BaseMessage.
 */
export default class AnswerMessage extends BaseMessage {
    
    /** Tipo del mensaje, en este caso, una respuesta. */
    type: MessageType = MessageType.ANSWER;
    
    /** Contenido del mensaje, que contiene la respuesta. */
    content: AnswerMessageData = { text: "" };

    /**
     * Crea una nueva instancia de AnswerMessage.
     * @param id - Identificador único del mensaje.
     * @param content - Contenido del mensaje con la respuesta.
     */
    constructor(id: UUID, content: AnswerMessageData) {
        super(id);
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
    getContent<T = AnswerMessageData>(): T {
        return this.content as T;
    }
}