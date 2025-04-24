import asyncio
from datetime import datetime
from uuid import uuid4
from messages.EndMessage import EndMessage
from messages.MessageType import MessageType
from messages.StatusMessage import StatusMessage
from .MessageProcessor import MessageProcessor
from messages.QuestionMessage import QuestionMessage
from responders.Responder import Responder
from messages.AnswerMessage import AnswerMessage, AnswerMessageContent

class QuestionMessageProcessor(MessageProcessor):
    """
    Procesador encargado de manejar mensajes de tipo pregunta (QuestionMessage).

    Este procesador debe generar una o varias respuestas (AnswerMessage) y finalizar la conversación
    enviando un EndMessage.
    """

    async def process(self, message: QuestionMessage):
        """
        Procesa un mensaje de tipo pregunta.

        Este método debe implementar la lógica para generar respuestas basadas en el contenido del mensaje.
        Puede enviar múltiples AnswerMessage, y al final debe enviar un EndMessage indicando que ha terminado.

        Args:
            message (QuestionMessage): Mensaje recibido que contiene la pregunta del usuario.
        """

        # Por cada bloque de respuesta que se quiera mandar, se mandará un AnswerMessage
        # await self.responder.respond(...)

        # Cuando se haya terminado de responder se mandará un EndMessage con el ID del mensaje que se quiera finalizar.
        # await self.responder.respond(EndMessage(mensaje_con_el_que_responder.id))

        # Se puede ver algo similar en UnknownMessageProcessor
        pass
