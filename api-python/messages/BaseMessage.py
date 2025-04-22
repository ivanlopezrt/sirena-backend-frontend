from pydantic import BaseModel, Field
from uuid import UUID
from .MessageType import MessageType
from typing import TypeVar, Generic

T = TypeVar("T")

class BaseMessage(BaseModel, Generic[T]):
    """
    Modelo base para los mensajes en el sistema.

    Esta clase define la estructura básica de un mensaje, que incluye un identificador único, 
    el tipo de mensaje y su contenido. La clase es genérica, permitiendo diferentes tipos de contenido.
    """

    id: UUID
    """
    ID único del mensaje.

    Este campo contiene el identificador único de cada mensaje, que es utilizado para rastrear 
    y referenciar mensajes en el sistema.
    """

    type: MessageType
    """
    Tipo de mensaje.

    Este campo define el tipo de mensaje que se está manejando, como "QUESTION", "ANSWER", etc.
    """

    content: T
    """
    Contenido del mensaje.

    Este campo es genérico, lo que permite almacenar cualquier tipo de contenido relacionado 
    con el mensaje, dependiendo del tipo de mensaje específico.
    """
