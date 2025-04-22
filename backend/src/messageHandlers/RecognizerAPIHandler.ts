import { randomUUID, UUID } from "crypto";
import AnswerMessage from "../messages/AnswerMessage";
import QuestionMessage from "../messages/QuestionMessage";
import MessageHandlerInterface from "./MessageHandlerInterface";
import ResponseHandlerInterface from "../responses/ResponseHandlerInterface";
import MessageService from "../services/MessageService";
import { ChatConfig } from "../chat/ChatConfig";

/**
 * Representa un mensaje compatible con la API del reconocedor.
 */
export interface RecognizerAPIMessage {
    role: "user" | "assistant";
    content: string;
}

/**
 * Manejador para procesar mensajes entrantes, enviar solicitudes a la API de generación de respuestas
 * y manejar las respuestas correspondientes.
 */
export default class RecognizerAPIHandler implements MessageHandlerInterface {
    /**
     * Manejador de respuestas que procesa los mensajes salientes.
     */
    responseHandler: ResponseHandlerInterface;

    /**
     * Servicio encargado de gestionar el almacenamiento y recuperación de mensajes.
     */
    messageService: MessageService;

    chatConfig: ChatConfig;

    /**
     * Crea una nueva instancia de RecognizerAPIHandler.
     * 
     * @param responseHandler - Instancia que se encargará de manejar las respuestas.
     */
    constructor(chatConfig: ChatConfig,responseHandler: ResponseHandlerInterface) {
        this.responseHandler = responseHandler;
        this.messageService = new MessageService();
        this.chatConfig = chatConfig;
    }

    /**
     * Maneja un mensaje de pregunta. Guarda el mensaje y realiza una llamada a la API.
     * 
     * @param message - El mensaje de tipo QuestionMessage a procesar.
     */
    async handle(message: QuestionMessage): Promise<void> {
        const createdMessage = await this.createMessage(
            this.chatConfig.ownerId!,
            this.chatConfig.chatId!,
            message.content.messageId!,
            "user",
            message.content.question
        );

        console.log("MENSAJE CREADO",createdMessage)

        if (createdMessage && createdMessage.code == 200) {
            this.callToAPI(message as QuestionMessage);
        } else {
            this.failResponse(createdMessage.message.toString());
        }
    }

    /**
     * Realiza la llamada a la API externa para generar una respuesta basada en el mensaje recibido.
     * 
     * @param message - El mensaje de pregunta que será enviado a la API.
     */
    private async callToAPI(message: QuestionMessage) {
        try {

            console.log("callToAPI",message)
            console.log(JSON.stringify(await this.composeMessageFormatForAPI(message)));

            const response = await fetch("http://cloud.riberadeltajo.es:11200/generate", {
                method: 'POST',
                headers: {},
                body: JSON.stringify(await this.composeMessageFormatForAPI(message)),
            });

            console.log("RESPONSE", response);

            if (response.ok) {
                const data = await response.json();
                if (data && data.length) {
                    const createdAnswerId = await this.saveAnswer(data[0].generated_text);

                    if (createdAnswerId) {
                        this.responseHandler.handle(
                            new AnswerMessage(createdAnswerId, { text: data[0].generated_text })
                        );
                        return;
                    }
                }
            }

            this.failResponse();
        } catch {
            this.failResponse();
        }
    }

    /**
     * Envía una respuesta de error al usuario.
     * 
     * @param message - (Opcional) Mensaje de error personalizado.
     */
    protected failResponse(message?: string): void {
        this.responseHandler.handle(
            new AnswerMessage(randomUUID(), { text: message || "Lo siento. Algo ha fallado" })
        );
    }

    /**
     * Composición del cuerpo del mensaje que será enviado a la API.
     * 
     * @param question - Mensaje original del usuario.
     * @returns Un objeto con el historial de mensajes y el nuevo mensaje.
     */
    protected async composeMessageFormatForAPI(
        question: QuestionMessage
    ): Promise<{ history: any[]; new_message: any }> {
        return {
            history: await this.getChatHistory(question),
            new_message: { role: "user", content: question.getContent().question },
        };
    }

    /**
     * Crea y almacena un nuevo mensaje.
     * 
     * @param userId - ID del usuario.
     * @param chatId - ID del chat.
     * @param messageId - ID del mensaje.
     * @param role - Rol del emisor ("user" o "assistant").
     * @param text - Contenido del mensaje.
     * @returns Resultado de la creación del mensaje.
     */
    protected async createMessage(
        userId: UUID,
        chatId: UUID,
        messageId: UUID,
        role: "user" | "assistant",
        text: string
    ) {
        return await this.messageService.createMessage(userId, chatId, messageId, role, text);
    }

    /**
     * Obtiene el historial de mensajes de un chat, excluyendo el último mensaje.
     * 
     * @param message - Mensaje recibido para el que se obtiene el historial.
     * @returns Arreglo de objetos con el rol y contenido de los mensajes anteriores.
     */
    protected async getChatHistory(message: QuestionMessage) {
        const messages = await this.messageService.getMessages(
            this.chatConfig?.ownerId!,
            this.chatConfig?.chatId!
        );

        const [last_message, ...rest] = messages;
        const history = rest.map((m) => {
            return { role: m.role, content: m.text };
        });

        return history;
    }

    /**
     * Guarda la respuesta generada por la API.
     * 
     * @param message - Mensaje original de pregunta.
     * @param answerText - Texto de la respuesta generada.
     * @returns UUID de la respuesta si se guardó correctamente, o null en caso contrario.
     */
    protected async saveAnswer( answerText: string): Promise<UUID | null> {
        const answerId = randomUUID();
        const createdAnswer = await this.createMessage(
            this.chatConfig.ownerId!,
            this.chatConfig.chatId!,
            answerId,
            "assistant",
            answerText
        );
        if (createdAnswer && createdAnswer.code == 200) {
            return answerId;
        }

        return null;
    }
}
