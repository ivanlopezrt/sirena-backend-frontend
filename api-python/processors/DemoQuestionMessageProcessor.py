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

class DemoQuestionMessageProcessor(MessageProcessor):
    """
    Procesador de mensajes de tipo pregunta que simula una respuesta paso a paso.

    Este procesador genera una respuesta ficticia, emite mensajes de estado simulados 
    y finaliza el flujo con un mensaje de cierre.
    """

    async def process(self, message: QuestionMessage):
        """
        Procesa un mensaje de tipo pregunta generando una respuesta simulada.

        Envía una respuesta inicial, simula estados de procesamiento y finaliza con un mensaje de fin.

        Args:
            message (QuestionMessage): El mensaje recibido por parte del usuario.
        """
        answer = self.createFakeAnswer()

        await self.responder.respond(answer)
        await self.schedulStatusMessage(answer) 
        await self.scheduleEndMessage(answer) 

    async def schedulStatusMessage(self, answer: AnswerMessage):
        """
        Simula el envío de mensajes de estado con retraso.

        Args:
            answer (AnswerMessage): Mensaje de respuesta al que están vinculados los estados.
        """
        await asyncio.sleep(1.0)
        await self.sendStatusMessage(answer, state="CALCULANDO")
        await asyncio.sleep(1.0)
        await self.sendStatusMessage(answer, state="RESPONDIENDO")

    async def sendStatusMessage(self, answer: AnswerMessage, state: str):
        """
        Envía un mensaje de estado asociado a una respuesta.

        Args:
            answer (AnswerMessage): Mensaje de respuesta relacionado.
            state (str): Estado actual del procesamiento (ej. "CALCULANDO", "RESPONDIENDO").
        """
        message = StatusMessage(id=answer.id, state=state)
        await self.responder.respond(message)

    async def scheduleEndMessage(self, answer: AnswerMessage):
        """
        Programa el envío de un mensaje de finalización tras un retardo simulado.

        Args:
            answer (AnswerMessage): Mensaje de respuesta que se va a finalizar.
        """
        await asyncio.sleep(6.0)  
        await self.sendEndMessage(answer)

    async def sendEndMessage(self, answer: AnswerMessage):
        """
        Envía un mensaje de finalización para una respuesta dada.

        Args:
            answer (AnswerMessage): Mensaje de respuesta a cerrar.
        """
        message = EndMessage(id=answer.id)
        await self.responder.respond(message)

    def createFakeAnswer(self) -> AnswerMessage:
        """
        Crea una respuesta simulada de demostración.

        Returns:
            AnswerMessage: Mensaje de respuesta ficticio.
        """
        answer_content = AnswerMessageContent(
            chatId=uuid4(),  
            messageId=uuid4(),  
            text="Esta es una respuesta"  
        )

        answer_message = AnswerMessage(
            id=uuid4(),  
            timeStamp=int(datetime.now().timestamp()),  
            type=MessageType.ANSWER,  
            content=answer_content  
        )

        return answer_message
