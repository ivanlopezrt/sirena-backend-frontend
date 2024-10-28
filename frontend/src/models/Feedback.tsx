import { FeedbackRating } from "./shared/FeedbackRating";

/**
 * Interfaz que representa el feedback proporcionado por un usuario.
 */
export default interface Feedback {
    /**
     * Identificador único del chat asociado al feedback.
     */
    chat_id: string;

    /**
     * Identificador único del mensaje relacionado con el feedback.
     */
    message_id: string;

    /**
     * Valoración del feedback, representada por un objeto FeedbackRating.
     */
    rating: FeedbackRating;

    /**
     * Comentario o mensaje de feedback del usuario.
     */
    feedback: string;
}
