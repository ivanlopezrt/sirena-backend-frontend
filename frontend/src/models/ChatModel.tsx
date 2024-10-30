import Chat from "./Chat";
import ChatMessage from "./ChatMessage";

/**
 * Clase que implementa la interfaz Chat y representa un modelo de chat.
 */
export class ChatModel implements Chat {
    /**
     * Identificador único del chat.
     */
    id: string;

    /**
     * Identificador del usuario asociado al chat, o null si no está asignado.
     */
    user_id: string | null;

    /**
     * Lista de mensajes en el chat.
     */
    messages: ChatMessage[];

    /**
     * Fecha de creación del chat.
     */
    creation_date: Date;

    /**
     * Título del chat.
     */
    title: string;

    /**
     * Crea una nueva instancia de ChatModel con valores predeterminados.
     */
    constructor() {
        this.id = crypto.randomUUID(); // Genera un ID único para el chat.
        this.user_id = null; // Inicializa el ID del usuario como null.
        this.messages = []; // Inicializa la lista de mensajes como un arreglo vacío.
        this.creation_date = new Date(); // Establece la fecha de creación a la fecha actual.
        this.title = ""; // Inicializa el título como una cadena vacía.
    }
}
