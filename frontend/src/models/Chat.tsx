/**
 * Interfaz que representa un chat en el sistema.
 */
export default interface Chat {
    /**
     * Identificador único del chat.
     */
    id: string;

    /**
     * Identificador del usuario asociado al chat, o null si no está asignado.
     */
    user_id: string | null;

    /**
     * Título del chat.
     */
    title: string;

    /**
     * Fecha de creación del chat.
     */
    creation_date: Date;
}
