import IAuthorizer from "../auth/IAuthorizer";
import { ResponseCodes } from "../models/shared/ResponseCodes";
import IRequesterResponse from "./RequesterResponse";

/**
 * Clase para realizar solicitudes HTTP de manera segura.
 */
export default class Requester {

    private baseURL: string;

    /**
     * Crea una instancia de la clase Requester.
     * @param authorizer - Un objeto que implementa la interfaz IAuthorizer, usado para obtener el token de autorización.
     */
    constructor(private authorizer: IAuthorizer) {
        this.baseURL = process.env.REACT_APP_API_HOST!;
    }

    /**
     * Asegura las cabeceras de la solicitud agregando el token de autorización.
     * @param headers - Un objeto con las cabeceras adicionales que se agregarán a la solicitud.
     * @returns Una promesa que resuelve las cabeceras de la solicitud, incluyendo el token de autorización.
     */
    async securizeRequest(headers: {}): Promise<any> {
        const token = await this.authorizer.token()!;
        const baseHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        return { ...baseHeaders, ...headers };
    }

    /**
     * Realiza una solicitud GET a la API.
     * @param endpoint - La ruta del endpoint al que se desea realizar la solicitud.
     * @param headers - Un objeto opcional con las cabeceras adicionales para la solicitud.
     * @returns Una promesa que resuelve un objeto IRequesterResponse del tipo T.
     */
    async get<T>(endpoint: string, headers: {} = {}): Promise<IRequesterResponse<T>> {
        const response = await fetch(this.baseURL + endpoint, {
            method: 'GET',
            headers: await this.securizeRequest(headers)
        });

        return this.composeResponse(response);
    }

    /**
     * Realiza una solicitud POST a la API.
     * @param endpoint - La ruta del endpoint al que se desea realizar la solicitud.
     * @param body - El cuerpo de la solicitud, opcional.
     * @param headers - Un objeto opcional con las cabeceras adicionales para la solicitud.
     * @returns Una promesa que resuelve un objeto IRequesterResponse del tipo T.
     */
    async post<T>(endpoint: string, body?: {}, headers: {} = {}): Promise<IRequesterResponse<T>> {

        const response = await fetch(this.baseURL + endpoint, {
            method: 'POST',
            headers: await this.securizeRequest(headers),
            body: JSON.stringify(body),
        });

        return this.composeResponse(response);
    }

    /**
     * Realiza una solicitud DELETE a la API.
     * @param endpoint - La ruta del endpoint al que se desea realizar la solicitud.
     * @param body - El cuerpo de la solicitud, opcional.
     * @param headers - Un objeto opcional con las cabeceras adicionales para la solicitud.
     * @returns Una promesa que resuelve un objeto IRequesterResponse del tipo T.
     */
    async delete<T>(endpoint: string, body?: {}, headers: {} = {}): Promise<IRequesterResponse<T>> {

        const response = await fetch(this.baseURL + endpoint, {
            method: 'DELETE',
            headers: await this.securizeRequest(headers),
            body: JSON.stringify(body),
        });

        return this.composeResponse(response);
    }

    /**
     * Componer la respuesta de la solicitud en un formato estándar.
     * @param response - El objeto Response de la solicitud HTTP.
     * @returns Una promesa que resuelve un objeto IRequesterResponse del tipo T.
     */
    async composeResponse<T>(response: Response): Promise<IRequesterResponse<T>> {
        if (response.status === ResponseCodes.FORBIDDEN) {
            return { code: response.status, data: {} as T, success: response.ok };
        }

        return { code: response.status, data: await response.json(), success: response.ok };
    }
}
