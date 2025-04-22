import { UUID } from "crypto";
import { MessageType } from "./MessageType";
import { StatusMessageData } from "./StatusMessageData";
import BaseMessage from "./BaseMessage";

export default class StatusMessage extends BaseMessage {
    
    /** Tipo del mensaje, en este caso, un estado. */
    type: MessageType = MessageType.STATUS;
    
    /** Contenido del mensaje, incluyendo la pregunta y el historial de conversación. */
    content: StatusMessageData = { state: ""};

    /**
     * Crea una nueva instancia de StatusMessage.
     * @param id - Identificador único del mensaje.
     * @param content - Contenido del mensaje con la pregunta y su historial.
     */
    constructor(id: UUID, content: StatusMessageData) {
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
     * @returns El tipo del mensaje, en este caso, MessageType.STATUS.
     */
    getType(): MessageType {
        return this.type;
    }

    /**
     * Obtiene el contenido del mensaje.
     * @returns El contenido del mensaje, de tipo StatusMessageData.
     */
    getContent<T = StatusMessageData>(): T {
        return this.content as T;
    }
}