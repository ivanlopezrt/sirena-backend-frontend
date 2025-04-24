import AnswerMessage from "../messages/AnswerMessage";
import MessageInterface from "../messages/MessageInterface";
import { MessageType } from "../messages/MessageType";
import MessageService from "../services/MessageService";
import { ChatConfig } from "./ChatConfig";
import QuestionMessage from "../messages/QuestionMessage";
import EndMessage from "../messages/EndMessage";

/**
 * Clase encargada de procesar mensajes dentro de un chat, incluyendo preguntas,
 * respuestas (completas o parciales), y mensajes de finalización.
 */
export default class ChatMessageProcessor {

    /**
     * Servicio que permite guardar y recuperar mensajes desde una base de datos o backend.
     */
    private messageService: MessageService;

    /**
     * Configuración del chat, incluyendo información como el ID del chat y el propietario.
     */
    private chatConfig: ChatConfig;

    /**
     * Mapa que mantiene mensajes de respuestas aún no finalizadas, agrupados por ID.
     */
    private nonFinishedMessages = new Map<string, MessageInterface[]>();

    /**
     * Crea una instancia del procesador de mensajes.
     * @param config Configuración del chat.
     */
    constructor(config: ChatConfig) {
        this.chatConfig = config;
        this.messageService = new MessageService();
    }

    /**
     * Procesa un mensaje en función de su tipo (pregunta, respuesta, parcial, o finalización).
     * @param message Mensaje a procesar.
     */
    async process(message: MessageInterface) {
        switch (message.getType()) {
            case MessageType.ANSWER:
            case MessageType.PARTIAL_ANSWER:
                this.addMessageToNonFinished(message);
                break;
            case MessageType.QUESTION:
                await this.handleQuestion(message as QuestionMessage);
                break;
            case MessageType.END:
                await this.processEndMessage(message);
                break;
        }
    }

    /**
     * Maneja un mensaje de tipo pregunta, guardándolo y completando su historial.
     * @param question Pregunta recibida del usuario.
     */
    private async handleQuestion(question: QuestionMessage): Promise<void> {
        await this.saveQuestion(question);
        await this.fillHistory(question);
    }

    /**
     * Procesa un mensaje de tipo END, identificando si cierra una secuencia de respuestas.
     * @param message Mensaje de finalización.
     */
    private async processEndMessage(message: MessageInterface): Promise<void> {
        switch (this.getFinishedMessageType(message)) {
            case MessageType.ANSWER:
                await this.processEndAnswerMessage(message as EndMessage);
        }

        this.finishMessage(message);
    }

    /**
     * Agrega un mensaje parcial o completo a la lista de respuestas no terminadas.
     * @param message Mensaje parcial o completo.
     */
    private addMessageToNonFinished(message: MessageInterface): void {
        const existing = this.nonFinishedMessages.get(message.getId()) || [];
        this.nonFinishedMessages.set(message.getId(), [...existing, message]);
    }
    
    /**
     * Elimina una secuencia de mensajes que ha sido marcada como finalizada.
     * @param message Mensaje de finalización.
     */
    private finishMessage(message: MessageInterface): void {
        this.nonFinishedMessages.delete(message.getId());
    }

    /**
     * Determina qué tipo de mensaje estaba siendo completado por un mensaje END.
     * @param endMessage Mensaje de finalización.
     * @returns Tipo de mensaje finalizado, o UNKNOWN si no hay coincidencias.
     */
    private getFinishedMessageType(endMessage: MessageInterface): MessageType {
        const messages = this.nonFinishedMessages.get(endMessage.getId());
        if (messages && messages[0]) {
            return messages[0].getType();
        }
        return MessageType.UNKNOWN;
    }

    /**
     * Procesa el cierre de una secuencia de respuestas, guardando el mensaje final combinado.
     * @param endMessage Mensaje de finalización de respuesta.
     */
    private async processEndAnswerMessage(endMessage: EndMessage) {
        await this.saveAnswer(endMessage);
    }

    /**
     * Combina y guarda todas las partes de una respuesta parcial como un solo mensaje completo.
     * @param endMessage Mensaje de finalización.
     * @returns Mensaje de respuesta combinada guardado.
     */
    private async saveAnswer(endMessage: EndMessage): Promise<AnswerMessage> {
        const completeAnswerText = this.nonFinishedMessages
            .get(endMessage.getId())
            ?.map((message) => (message as AnswerMessage).getContent().text || "")
            .join("");

        const mergedAnswer = new AnswerMessage(endMessage.getId(), {
            text: completeAnswerText || ""
        });

        await this.messageService.createMessage(
            this.chatConfig.ownerId!,
            this.chatConfig.chatId!,
            mergedAnswer.getId(),
            "assistant",
            mergedAnswer.getContent().text
        );

        return mergedAnswer;
    }

    /**
     * Guarda una pregunta enviada por el usuario en el servicio de mensajes.
     * @param question Pregunta enviada.
     */
    private async saveQuestion(question: QuestionMessage): Promise<void> {
        await this.messageService.createMessage(
            this.chatConfig.ownerId!,
            this.chatConfig.chatId!,
            question.getId(),
            "user",
            question.getContent().question
        );
    }

    /**
     * Completa el historial de una pregunta con mensajes anteriores del chat.
     * @param question Pregunta a la que se agregará el historial.
     */
    private async fillHistory(question: QuestionMessage): Promise<void> {
        const messages = await this.messageService.getMessages(
            this.chatConfig.ownerId!,
            this.chatConfig.chatId!
        );

        const [, ...rest] = messages;

        question.content.history = rest.map(m => ({
            role: m.role,
            content: m.text
        }));
    }
}
