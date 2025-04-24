from abc import ABC, abstractmethod
from messages.BaseMessage import BaseMessage

class Responder(ABC):
    """
    Clase abstracta que define la interfaz para objetos que responden a mensajes.

    Cualquier subclase de Responder debe implementar el método respond para 
    manejar mensajes de tipo BaseMessage.
    """

    @abstractmethod
    async def respond(self, message: BaseMessage):
        """
        Maneja la lógica de respuesta para un mensaje dado.

        Args:
            message (BaseMessage): El mensaje que se va a procesar y responder.
        """
        pass
