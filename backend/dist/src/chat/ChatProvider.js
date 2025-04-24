"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_1 = __importDefault(require("./Chat"));
/**
 * Proveedor estático para gestionar instancias de {@link Chat}.
 *
 * Esta clase mantiene un registro interno de los chats activos, accediendo o
 * creando nuevas instancias según sea necesario usando un ID único de chat.
 */
class ChatProvider {
    /**
     * Obtiene una instancia de {@link Chat} basada en los parámetros proporcionados.
     * Si no existe una instancia con el `chatId` especificado, se crea una nueva.
     *
     * @param parameters - Parámetros necesarios para obtener o crear un chat.
     * @returns Una instancia de {@link Chat}.
     */
    static getChat(config) {
        let chat = this._chats[config.chatId] || new Chat_1.default(config);
        this._chats[config.chatId] = chat;
        return chat;
    }
}
/**
 * Diccionario estático que almacena las instancias de {@link Chat} asociadas
 * con sus respectivos IDs.
 *
 * @private
 */
ChatProvider._chats = {};
exports.default = ChatProvider;
