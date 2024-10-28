import { Role } from "./Role";

/**
 * Interfaz que representa un mensaje en un chat.
 */
export interface ChatMessageModel {
    /**
     * Identificador único del chat al que pertenece el mensaje.
     */
    chat_id: string | number;

    /**
     * Identificador único del mensaje.
     */
    id: string;

    /**
     * Nombre del usuario que envió el mensaje.
     */
    userName: string;

    /**
     * Fecha en que se envió el mensaje.
     */
    date: Date;

    /**
     * Rol del usuario que envió el mensaje, representado por un objeto Role.
     */
    role: Role;

    /**
     * Texto del mensaje enviado.
     */
    text: string;

    /**
     * Indica si el mensaje es calificable.
     */
    rateable: boolean;
}
