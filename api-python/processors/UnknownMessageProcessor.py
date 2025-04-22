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

class UnknownMessageProcessor(MessageProcessor):
    """
    Procesador de mensajes que maneja casos en los que el mensaje recibido no puede ser comprendido.

    Este procesador genera una respuesta predeterminada indicando que el mensaje no se pudo entender.
    """

    async def process(self, message: QuestionMessage):
        """
        Procesa un mensaje desconocido generando una respuesta automática.

        Args:
            message (QuestionMessage): El mensaje de entrada que no se ha podido interpretar.
        """
        answer = self.createResponse()
        await self.responder.respond(answer)
        await self.responder.respond(EndMessage(answer.id))

    def createResponse(self):
        """
        Crea una respuesta predeterminada indicando que el mensaje no ha sido comprendido.

        Returns:
            AnswerMessage: Mensaje de respuesta con texto explicativo.
        """
        messageId = uuid4()

        answer_content = AnswerMessageContent(
            chatId=uuid4(),  
            messageId=messageId,  
            text="Lo siento, no puedo entenderte"  
        )

        answer_message = AnswerMessage(
            id=messageId,  
            timeStamp=int(datetime.now().timestamp()),  
            type=MessageType.ANSWER,  
            content=answer_content  
        )

        return answer_message
