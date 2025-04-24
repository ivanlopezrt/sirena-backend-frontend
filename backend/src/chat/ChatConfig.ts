import { UUID } from "crypto";
import { ChatParameters } from "./ChatParameters";

/**
 * Configuración completa para una sesión de chat.
 * 
 * Combina los parámetros básicos del chat (`ChatParameters`) con
 * información adicional como el identificador del propietario (`ownerId`).
 *
 * @property chatId - Identificador único del chat, puede ser `null` si aún no se ha generado.
 * @property ownerId - Identificador del usuario propietario del chat, o `null` si no ha sido autenticado.
 */
export type ChatConfig = ChatParameters & {
    ownerId: UUID | null;
    token:string | null;
};
