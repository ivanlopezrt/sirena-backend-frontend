import React, { createContext, useContext } from "react";
import { ChatModel } from "../models/ChatModel";
import Chat from "../models/Chat";
import useChat from "../hooks/useChat";
import ChatMessage from "../models/ChatMessage";
import useChats from "../hooks/useChats";
import { FeedbackRating } from "../models/shared/FeedbackRating";
import DiagnosticData from "../models/DiagnosticData";

const ChatContext = createContext<{
    chat: Chat | null; // Chat activo actualmente.
    messages: ChatMessage[]; // Lista de mensajes del chat.
    setActiveChat: (chat: Chat | null) => void; // Función para establecer el chat activo.
    sendMessage: (message: ChatMessage) => void; // Función para enviar un mensaje.
    createChat: (message: ChatMessage) => void; // Función para crear un nuevo chat.
    deleteChat: (chat: Chat) => void; // Función para eliminar un chat.
    data: Chat[] | undefined; // Lista de todos los chats.
    updateMessage: (messageId: string, message: ChatMessage) => void; // Función para actualizar un mensaje.
    feedback: (
        message: ChatMessage,
        rate: FeedbackRating,
        rightAnswer?: string
    ) => void; // Función para dar feedback sobre un mensaje.
    diagnose: (message: ChatMessage, data: DiagnosticData) => void; // Función para diagnosticar basado en los datos.
    waitingAnswer: boolean; // Estado que indica si se está esperando una respuesta.
}>({
    chat: new ChatModel(),
    messages: [],
    setActiveChat: () => {},
    sendMessage: () => {},
    data: [],
    createChat: () => {},
    deleteChat: () => {},
    updateMessage: () => {},
    feedback: () => {},
    diagnose: () => {},
    waitingAnswer: false,
});

// Proveedor del contexto de chat.
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const {
        chat,
        loadChat,
        messages,
        addMessage,
        updateMessage,
        feedback,
        diagnose,
        waitingAnswer,
    } = useChat(new ChatModel());
    const { data, addChat, removeChat } = useChats();

    /**
     * Establece el chat activo en el contexto.
     * @param chat - Chat que se va a establecer como activo.
     */
    const setActiveChat = (chat: Chat | null) => {
        loadChat(chat!);
    };

    /**
     * Envía un mensaje al chat activo.
     * @param message - Mensaje que se va a enviar.
     */
    const sendMessage = (message: ChatMessage) => {
        if (!existingChat(message.chat_id)) {
            createChat(message);
        }

        addMessage(message);
    };

    /**
     * Verifica si el chat ya existe en la lista de chats.
     * @param chat_id - Identificador del chat a verificar.
     * @returns Verdadero si el chat existe, falso en caso contrario.
     */
    const existingChat = (chat_id: string): boolean => {
        return data ? data.findIndex((c) => c.id === chat_id) >= 0 : false;
    };

    /**
     * Crea un nuevo chat basado en el mensaje recibido.
     * @param message - Mensaje que se utiliza para crear el nuevo chat.
     */
    const createChat = async (message: ChatMessage) => {
        let newChat: Chat = {
            id: message.chat_id,
            user_id: "",
            creation_date: message.date,
            title: message.text,
        };

        addChat(newChat);
    };

    /**
     * Elimina un chat existente.
     * @param chatToRemove - Chat que se va a eliminar.
     */
    const deleteChat = async (chatToRemove: Chat) => {
        await removeChat(chatToRemove); // Elimina el chat de la lista.

        if (chat?.id === chatToRemove.id) {
            setActiveChat(new ChatModel());
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chat,
                messages,
                setActiveChat,
                sendMessage,
                data,
                createChat,
                deleteChat,
                updateMessage,
                feedback,
                diagnose,
                waitingAnswer,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

/**
 * Hook para usar el contexto de chat en los componentes.
 * @returns Contexto de chat.
 */
export const useChatContext = () => useContext(ChatContext);
