from pydantic import BaseModel
from typing import List
from uuid import UUID
from .BaseMessage import BaseMessage
from .MessageType import MessageType

class StatusMessageContent(BaseModel):
    """
    Contenido de un mensaje de estado.

    Esta clase define el contenido específico de un mensaje de tipo `StatusMessage`, 
    que incluye el estado actual del sistema o proceso.
    """

    state: str
    """
    Estado del sistema o proceso.

    Este campo almacena el estado actual del sistema o proceso que se está monitoreando, 
    como "CALCULANDO", "RESPONDIENDO", etc.
    """

class StatusMessage(BaseMessage[StatusMessageContent]):
    """
    Mensaje de estado.

    Esta clase extiende `BaseMessage` y agrega un contenido específico de estado. 
    Representa un mensaje que indica el estado de un proceso o sistema en curso.
    """

    def __init__(self, id: UUID, state: str):
        """
        Inicializa un mensaje de estado.

        Este constructor crea un mensaje de tipo `STATUS` con un identificador único y 
        un estado determinado.

        Args:
            id (UUID): El identificador único del mensaje de estado.
            state (str): El estado del proceso o sistema, como "CALCULANDO" o "RESPONDIENDO".
        """
        super().__init__(id=id, type=MessageType.STATUS, content=StatusMessageContent(state=state))
