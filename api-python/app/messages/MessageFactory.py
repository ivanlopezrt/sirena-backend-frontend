from typing import Type, Dict, Any
from .UnknowMessage import UnknowMessage
from .MessageType import MessageType
from .QuestionMessage import QuestionMessage
from .AnswerMessage import AnswerMessage
from .StatusMessage import StatusMessage
from .EndMessage import EndMessage
from .BaseMessage import BaseMessage

# Mapeo entre MessageType y su clase correspondiente
message_type_map: Dict[MessageType, Type[BaseMessage]] = {
    MessageType.QUESTION: QuestionMessage,
    MessageType.ANSWER: AnswerMessage,
    MessageType.STATUS: StatusMessage,
    MessageType.END: EndMessage
}

def MessageFactory(data: dict) -> BaseMessage:
    """
    Fabrica un mensaje a partir de los datos proporcionados.

    Esta función construye un objeto de tipo `BaseMessage` a partir de un diccionario que contiene
    los datos del mensaje. El tipo de mensaje se determina a partir del campo "type" en los datos,
    y se mapea al tipo correspondiente utilizando el diccionario `message_type_map`.

    Si el tipo de mensaje no es reconocido o está ausente, se retorna un `UnknowMessage`.

    Args:
        data (dict): Diccionario con los datos del mensaje, incluyendo el tipo y el contenido.

    Returns:
        BaseMessage: El mensaje correspondiente al tipo indicado en `data`, o un `UnknowMessage` si el tipo es inválido.
    """
    try:
        message_type = MessageType(data["type"])
    except ValueError as e:
        return UnknowMessage(data)

    message_class = message_type_map.get(message_type)
    if not message_class:
        return UnknowMessage(data)

    return message_class(**data)
