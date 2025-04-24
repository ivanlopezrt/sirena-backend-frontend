import WebSocket, { RawData } from 'ws';
import { ChatConfig } from './ChatConfig';

/**
 * Extensión de la interfaz WebSocket para incluir configuración específica del chat.
 *
 * Esta interfaz se utiliza para representar un socket WebSocket asociado a una sesión de chat,
 * con una configuración opcional que contiene información contextual como el ID del chat,
 * propietario, etc.
 *
 * @extends WebSocket
 */
export default interface ChatWebSocket extends WebSocket {
    /**
     * Configuración opcional del chat que puede estar asociada a esta conexión WebSocket.
     */
    config?: ChatConfig;
}
