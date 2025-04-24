import { useCallback, useEffect, useRef, useState } from "react";
import Chat from "../models/Chat";
import ChatMessage from "../models/ChatMessage";
import FeedbackService from "../services/FeedbackService";
import { FeedbackRating } from "../models/shared/FeedbackRating";
import DiagnosisService from "../services/DiagnosisService";
import DiagnosticData from "../models/DiagnosticData";
import toast from "react-hot-toast";
import useChatsService from "./useChatsService";
import useAuth from "./useAuth";
import SocketMessageInterface from "../models/messages/SocketMessageInterface";
import MessageFactory from "../models/messages/MessageFactory";
import AnswerMessage from "../models/messages/AnswerMessage";
import { MessageType } from "../models/messages/MessageType";
import QuestionMessage from "../models/messages/QuestionMessage";
import EndMessage from "../models/messages/EndMessage";
import StatusMessage from "../models/messages/StatusMessage";
import UnknowMessage from "../models/messages/UnknowMessage";
import { v4 as uuidv4 } from 'uuid';
import { UUID } from "../models/shared/UUIDType";
import ErrorMessage from "../models/messages/ErrorMessage";

/**
 * Custom hook for managing chat interactions.
 *
 * @param {Chat} activeChat - The active chat object to load and manage messages for.
 * @returns {Object} The chat data and functions to manage the chat.
 */
export enum CONNECTION_STATE {
    CONNECTED = 1,
    DISCONNECTED = 2
}

export type ChatStatus = {
    description: string;
    allowQuestions: boolean;
}

export default function useWebSocketChat(activeChat: Chat) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [waitingAnswer, setWaitingAnswer] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const feedbackService: FeedbackService = new FeedbackService();
    const diagnosticService: DiagnosisService = new DiagnosisService();
    const { getMessages, editResponseMessage: editResponseMessageSrv } = useChatsService();
    const { token } = useAuth();
    const socketMessagesRef = useRef<ChatMessage[]>([]);
    const [status, setStatus] = useState<ChatStatus>({ description: "", allowQuestions: true });
    const [connectionState, setConnectionState] = useState<CONNECTION_STATE>(CONNECTION_STATE.DISCONNECTED);
    const WS_HOST = process.env.REACT_APP_WS_HOST!

    /**
     * Loads the chat messages for the given chat.
     *
     * @param {Chat} chat - The chat object to load messages for.
     * @returns {Promise<void>}
     */
    const loadChat = useCallback(async (chat: Chat) => {
        try {
            setChat(chat);
            clearMessages();

            const messages: ChatMessage[] = await getMessages(chat.id);
            if (messages.length === 0) {
                messages.push(createFirstMessage(chat.id));
            }

            setMessages(messages.reverse());
            socketMessagesRef.current = messages;
        } catch (error) {
            console.log("loadChat", error);
        }
    }, []);

    /**
     * Clears all messages from the internal socket message reference.
     */
    const clearMessages = () => {
        socketMessagesRef.current = [];
    }

    /**
     * Adds a new message to the chat.
     *
     * @param {ChatMessage} message - The message to be added.
     * @returns {Promise<void>}
     */
    const addMessage = async (message: ChatMessage) => {
        try {
            setWaitingAnswer(true);
            socket?.send(JSON.stringify({ type: "question", content: { chatId: message.chat_id, messageId: crypto.randomUUID(), question: message.text.trim(), history: [] } }));
            setWaitingAnswer(false);
        } catch (err) {
            setWaitingAnswer(false);
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
            setMessages(messages => [
                ...messages.map((m) => {
                    return m.id !== messageId ? m : message;
                }),
            ]);
        } catch (err) {
            console.log("ERROR EN updateMessage", err);
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
     * Save edited message reply.
     *
     * @param {ChatMessage} message - The message with the updated response.
     * @returns {Promise<void>}
     */
    const editResponseMessage = async (message: ChatMessage) => {
        try {
            const result = await editResponseMessageSrv(message.chat_id, message);
            if (!result) {
                toast.error("No se pudo guardar la respuesta editada");
            }

            toast.success("Respuesta editada");
        } catch {
            toast.error("No se pudo guardar la respuesta editada");
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
            alternative_text: "",
            status: "",
            type:MessageType.ANSWER
        };
    };

    /**
     * Adds a message received from the WebSocket to the state.
     *
     * @param {ChatMessage} message - The message to add.
     */
    const addSocketMessage = (message: ChatMessage) => {
        const existingMessage = socketMessagesRef.current.find(m => m.id === message.id);
        if (existingMessage) {
            updateSocketsMessage(message.id, message);
            return;
        }

        socketMessagesRef.current = [...socketMessagesRef.current, message];
        setMessages(socketMessagesRef.current);
    };

    /**
     * Updates a message in the internal socket message list and refreshes state.
     *
     * @param {string} messageId - The ID of the message to update.
     * @param {ChatMessage} message - The updated message.
     */
    const updateSocketsMessage = (messageId: string, message: ChatMessage) => {
        try {
            socketMessagesRef.current = [
                ...socketMessagesRef.current.map((m) => {
                    return m.id !== messageId ? m : message;
                }),
            ];

            setMessages(socketMessagesRef.current);
        } catch (err) {
            console.log("ERROR EN updateSocketsMessage", err);
        }
    };

    /**
     * Handles a socket message received from the server and routes it to the appropriate handler.
     *
     * @param {SocketMessageInterface} socketMessage - The message received from the server.
     */
    const handleReceivedSocketMessage = (socketMessage: SocketMessageInterface) => {
        const message = MessageFactory.create(socketMessage);
        console.log("handleReceivedSocketMessage", message);
        if (message) {
            switch (message.getType()) {
                case MessageType.ANSWER:
                    handleReceivedAnswer(message as AnswerMessage);
                    break;
                case MessageType.QUESTION:
                    handleQuestion(message as QuestionMessage);
                    break;
                case MessageType.STATUS:
                    handleStatusMessage(message as StatusMessage);
                    break;
                case MessageType.END:
                    handleEndMessage(message as EndMessage);
                    break;
                case MessageType.ERROR:
                    handleErrorMessage(message as ErrorMessage);
                    break;
                case MessageType.UNKNOWN:
                    handleUnknowMessage(message as UnknowMessage);
                    break;
            }
        }
    };

        /**
     * Handles an answer message by appending it to the appropriate chat message.
     *
     * @param {ErrorMessage} message - The ErrorMessage message.
     */
        const handleErrorMessage = (message: ErrorMessage) => {
            const newMessage = createChatMessage(
                uuidv4(),
                "assistant",
                message.getContent().description,
                message.getType()
            );
            addSocketMessage({ ...newMessage });
            setStatus({ ...status, allowQuestions: true });
        };

    /**
     * Handles an answer message by appending it to the appropriate chat message.
     *
     * @param {UnknowMessage} message - The Unknown message.
     */
    const handleUnknowMessage = (message: UnknowMessage) => {
        const newMessage = createChatMessage(
            uuidv4(),
            "assistant",
             message.getContent().content,
             message.getType()
        );
        addSocketMessage({ ...newMessage });
        setStatus({ ...status, allowQuestions: true });
    };

    /**
     * Handles a status message received from the server and updates the appropriate UI state.
     *
     * @param {StatusMessage} message - The status message.
     */
    const handleStatusMessage = (message: StatusMessage) => {
        const messageStatus = socketMessagesRef.current.find(m => m.id === message!.getId());
        if (messageStatus) {
            messageStatus.status = message.getContent().state;
            addSocketMessage({ ...messageStatus });
        }

        if (!message!.getId()) {
            setStatus({ ...status, description: message.content.state });
        }
    };

    /**
     * Handles the end message, marking the associated message as rateable.
     *
     * @param {EndMessage} message - The end message.
     */
    const handleEndMessage = (message: EndMessage) => {
        const messageEnded = socketMessagesRef.current.find(m => m.id === message!.getId());
        if (messageEnded) {
            messageEnded.rateable = messageEnded.role === "assistant";
            messageEnded.status = "";
            addSocketMessage({ ...messageEnded });
        }

        setStatus({ ...status, allowQuestions: true });
    };

    /**
     * Handles an answer message by appending it to the appropriate chat message.
     *
     * @param {AnswerMessage} message - The answer message.
     */
    const handleReceivedAnswer = (message: AnswerMessage) => {
        const existingAnswer = socketMessagesRef.current.find(m => m.id === message!.getId());
        const newMessage = createChatMessage(
            message.getId(),
            "assistant",
            existingAnswer ? existingAnswer.text + message.getContent().text : message.getContent().text,
            message.getType()
        );
        addSocketMessage({ ...newMessage });
        setStatus({ ...status, allowQuestions: false });
    };

    /**
     * Handles a user question received from the socket.
     *
     * @param {QuestionMessage} message - The question message.
     */
    const handleQuestion = (message: QuestionMessage) => {
        const question = createChatMessage(message.getId(), "user", message.getContent().question, message.getType());
        addSocketMessage({ ...question });
    };

    /**
     * Creates a new ChatMessage object.
     *
     * @param {UUID} id - The ID of the message.
     * @param {"assistant" | "user"} role - The role of the sender.
     * @param {string} text - The message text.
     * @returns {ChatMessage} The constructed message.
     */
    const createChatMessage = (id: UUID, role: "assistant" | "user" , text: string, type:MessageType): ChatMessage => {
        return {
            chat_id: chat!.id,
            id: id,
            role: role,
            date: new Date(),
            text: text,
            rating: undefined,
            feedback: null,
            saved: true,
            userName: role === "user" ? "Tú" : "Asistent",
            rateable: false,
            alternative_text: "",
            status: "",
            type:type
        };
    };

    /**
     * Establishes a WebSocket connection to the server.
     *
     * @returns {WebSocket} The connected WebSocket instance.
     */
    const connectToWebsocket = (): WebSocket => {
        const ws = new WebSocket(WS_HOST+"?authorization=" + token + "&chatId=" + chat?.id);

        ws.onopen = () => {
            setConnectionState(CONNECTION_STATE.CONNECTED);
        };

        ws.onmessage = (event) => {
            handleReceivedSocketMessage(JSON.parse(event.data));
        };

        ws.onclose = () => {
            setConnectionState(CONNECTION_STATE.DISCONNECTED);
        };

        return ws;
    };

    useEffect(() => {
        loadChat(activeChat);
        return () => {
            setConnectionState(CONNECTION_STATE.DISCONNECTED);
        };
    }, []);

    useEffect(() => {
        if (!token) return;

        const ws = connectToWebsocket();
        setSocket(ws);

        return () => {
            ws.close();
            setStatus({ description: "", allowQuestions: true });
            setConnectionState(CONNECTION_STATE.DISCONNECTED);
            setWaitingAnswer(false);
        };
    }, [token, chat]);

    return {
        chat,
        loadChat,
        messages,
        addMessage,
        updateMessage,
        editResponseMessage,
        feedback,
        diagnose,
        waitingAnswer,
        status,
        connectionState
    };
}
