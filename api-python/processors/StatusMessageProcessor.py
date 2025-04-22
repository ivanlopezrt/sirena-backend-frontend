from .MessageProcessor import MessageProcessor
from messages.StatusMessage import StatusMessage

class StatusMessageProcessor(MessageProcessor):
    """
    Procesador de mensajes de estado (StatusMessage).

    Este procesador maneja información relacionada con el estado del sistema o del usuario.
    """

    def process(self, message: StatusMessage):
        """
        Procesa un mensaje StatusMessage

        Args:
            message (StatusMessage): Mensaje que contiene información de estado.
        """
        pass
