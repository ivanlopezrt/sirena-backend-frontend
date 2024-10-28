import IAuthCodeResponse from "../IAuthCodeResponse";
import IOTPRequester from "../IOTPRequester";

/**
 * Clase que implementa la interfaz IOTPRequester para solicitar códigos de autenticación de un solo uso (OTP).
 */
export default class OTPRequester implements IOTPRequester {
    /**
     * URL del host de la API a la cual se envían las solicitudes de autenticación.
     */
    private API_HOST: string;

    /**
     * Inicializa una nueva instancia de OTPRequester con la URL de la API obtenida de las variables de entorno.
     */
    constructor() {
        this.API_HOST = process.env.REACT_APP_API_HOST!;
    }

    /**
     * Solicita un código OTP enviando el identificador y la contraseña del usuario a la API.
     * @param identifier - Identificador único del usuario (nombre de usuario o correo electrónico).
     * @param password - Contraseña del usuario.
     * @returns Una promesa que resuelve con un objeto que contiene el código de autenticación.
     * @throws Error si la solicitud no es exitosa.
     */
    async request(
        identifier: string,
        password: string
    ): Promise<IAuthCodeResponse> {
        const response = await fetch(this.API_HOST + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: identifier,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error("No se ha podido solicitar el código");
        }

        return { code: response.status } as IAuthCodeResponse;
    }
}
