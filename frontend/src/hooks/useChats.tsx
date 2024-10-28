import Chat from "../models/Chat";
import ChatService from "../services/ChatsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to manage chats, including listing, adding, and removing chats.
 *
 * @returns {Object} Contains the chat data, methods to add and remove chats, and query status flags.
 */
export default function useChats() {
    const queryClient = useQueryClient();
    const service: ChatService = new ChatService();

    /**
     * Fetches the list of chats.
     *
     * @returns {Object} Contains the data, loading status, and error status for the chat query.
     */
    const { data, isLoading, isError } = useQuery({
        queryKey: ["chats"],
        queryFn: async () => await service.list(),
    });

    /**
     * Adds a new chat to the cache.
     *
     * @param {Chat} chat - The new chat to add.
     */
    const addChat = (chat: Chat) => {
        queryClient.setQueryData(["chats"], (oldData: Chat[] | undefined) => {
            return oldData ? [...oldData, chat] : [chat];
        });
    };

    /**
     * Removes a chat from the cache and the server.
     *
     * @param {Chat} chat - The chat to remove.
     */
    const removeChat = async (chat: Chat) => {
        if (await service.delete(chat)) {
            queryClient.setQueryData(
                ["chats"],
                (oldData: Chat[] | undefined) => {
                    return oldData
                        ? oldData.filter((c) => c.id !== chat.id)
                        : [];
                }
            );
        }
    };

    return { data, addChat, removeChat, isLoading, isError };
}
