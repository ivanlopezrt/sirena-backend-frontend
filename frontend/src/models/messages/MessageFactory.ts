import { MessageType } from "./MessageType";
import QuestionMessage from "./QuestionMessage";
import MessageInterface from "./MessageInterface";

import AnswerMessage from "./AnswerMessage";
import UnknowMessage from "./UnknowMessage";
import StatusMessage from "./StatusMessage";
import EndMessage from "./EndMessage";
import SocketMessageInterface from "./SocketMessageInterface";
import ErrorMessage from "./ErrorMessage";
import { ErrorMessageData } from "./ErrorMessageData";

/**
 * Fábrica de mensajes que crea instancias de diferentes tipos de mensajes basados en el tipo recibido.
 */
export default class MessageFactory {

    /**
     * Crea una instancia de un mensaje basado en la información recibida.
     * @param message - Objeto de tipo SocketMessageInterface que contiene los datos del mensaje.
     * @returns Una instancia de MessageInterface si el tipo de mensaje es válido, de lo contrario, retorna null.
     */
    static create(message: SocketMessageInterface): MessageInterface | null {
        switch (message.type) {
            case MessageType.QUESTION:
                return new QuestionMessage(message.id, message.content);
            
            case MessageType.ANSWER:
                return new AnswerMessage(message.id, message.content);

            case MessageType.STATUS:
                return new StatusMessage(message.id, message.content);

            case MessageType.END:
                    return new EndMessage(message.id);

            case MessageType.ERROR:
                    return new ErrorMessage(message.content);
            
            default:
                return new UnknowMessage();
        }
    }
}
