from pydantic import BaseModel
from .BaseMessage import BaseMessage
from .MessageType import MessageType
from uuid import uuid4

class UnknowMessageContent(BaseModel):
    """
    Contenido de un mensaje desconocido.

    Esta clase define el contenido de un mensaje cuyo tipo no es reconocido.
    El contenido es simplemente un diccionario que contiene los datos asociados al mensaje.
    """

    content: dict
    """
    Datos del mensaje.

    Este campo almacena el contenido del mensaje en formato de diccionario. 
    Este tipo de mensaje se utiliza cuando el tipo del mensaje recibido no puede ser procesado o es desconocido.
    """

class UnknowMessage(BaseMessage[UnknowMessageContent]):
    """
    Mensaje desconocido.

    Esta clase representa un mensaje de tipo `UNKNOWN`, utilizado cuando el tipo de mensaje no es reconocido
    o cuando no se puede procesar adecuadamente. El contenido es almacenado como un diccionario.
    """

    def __init__(self, content: dict):
        """
        Inicializa un mensaje desconocido.

        Este constructor crea un mensaje de tipo `UNKNOWN` con un identificador único y un contenido dado.

        Args:
            content (dict): El contenido del mensaje, generalmente un diccionario con los datos asociados al mensaje.
        """
        super().__init__(id=uuid4(), type=MessageType.UNKNOWN, content=UnknowMessageContent(content=content))
