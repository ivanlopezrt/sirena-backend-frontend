from .Responder import Responder
from messages.BaseMessage import BaseMessage
from fastapi import WebSocket

class WebSocketResponder(Responder):
    """
    Implementación de Responder que envía mensajes a través de un WebSocket.

    Esta clase permite enviar respuestas serializadas a un cliente conectado mediante WebSocket.
    """

    def __init__(self, websocket: WebSocket):
        """
        Inicializa una instancia de WebSocketResponder.

        Args:
            websocket (WebSocket): Conexión WebSocket abierta con el cliente.
        """
        self.websocket = websocket

    async def respond(self, message: BaseMessage):
        """
        Envía el mensaje serializado como texto a través del WebSocket.

        Args:
            message (BaseMessage): Mensaje a enviar al cliente.
        """
        await self.websocket.send_text(message.model_dump_json())
