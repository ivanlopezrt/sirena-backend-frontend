import os
import jwt

class TokenVerifier:
    """
    Clase para verificar la validez de un token JWT utilizando una clave secreta y un algoritmo específico.
    """

    def __init__(self):
        """
        Inicializa la instancia de la clase TokenVerifier con la clave secreta y el algoritmo de encriptación.
        """

        self.secret_key = os.getenv('JWT_TOKEN_SECRET')
        self.algorithm = os.getenv('JWT_ALG')

    def verify(self, token: str) -> dict:
        """
        Verifica la validez de un token JWT.

        Args:
            token (str): El token JWT que se desea verificar.

        Returns:
            dict: El token decodificado si es válido.
            False: Si el token es inválido o no puede ser decodificado.
        
        Si ocurre algún error durante la decodificación del token, se retorna False.
        """
        
        try:
            if not token:
                return False
            
            decoded_token = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return decoded_token 
        except Exception:
            return False
