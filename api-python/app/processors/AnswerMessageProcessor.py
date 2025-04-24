from .MessageProcessor import MessageProcessor
from messages.AnswerMessage import AnswerMessage

class AnswerMessageProcessor(MessageProcessor):
    """
    Procesador para mensajes de respuesta (AnswerMessage).

    Este procesador maneja los mensajes de tipo AnswerMessage, que contienen las respuestas
    generadas durante la conversación.
    """

    def process(self, message: AnswerMessage):
        """
        Procesa un mensaje de respuesta.

        Este método es utilizado para manejar los mensajes de tipo AnswerMessage.
        En una implementación real, podría involucrar tareas como el análisis de la respuesta,
        la actualización de registros, etc.

        Args:
            message (AnswerMessage): Mensaje que contiene la respuesta generada.
        """
        pass
