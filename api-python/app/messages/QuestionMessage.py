from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from .BaseMessage import BaseMessage
from .MessageType import MessageType

class QuestionHistory(BaseModel):
    """
    Historial de preguntas previas.

    Esta clase define una estructura para almacenar el historial de interacciones previas relacionadas
    con una pregunta, incluyendo el rol y el contenido de las interacciones anteriores.
    """

    role: str
    """
    Rol de la persona que hizo la pregunta.

    Este campo almacena el rol del interlocutor (por ejemplo, "usuario" o "asistente") que realizó la pregunta
    en una interacción anterior.
    """

    content: str
    """
    Contenido de la pregunta.

    Este campo almacena el texto o contenido de la pregunta o interacción previa.
    """

class QuestionMessageContent(BaseModel):
    """
    Contenido de un mensaje de tipo pregunta.

    Esta clase define el contenido específico de un mensaje de tipo `QuestionMessage`, incluyendo
    el ID del chat, el ID del mensaje, la pregunta y el historial de preguntas previas, si existe.
    """

    question: str
    """
    Pregunta realizada.

    Este campo almacena el texto de la pregunta realizada en el mensaje.
    """

    history: Optional[List[QuestionHistory]] = None
    """
    Historial de preguntas previas.

    Este campo almacena una lista opcional de instancias de `QuestionHistory`, que representa las interacciones
    previas relacionadas con la pregunta actual. Si no hay historial, este campo será `None`.
    """

class QuestionMessage(BaseMessage[QuestionMessageContent]):
    """
    Mensaje de tipo pregunta.

    Esta clase extiende `BaseMessage` y agrega un contenido específico de pregunta. También contiene
    un timestamp que indica el momento en que se generó el mensaje de pregunta.
    """

    timeStamp: int
    """
    Marca de tiempo del mensaje.

    Este campo almacena el timestamp (en segundos desde la época Unix) que indica cuándo se generó la pregunta.
    """

    type: MessageType = MessageType.QUESTION
    """
    Tipo de mensaje.

    Este campo siempre tiene el valor `QUESTION`, indicando que el mensaje es de tipo pregunta.
    """
