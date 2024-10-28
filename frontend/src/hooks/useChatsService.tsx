import IRequesterResponse from "../requester/RequesterResponse";
import useRequest from "./useRequest";
import Chat from "../models/Chat";
import ChatMessage from "../models/ChatMessage";

/**
 * Custom hook for interacting with chat-related API endpoints.
 *
 * @returns {Object} The service methods for chat operations.
 */
export default function useChatsService() {
    const { get, post, remove } = useRequest();

    /**
     * Fetches a list of chats.
     *
     * @returns {Promise<Chat[]>} The list of chats.
     * @throws Will throw an error if the request fails.
     */
    const list = async (): Promise<Chat[]> => {
        const response: IRequesterResponse<Chat[]> = await get("/chat");
        if (response.success) {
            return response.data;
        }
        throw new Error(`Error en la petición: ${response.code}`);
    };

    /**
     * Deletes a specific chat.
     *
     * @param {Chat} chat - The chat to be deleted.
     * @returns {Promise<boolean>} Returns true if the chat was successfully deleted, otherwise false.
     * @throws Will throw an error if the request fails.
     */
    const deleteChat = async (chat: Chat): Promise<boolean> => {
        const response: IRequesterResponse<Chat[]> = await remove(
            `/chat/${chat.id}`
        );
        return response.success;
    };

    /**
     * Fetches messages from a specific chat.
     *
     * @param {any} chat_id - The ID of the chat whose messages are to be fetched.
     * @returns {Promise<ChatMessage[]>} The list of messages for the specified chat.
     * @throws Will throw an error if the request fails.
     */
    const getMessages = async (chat_id: any): Promise<ChatMessage[]> => {
        const response: IRequesterResponse<ChatMessage[]> = await get(
            `/chat/${chat_id}/messages`
        );
        if (response.success) {
            return response.data;
        }
        throw new Error(`Error en la petición: ${response.code}`);
    };

    /**
     * Adds a new message to a specific chat.
     *
     * @param {string} chat_id - The ID of the chat to which the message will be added.
     * @param {ChatMessage} message - The message to be added.
     * @returns {Promise<ChatMessage>} The added message.
     * @throws Will throw an error if the request fails.
     */
    const addMessage = async (
        chat_id: string,
        message: ChatMessage
    ): Promise<ChatMessage> => {
        message.chat_id = chat_id;

        const response: IRequesterResponse<ChatMessage> = await post(
            `/chat/${chat_id}/message`,
            message
        );
        if (response.success) {
            return response.data;
        }
        throw new Error(`Error en la petición: ${response.code}`);
    };

    return { list, deleteChat, getMessages, addMessage };
}
