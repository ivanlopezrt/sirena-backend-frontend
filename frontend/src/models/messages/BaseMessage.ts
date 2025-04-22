import MessageInterface from "./MessageInterface";
import { MessageType } from "./MessageType";
import { UUID } from "../shared/UUIDType";

/**
 * Clase base abstracta para representar un mensaje.
 * Proporciona una implementación básica para manejar identificadores de mensajes.
 */
export default abstract class BaseMessage implements MessageInterface {
    /** Identificador único del mensaje. */
    id: UUID;
    timeStamp: number;
    userId?:UUID;

    /**
     * Crea una nueva instancia de BaseMessage.
     * @param messageId - (Opcional) Identificador del mensaje. Si no se proporciona, se genera un UUID aleatorio.
     */
    constructor(messageId?: UUID, userId?:UUID) {
        this.id = messageId ? messageId : "12-12-12-12-12-12";
        this.timeStamp = new Date().getTime();
        this.userId = userId;
    }

    setUserId(uuid: UUID): void {
     this.userId = uuid;
    }
    
    getUserId(): UUID | null {
       return this.userId || null;
    }

    /**
     * Obtiene el identificador del mensaje.
     * @returns El UUID del mensaje.
     */
    getId(): UUID {
        return this.id;
    }

    /**
     * Obtiene el tiempo del mensaje.
     * @returns El tiempo del mensaje.
     */
    getTimeStamp(): number {
        return this.timeStamp;
    }

    /**
     * Obtiene el contenido del mensaje.
     * @returns El contenido del mensaje, con tipo genérico.
     */
    abstract getContent<T>(): T;

    /**
     * Obtiene el tipo del mensaje.
     * @returns El tipo del mensaje definido en MessageType.
     */
    abstract getType(): MessageType;
}
