import WebSocket, { RawData } from 'ws';
import { ChatConfig } from './ChatConfig';

export default interface ChatWebSocket extends WebSocket {
    config?: ChatConfig; 
}
