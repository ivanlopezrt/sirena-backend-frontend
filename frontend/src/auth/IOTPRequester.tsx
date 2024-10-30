import IAuthCodeResponse from "./IAuthCodeResponse";

/**
 * Interfaz para solicitar un código de autenticación de un solo uso (OTP).
 */
export default interface IOTPRequester {
    /**
     * Solicita un código OTP utilizando el identificador y la contraseña proporcionados.
     * @param identifier - Identificador único del usuario (nombre de usuario o correo electrónico).
     * @param password - Contraseña del usuario.
     * @returns Una promesa que resuelve con un objeto que contiene el código de autenticación.
     */
    request(identifier: string, password: string): Promise<IAuthCodeResponse>;
}
