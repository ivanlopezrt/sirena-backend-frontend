import BypassTokenValidator from "./auth/TokenValidator/BypassTokenValidator";
import RemoteDummyWebServer from "./websocket/RemoteDummyWebServer";

// Obtener el puerto desde argumentos de línea de comandos
const args = process.argv.slice(2);
const port:number = parseInt(args[0]) || 8080; // Valor por defecto si no se pasa argumento

// Iniciar el servidor WebSocket
const server = new RemoteDummyWebServer(port, new BypassTokenValidator());
server.listen();

