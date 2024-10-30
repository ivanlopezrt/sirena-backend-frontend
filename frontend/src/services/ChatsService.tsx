import Requester from "../requester/Requester";
import IRequesterResponse from "../requester/RequesterResponse";
import Authorizer from "../auth/impl/Authorizer";
import Chat from "../models/Chat";
import ChatMessage from "../models/ChatMessage";
import StoragerFactory from "../storage/StoragerFactory";

/**
 * Service for managing chat data and messages.
 */
export default class ChatService {
    private requester: Requester;
    private authorizer: Authorizer;

    /**
     * Creates an instance of ChatService.
     */
    constructor() {
        this.authorizer = new Authorizer(StoragerFactory.defaultStorager());
        this.requester = new Requester(this.authorizer);
    }

    /**
     * Fetches a list of all chats.
     * 
     * @returns {Promise<Chat[]>} - A promise that resolves to an array of Chat objects.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async list(): Promise<Chat[]> {
        const response: IRequesterResponse<Chat[]> = await this.requester.get("/chat");

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }

    /**
     * Deletes a specific chat.
     * 
     * @param {Chat} chat - The chat to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if the chat was successfully deleted.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async delete(chat: Chat): Promise<boolean> {
        const response: IRequesterResponse<Chat[]> = await this.requester.delete(`/chat/${chat.id}`);
        return response.success;
    }

    /**
     * Fetches messages for a specific chat.
     * 
     * @param {any} chat_id - The ID of the chat for which to retrieve messages.
     * @returns {Promise<ChatMessage[]>} - A promise that resolves to an array of ChatMessage objects.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async getMessages(chat_id: any): Promise<ChatMessage[]> {
        const response: IRequesterResponse<ChatMessage[]> = await this.requester.get(`/chat/${chat_id}/messages`);

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }

    /**
     * Adds a message to a specific chat.
     * 
     * @param {string} chat_id - The ID of the chat to which the message will be added.
     * @param {ChatMessage} message - The message to add to the chat.
     * @returns {Promise<ChatMessage>} - A promise that resolves to the added ChatMessage object.
     * @throws {Error} - Throws an error if the request is unsuccessful.
     */
    async addMessage(chat_id: string, message: ChatMessage): Promise<ChatMessage> {
        message.chat_id = chat_id;

        const response: IRequesterResponse<ChatMessage> = await this.requester.post(`/chat/${chat_id}/message`, message);

        if (response.success) {
            return response.data;
        }

        throw new Error(`Error en la petición: ${response.code}`);
    }
}
