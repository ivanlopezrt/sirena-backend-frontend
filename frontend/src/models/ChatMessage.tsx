import { FeedbackRating } from "./shared/FeedbackRating";

/**
 * Interfaz que representa un mensaje en un chat.
 */
export default interface ChatMessage {
    /**
     * Identificador único del chat al que pertenece el mensaje.
     */
    chat_id: string;

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
     * Rol del usuario que envió el mensaje, que puede ser "assistant" o "user".
     */
    role: "assistant" | "user";

    /**
     * Texto del mensaje enviado.
     */
    text: string;

    /**
     * Indica si el mensaje es calificable.
     */
    rateable: boolean;

    /**
     * Valoración del mensaje, representada por un objeto FeedbackRating (opcional).
     */
    rating?: FeedbackRating;

    /**
     * Comentario de feedback del usuario, o null si no hay feedback (opcional).
     */
    feedback?: string | null;

    /**
     * Indica si el mensaje ha sido guardado o no.
     */
    saved: boolean | null;
}
