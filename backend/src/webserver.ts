import JWTTokenValidator from "./auth/TokenValidator/JWTTokenValidator";
import WebSocketServer from "./websocket/WebSocketServer";

// Obtener el puerto desde argumentos de línea de comandos
const args = process.argv.slice(2);
const port:number = parseInt(args[0]) || 8080; // Valor por defecto si no se pasa argumento

// Iniciar el servidor WebSocket
const server = new WebSocketServer(port, new JWTTokenValidator());
server.listen();

