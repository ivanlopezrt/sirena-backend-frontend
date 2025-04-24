import { IncomingMessage } from "http";
import TokenValidatorInterface from "../auth/TokenValidator/TokenValidatorInterface";
import { ChatConfig } from "./ChatConfig";
import IncomingMessageParamRetriever from "../utils/IncomingMessageParamRetriever";
import { UUID } from "crypto";

/**
 * Clase encargada de extraer y construir una configuración de chat (`ChatConfig`)
 * a partir de los parámetros de una solicitud HTTP entrante.
 */
export default class ChatConfigRetriever {

    /**
     * Instancia encargada de validar tokens de autenticación.
     */
    tokenValidator: TokenValidatorInterface;

    /**
     * Utilidad para extraer parámetros desde el objeto `IncomingMessage`.
     */
    paramRetriever: IncomingMessageParamRetriever | null;

    /**
     * Crea una nueva instancia de `ChatConfigRetriever`.
     * @param tokenValidator Instancia para validar el token JWT o similar.
     */
    constructor(tokenValidator: TokenValidatorInterface) {
        this.tokenValidator = tokenValidator;
        this.paramRetriever = null;
    }

    /**
     * Extrae y valida el user ID desde el encabezado `authorization`.
     * 
     * @returns El UUID del usuario si es válido, o `null` si es inválido.
     */
    private async getUserId(): Promise<UUID | null> {
        const token: string | null = this.paramRetriever!.retrieve("authorization");
        return (await this.tokenValidator.validate(token!))?.id || null;
    }

    /**
     * Extrae el chat ID desde los parámetros de la solicitud entrante.
     * 
     * @returns El UUID del chat o `null` si no está presente.
     */
    private async getChatId(): Promise<UUID | null> {
        return await this.paramRetriever!.retrieve("chatId");
    }

    /**
     * Construye y retorna la configuración del chat (`ChatConfig`) a partir de una solicitud.
     * 
     * @param message Solicitud HTTP entrante.
     * @returns Objeto `ChatConfig` con `ownerId` y `chatId`.
     */
    async getChatConfig(message: IncomingMessage): Promise<ChatConfig> {
        this.paramRetriever = new IncomingMessageParamRetriever(message);

        const userId = await this.getUserId();
        const chatId = await this.getChatId();
        const token:string|null = this.paramRetriever!.retrieve("authorization");

        return { ownerId: userId, chatId: chatId, token: token };
    }
}
