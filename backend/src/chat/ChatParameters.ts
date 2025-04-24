import { UUID } from "crypto";

/**
 * Parámetros de configuración del chat.
 * 
 * @property chatId - Identificador único del chat, puede ser `null` si aún no se ha generado.
 */
export type ChatParameters = {
    chatId: UUID | null;
};
