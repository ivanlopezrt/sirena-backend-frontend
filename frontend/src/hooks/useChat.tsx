import { useCallback, useEffect, useState } from "react";
import Chat from "../models/Chat";
import ChatMessage from "../models/ChatMessage";
import FeedbackService from "../services/FeedbackService";
import { FeedbackRating } from "../models/shared/FeedbackRating";
import DiagnosisService from "../services/DiagnosisService";
import DiagnosticData from "../models/DiagnosticData";
import toast from "react-hot-toast";
import useChatsService from "./useChatsService";

/**
 * Custom hook for managing chat interactions.
 *
 * @param {Chat} activeChat - The active chat object to load and manage messages for.
 * @returns {Object} The chat data and functions to manage the chat.
 */
export default function useChat(activeChat: Chat) {
    const [chat, setChat] = useState<Chat | null>(null);
    const [waitingAnswer, setWaitingAnswer] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const feedbackService: FeedbackService = new FeedbackService();
    const diagnosticService: DiagnosisService = new DiagnosisService();
    const { getMessages, addMessage: addMessageSrv } = useChatsService();

    /**
     * Loads the chat messages for the given chat.
     *
     * @param {Chat} chat - The chat object to load messages for.
     * @returns {Promise<void>}
     */
    const loadChat = useCallback(async (chat: Chat) => {
        try {
            setChat(chat);

            const messages: ChatMessage[] = await getMessages(chat.id);
            if (messages.length === 0) {
                messages.push(createFirstMessage(chat.id));
            }

            setMessages(messages.reverse());
        } catch (error) {
            console.log("loadChat", error);
        }
    }, []);

    /**
     * Adds a new message to the chat.
     *
     * @param {ChatMessage} message - The message to be added.
     * @returns {Promise<void>}
     */
    const addMessage = async (message: ChatMessage) => {
        try {
            setWaitingAnswer(true);
            setMessages([...messages!, message]);
            const createdMessage: ChatMessage = await addMessageSrv(
                message.chat_id,
                message
            );
            setMessages([...messages!, message, createdMessage]);
            setWaitingAnswer(false);
        } catch (err) {
            setWaitingAnswer(false);
            setMessages([
                ...messages!,
                message,
                createErrorMessage(message.chat_id),
            ]);
            console.log("ERROR EN ADDMESSAGE", err);
        }
    };

    /**
     * Updates an existing message in the chat.
     *
     * @param {string} messageId - The ID of the message to be updated.
     * @param {ChatMessage} message - The updated message object.
     * @returns {Promise<void>}
     */
    const updateMessage = async (messageId: string, message: ChatMessage) => {
        try {
            setMessages([
                ...messages.map((m) => {
                    return m.id !== messageId ? m : message;
                }),
            ]);
        } catch (err) {
            console.log("ERROR EN ADDMESSAGE", err);
        }
    };

    /**
     * Sends feedback for a specific message.
     *
     * @param {ChatMessage} message - The message to provide feedback for.
     * @param {FeedbackRating} rate - The rating to give.
     * @param {string} [rightAnswer=""] - Additional feedback information.
     * @returns {Promise<void>}
     */
    const feedback = async (
        message: ChatMessage,
        rate: FeedbackRating,
        rightAnswer: string = ""
    ) => {
        if (message.rating) {
            return;
        }

        const messageBack = await feedbackService.send({
            message_id: message.id,
            chat_id: message.chat_id,
            rating: rate,
            feedback: rightAnswer,
        });
        if (messageBack) {
            updateMessage(message.id, messageBack);
        }
    };

    /**
     * Saves diagnostic data related to a specific message.
     *
     * @param {ChatMessage} message - The message related to the diagnostic data.
     * @param {DiagnosticData} data - The diagnostic data to save.
     * @returns {Promise<void>}
     */
    const diagnose = async (message: ChatMessage, data: DiagnosticData) => {
        data.message_id = message.id;

        try {
            const result = await diagnosticService.save(data);
            if (!result) {
                toast.error("No se ha podido guardar el diagnóstico");
            }

            toast.success("Diagnóstico guardardo");
        } catch {
            toast.error(
                "No se ha podido guardar el diagnóstico. Asegurese de que el DNI sea válido en caso de rellenarlo"
            );
        }
    };

    /**
     * Creates the initial message for a new chat.
     *
     * @param {any} chat_id - The ID of the chat for which to create the first message.
     * @returns {ChatMessage} The created initial message object.
     */
    const createFirstMessage = (chat_id: any): ChatMessage => {
        return {
            id: crypto.randomUUID(),
            userName: "Asistente",
            chat_id: chat_id,
            date: new Date(),
            role: "assistant",
            text: "Hola! ¿en qué puedo ayudarte?",
            rateable: false,
            saved: false,
        };
    };

    /**
     * Creates a generic error message
     *
     * @param {any} chat_id - The ID of the chat for which to create the first message.
     * @returns {ChatMessage} The message to display
     */
    const createErrorMessage = (chat_id: any): ChatMessage => {
        return {
            id: crypto.randomUUID(),
            userName: "Asistente",
            chat_id: chat_id,
            date: new Date(),
            role: "assistant",
            text: "Parece que estoy teniendo problemas. Intenta en un rato tu consulta",
            rateable: false,
            saved: true,
        };
    };

    useEffect(() => {
        loadChat(activeChat);
    }, []);

    return {
        chat,
        loadChat,
        messages,
        addMessage,
        updateMessage,
        feedback,
        diagnose,
        waitingAnswer,
    };
}
