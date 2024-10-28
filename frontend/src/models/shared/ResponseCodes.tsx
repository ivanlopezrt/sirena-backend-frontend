/**
 * Enumeración que define los códigos de respuesta de la API.
 */
export enum ResponseCodes {
    /**
     * Código de respuesta para una solicitud exitosa.
     */
    OK = 200,

    /**
     * Código de respuesta para una solicitud no autorizada.
     */
    UNAUTHORIZED = 401,

    /**
     * Código de respuesta para una solicitud prohibida.
     */
    FORBIDDEN = 403,

    /**
     * Código de respuesta para un error interno del servidor.
     */
    ERROR = 500,
}
