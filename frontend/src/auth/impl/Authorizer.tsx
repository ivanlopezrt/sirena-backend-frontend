import { ResponseCodes } from "../../models/shared/ResponseCodes";
import User from "../../models/User";
import IStorager from "../../storage/IStorager";
import IAuthCodeResponse from "../IAuthCodeResponse";
import IAuthorizer from "../IAuthorizer";

/**
 * Clase que implementa la interfaz IAuthorizer para manejar la autenticación de usuarios.
 */
export default class Authorizer implements IAuthorizer {
    /**
     * URL del host de la API a la cual se envían las solicitudes de autenticación.
     */
    private API_HOST: string;

    /**
     * Inicializa una nueva instancia de Authorizer con el almacenamiento proporcionado.
     * @param storager - Instancia de IStorager para manejar el almacenamiento de datos.
     */
    constructor(private storager: IStorager) {
        this.API_HOST = process.env.REACT_APP_API_HOST!;
    }

    /**
     * Inicia sesión con el identificador y la contraseña proporcionados.
     * @param identifier - Identificador único del usuario (nombre de usuario o correo electrónico).
     * @param password - Código OTP o contraseña del usuario.
     * @returns Una promesa que resuelve con un objeto que contiene un código de autenticación y un token de sesión.
     * @throws Error si la autenticación falla.
     */
    async login(
        identifier: string,
        password: string
    ): Promise<IAuthCodeResponse & { token: string }> {
        const response = await fetch(this.API_HOST + "/auth/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: identifier,
                code: password,
            }),
        });

        if (!response.ok) {
            throw new Error("No se ha podido autentificar");
        }

        const result: IAuthCodeResponse & { token: string; user: User } =
            { code: response.status, ...await response.json() };

        if (result.code == ResponseCodes.OK) {
            this.storager.set("TOKEN", result.token);
            this.storager.set("CU", result.user);
        }

        return result;
    }

    /**
     * Cierra la sesión del usuario actual, eliminando el token y el usuario del almacenamiento.
     * @returns Una promesa que se resuelve cuando la sesión se ha cerrado correctamente.
     */
    async logOut(): Promise<void> {
        this.storager.remove("CU");
        this.storager.remove("TOKEN");
    }

    /**
     * Obtiene el token de sesión actual.
     * @returns Una promesa que resuelve con el token de sesión como cadena de texto, o `null` si no hay sesión activa.
     */
    async token(): Promise<string | null> {
        return await this.storager.get("TOKEN");
    }

    /**
     * Obtiene el usuario actualmente autenticado.
     * @returns Una promesa que resuelve con el objeto `User` correspondiente al usuario actual, o `null` si no hay usuario autenticado.
     */
    async currentUser(): Promise<User | null> {
        return await this.storager.get("CU");
    }
}
