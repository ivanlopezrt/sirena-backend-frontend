from enum import Enum

class MessageType(str, Enum):
    """
    Enum que representa los tipos de mensajes en el sistema.

    Esta clase enumera los diferentes tipos de mensajes que pueden existir en el sistema de mensajería,
    tales como preguntas, respuestas, finalizaciones y actualizaciones de estado. También incluye un
    tipo `UNKNOWN` para manejar mensajes no reconocidos.
    """
    QUESTION = "question"
    """
    Tipo de mensaje: Pregunta.

    Este tipo de mensaje representa una solicitud o pregunta realizada por el usuario.
    """
    
    ANSWER = "answer"
    """
    Tipo de mensaje: Respuesta.

    Este tipo de mensaje representa una respuesta(completa o parcial) generada para una pregunta del usuario.
    """
    
    END = "end"
    """
    Tipo de mensaje: Finalización.

    Este tipo de mensaje indica el fin de un mensaje.
    """
    
    STATUS = "status"
    """
    Tipo de mensaje: Estado.

    Este tipo de mensaje contiene información sobre el estado actual del mensaje (Ej: Generando, Obteniendo fuentes,etc.. cualquier texto)
    """
    
    UNKNOWN = "unknown"
    """
    Tipo de mensaje: Desconocido.

    Este tipo de mensaje se utiliza cuando el tipo de mensaje no se puede reconocer o procesar correctamente.
    """
