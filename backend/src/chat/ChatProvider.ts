import Chat from "./Chat";
import { ChatConfig } from "./ChatConfig";

/**
 * Proveedor estático para gestionar instancias de {@link Chat}.
 * 
 * Esta clase mantiene un registro interno de los chats activos, accediendo o
 * creando nuevas instancias según sea necesario usando un ID único de chat.
 */
export default class ChatProvider {

    /**
     * Diccionario estático que almacena las instancias de {@link Chat} asociadas
     * con sus respectivos IDs.
     * 
     * @private
     */
    private static _chats: { [key: string]: Chat } = {};

    /**
     * Obtiene una instancia de {@link Chat} basada en los parámetros proporcionados.
     * Si no existe una instancia con el `chatId` especificado, se crea una nueva.
     * 
     * @param parameters - Parámetros necesarios para obtener o crear un chat.
     * @returns Una instancia de {@link Chat}.
     */
    static getChat(config: ChatConfig): Chat {
        let chat = this._chats[config.chatId!] || new Chat(config);
        this._chats[config.chatId!] = chat;
        return chat;
    }
}
