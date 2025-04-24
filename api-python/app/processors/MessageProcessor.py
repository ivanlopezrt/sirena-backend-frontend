from abc import ABC, abstractmethod
from responders.Responder import Responder
from messages.BaseMessage import BaseMessage

class MessageProcessor(ABC):
    """
    Clase base abstracta para todos los procesadores de mensajes.

    Define la interfaz que deben seguir los procesadores de distintos tipos de mensajes,
    asegurando que todos implementen un método `process`.
    """

    def __init__(self, responder: Responder):
        """
        Inicializa el procesador con un responder.

        Args:
            responder (Responder): Objeto encargado de enviar respuestas al cliente.
        """
        self.responder = responder

    @abstractmethod
    async def process(self, message: BaseMessage):
        """
        Procesa el mensaje recibido. Este método debe ser implementado por las subclases.

        Args:
            message (BaseMessage): Mensaje que se va a procesar.
        """
        pass
