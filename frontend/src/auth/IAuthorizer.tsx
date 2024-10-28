import User from "../models/User";
import IAuthCodeResponse from "./IAuthCodeResponse";

/**
 * Interfaz que define los métodos de autorización para manejar
 * autenticación de usuarios, sesión y obtención de tokens.
 */
export default interface IAuthorizer {
    /**
     * Inicia sesión con el identificador y contraseña proporcionados.
     * @param identifier - Identificador único del usuario (nombre de usuario o correo electrónico).
     * @param password - Contraseña del usuario.
     * @returns Una promesa que resuelve con un objeto que contiene un código de autenticación y un token de sesión.
     */
    login(
        identifier: string,
        password: string
    ): Promise<IAuthCodeResponse & { token: string }>;

    /**
     * Cierra la sesión del usuario actual.
     * @returns Una promesa que se resuelve cuando la sesión se ha cerrado correctamente.
     */
    logOut(): Promise<void>;

    /**
     * Obtiene el token de sesión actual.
     * @returns Una promesa que resuelve con el token de sesión como cadena de texto, o `null` si no hay sesión activa.
     */
    token(): Promise<string | null>;

    /**
     * Obtiene el usuario actualmente autenticado.
     * @returns Una promesa que resuelve con el objeto `User` correspondiente al usuario actual, o `null` si no hay usuario autenticado.
     */
    currentUser(): Promise<User | null>;
}
