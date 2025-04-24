from .MessageProcessor import MessageProcessor
from messages.EndMessage import EndMessage

class EndMessageProcessor(MessageProcessor):
    """
    Procesador para mensajes de finalización (EndMessage).

    Este procesador se encarga de manejar la lógica cuando se indica el fin de una conversación o flujo.
    """

    def process(self, message: EndMessage):
        """
        Procesa un mensaje de finalización.

        Este método puede ser utilizado para realizar tareas de limpieza, cierre de sesión,
        registro de logs, etc. Actualmente no realiza ninguna acción.

        Args:
            message (EndMessage): Mensaje que indica el fin de la conversación.
        """
        pass
