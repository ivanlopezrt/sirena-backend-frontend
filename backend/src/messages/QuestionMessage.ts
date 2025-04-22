import { UUID } from "crypto";
import { MessageType } from "./MessageType";
import { QuestionMessageData } from "./QuestionMessageData";
import BaseMessage from "./BaseMessage";

/**
 * Representa un mensaje de tipo pregunta, extendiendo la funcionalidad de BaseMessage.
 */
export default class QuestionMessage extends BaseMessage {
    
    /** Tipo del mensaje, en este caso, una pregunta. */
    type: MessageType = MessageType.QUESTION;
    
    /** Contenido del mensaje, incluyendo la pregunta y el historial de conversación. */
    content: QuestionMessageData = { question: "", messageId:null};

    /**
     * Crea una nueva instancia de QuestionMessage.
     * @param id - Identificador único del mensaje.
     * @param content - Contenido del mensaje con la pregunta y su historial.
     */
    constructor(id: UUID, content: QuestionMessageData) {
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
     * @returns El tipo del mensaje, en este caso, MessageType.QUESTION.
     */
    getType(): MessageType {
        return this.type;
    }

    /**
     * Obtiene el contenido del mensaje.
     * @returns El contenido del mensaje, de tipo QuestionMessageData.
     */
    getContent<T = QuestionMessageData>(): T {
        return this.content as T;
    }
}