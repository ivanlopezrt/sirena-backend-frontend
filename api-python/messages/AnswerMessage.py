from pydantic import BaseModel
from typing import List
from uuid import UUID
from .BaseMessage import BaseMessage
from .MessageType import MessageType

class AnswerMessageContent(BaseModel):
    """
    Contenido de un mensaje de respuesta.

    Esta clase define el contenido específico de un mensaje de respuesta, 
    incluyendo el ID del chat, el ID del mensaje y el texto de la respuesta.
    """

    chatId: UUID
    """
    ID único del chat al que pertenece la respuesta.

    Este campo contiene el identificador único del chat, que permite asociar la respuesta
    con un chat específico.
    """

    messageId: UUID
    """
    ID único del mensaje de respuesta.

    Este campo contiene el identificador único del mensaje, utilizado para rastrear y 
    referenciar la respuesta específica.
    """

    text: str
    """
    Texto de la respuesta.

    Este campo contiene el texto que será enviado como parte de la respuesta al usuario.
    """

class AnswerMessage(BaseMessage[AnswerMessageContent]):
    """
    Mensaje de respuesta.

    Esta clase extiende la clase base `BaseMessage` y agrega un contenido específico de respuesta.
    Además, incluye una marca de tiempo y un tipo de mensaje predeterminado (ANSWER).
    """

    timeStamp: int
    """
    Marca de tiempo del mensaje de respuesta.

    Este campo contiene el tiempo en formato de timestamp (segundos desde la época Unix) 
    en que se generó la respuesta.
    """

    type: MessageType = MessageType.ANSWER
    """
    Tipo de mensaje.

    Este campo indica el tipo de mensaje. En este caso, siempre tiene el valor `ANSWER`, 
    ya que esta clase se utiliza para mensajes de respuesta.
    """
