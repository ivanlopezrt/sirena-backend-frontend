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

    Este procesador está diseñado para pruebas o demostraciones. Genera respuestas
    simuladas de manera progresiva, emitiendo mensajes de estado intermedios
    y finalizando el flujo con mensajes de cierre.
    """

    async def process(self, message: QuestionMessage):
        """
        Procesa un mensaje del tipo `QuestionMessage`.

        El método responde al mensaje inicial con una respuesta simulada y, a través
        de varios pasos temporizados, envía mensajes de estado para simular el
        procesamiento de la respuesta. Posteriormente, envía mensajes adicionales
        para simular una conversación continua.

        Args:
            message (QuestionMessage): El mensaje recibido desde el usuario.
        """

        # Respuesta inicial (vacía)
        answer = self.createFakeAnswer()
        await self.responder.respond(answer)

        # Simulación de etapas de procesamiento
        await self.sendMessageAfterTime(1, StatusMessage(id=answer.id, state="ANALIZANDO MENSAJE..."))
        await self.sendMessageAfterTime(1, StatusMessage(id=answer.id, state="OBTENIENDO FUENTES..."))
        await self.sendMessageAfterTime(1, StatusMessage(id=answer.id, state="UNIFICANDO RESPUESTA..."))

        # Generación progresiva de bloques de respuesta
        await self.sendMessageAfterTime(1, self.createAnswerMessage(answer.id, "Esta es una respuesta.."))
        await self.sendMessageAfterTime(0.2, self.createAnswerMessage(answer.id, "generada por partes."))
        await self.sendMessageAfterTime(0.5, self.createAnswerMessage(answer.id, "Cada bloque de respuesta se ha generado..."))
        await self.sendMessageAfterTime(0.3, self.createAnswerMessage(answer.id, "en un mensaje de manera independiente"))

        # Finalización del mensaje
        await self.sendMessageAfterTime(1, StatusMessage(id=answer.id, state="ESPERANDO FIN DE MENSAJE..."))
        await self.sendMessageAfterTime(1, EndMessage(id=answer.id))

        # Segunda respuesta: sugerencia para continuar la conversación
        second_answer = self.createFakeAnswer()
        await self.responder.respond(second_answer)
        await self.sendMessageAfterTime(1, self.createAnswerMessage(second_answer.id, "¿Quieres que te ayude a algo más?"))
        await self.sendMessageAfterTime(1, EndMessage(id=second_answer.id))

        # Tercera respuesta: demostración de mensajes automáticos
        third_answer = self.createFakeAnswer()
        await self.responder.respond(third_answer)
        await self.sendMessageAfterTime(1, self.createAnswerMessage(third_answer.id,
            "Ahora se pueden mandar todos los mensajes que se quieran sin necesidad de que intervenga el usuario"))
        await self.sendMessageAfterTime(1, EndMessage(id=third_answer.id))

    async def sendMessageAfterTime(self, seconds: int, message: BaseMessage):
        """
        Espera un tiempo determinado antes de enviar un mensaje.

        Args:
            seconds (int): Tiempo en segundos a esperar antes del envío.
            message (BaseMessage): Mensaje que se enviará tras la espera.
        """
        await asyncio.sleep(seconds)
        await self.responder.respond(message)

    def createFakeAnswer(self) -> AnswerMessage:
        """
        Crea una respuesta ficticia sin contenido textual.

        Returns:
            AnswerMessage: Objeto de respuesta con ID y timestamp actual.
        """
        answer_content = AnswerMessageContent(text="")

        answer_message = AnswerMessage(
            id=uuid4(),
            timeStamp=int(datetime.now().timestamp()),
            type=MessageType.ANSWER,
            content=answer_content
        )

        return answer_message

    def createAnswerMessage(self, messageId: str, text: str) -> AnswerMessage:
        """
        Crea un mensaje de respuesta con contenido textual específico.

        Args:
            messageId (str): ID del mensaje al que esta respuesta corresponde.
            text (str): Texto que se incluirá en la respuesta.

        Returns:
            AnswerMessage: Objeto de respuesta con el texto dado.
        """
        answer_content = AnswerMessageContent(text=text)

        answer_message = AnswerMessage(
            id=messageId,
            timeStamp=int(datetime.now().timestamp()),
            type=MessageType.ANSWER,
            content=answer_content
        )

        return answer_message
