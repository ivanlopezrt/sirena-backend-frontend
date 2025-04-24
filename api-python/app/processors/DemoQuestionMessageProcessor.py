import asyncio
from datetime import datetime
from uuid import uuid4
from messages import BaseMessage
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

        await self.sendMessageAfterTime(1,StatusMessage(id=answer.id, state="ANALIZANDO MENSAJE..."))
        await self.sendMessageAfterTime(1,StatusMessage(id=answer.id, state="OBTENIENDO FUENTES..."))
        await self.sendMessageAfterTime(1,StatusMessage(id=answer.id, state="UNIFICANDO RESPUESTA..."))
        await self.sendMessageAfterTime(1,self.createAnswerMessage(answer.id,"Esta es una respuesta.."))
        await self.sendMessageAfterTime(0.2,self.createAnswerMessage(answer.id,"generada por partes."))
        await self.sendMessageAfterTime(0.5,self.createAnswerMessage(answer.id,"Cada bloque de respuesta se ha generado..."))
        await self.sendMessageAfterTime(0.3,self.createAnswerMessage(answer.id,"en un mensaje de manera independiente"))
        await self.sendMessageAfterTime(1,StatusMessage(id=answer.id, state="ESPERANDO FIN DE MENSAJE..."))
        await self.sendMessageAfterTime(1,EndMessage(id=answer.id))

        second_answer = self.createFakeAnswer()
        await self.responder.respond(second_answer)
        await self.sendMessageAfterTime(1,self.createAnswerMessage(second_answer.id,"¿Quieres que te ayude a algo más?"))
        await self.sendMessageAfterTime(1,EndMessage(id=second_answer.id))

        third_answer = self.createFakeAnswer()
        await self.responder.respond(third_answer)
        await self.sendMessageAfterTime(1,self.createAnswerMessage(third_answer.id,"Ahora se pueden mandar todos los mensajes que se quieran sin necesidad de que intervenga el usuario"))
        await self.sendMessageAfterTime(1,EndMessage(id=third_answer.id))

    async def sendMessageAfterTime(self, seconds:int, message:BaseMessage):
        await asyncio.sleep(seconds)
        await self.responder.respond(message)

    def createFakeAnswer(self) -> AnswerMessage:
        """
        Crea una respuesta simulada de demostración.

        Returns:
            AnswerMessage: Mensaje de respuesta ficticio.
        """
        answer_content = AnswerMessageContent(
            text=""  
        )

        answer_message = AnswerMessage(
            id=uuid4(),  
            timeStamp=int(datetime.now().timestamp()),  
            type=MessageType.ANSWER,  
            content=answer_content  
        )

        return answer_message

    def createAnswerMessage(self,messageId:str, text:str) -> AnswerMessage:
        """
        Crea una respuesta simulada de demostración.

        Returns:
            AnswerMessage: Mensaje de respuesta ficticio.
        """
        answer_content = AnswerMessageContent(
            text=text 
        )

        answer_message = AnswerMessage(
            id=messageId,  
            timeStamp=int(datetime.now().timestamp()),  
            type=MessageType.ANSWER,  
            content=answer_content  
        )

        return answer_message

