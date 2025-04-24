from typing import Type, Dict
from messages.MessageType import MessageType
from .MessageProcessor import MessageProcessor
from .QuestionMessageProcessor import QuestionMessageProcessor
from .DemoQuestionMessageProcessor import DemoQuestionMessageProcessor
from .AnswerMessageProcessor import AnswerMessageProcessor
from .StatusMessageProcessor import StatusMessageProcessor
from .UnknownMessageProcessor import UnknownMessageProcessor
from .EndMessageProcessor import EndMessageProcessor
from responders.Responder import Responder

# Mapeo de tipos de mensajes a sus procesadores correspondientes.
processor_map: Dict[MessageType, Type[MessageProcessor]] = {
    #MessageType.QUESTION: QuestionMessageProcessor,
    MessageType.QUESTION: DemoQuestionMessageProcessor,
    MessageType.ANSWER: AnswerMessageProcessor,
    MessageType.STATUS: StatusMessageProcessor,
    MessageType.END: EndMessageProcessor,
}

def MessageProcessorFactory(message_type: MessageType, responder: Responder) -> MessageProcessor:
    """
    Fábrica de procesadores de mensajes.

    Retorna una instancia del procesador correspondiente al tipo de mensaje especificado.
    Si el tipo de mensaje no está registrado, se retorna un UnknownMessageProcessor por defecto.

    Args:
        message_type (MessageType): Tipo de mensaje a procesar.
        responder (Responder): Objeto encargado de enviar respuestas.

    Returns:
        MessageProcessor: Instancia del procesador adecuado para el tipo de mensaje.
    """
    processor_cls = processor_map.get(message_type)
    if not processor_cls:
        return UnknownMessageProcessor(responder)
    return processor_cls(responder)
