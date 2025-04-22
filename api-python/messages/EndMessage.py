from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from .BaseMessage import BaseMessage
from .MessageType import MessageType

class EndMessage(BaseMessage):
    """
    Mensaje de finalización.

    Esta clase representa un mensaje que indica el fin de una conversación o proceso.
    Se utiliza para marcar la conclusión de la interacción.
    """

    type: MessageType = MessageType.END  
    """
    Tipo de mensaje.

    Este campo siempre tiene el valor `END`, indicando que se trata de un mensaje de finalización.
    """

    def __init__(self, id: UUID):
        """
        Inicializa un mensaje de finalización.

        Este constructor crea un mensaje de tipo `END` con un identificador único y sin contenido.

        Args:
            id (UUID): El identificador único del mensaje de finalización.
        """
        super().__init__(id=id, type=MessageType.END, content=None)
