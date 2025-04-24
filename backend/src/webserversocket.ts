import JWTTokenValidator from "./auth/TokenValidator/JWTTokenValidator";
import WebSocketServer from "./websocket/WebSocketServer";
import http from 'http';

// Obtener el puerto desde argumentos de línea de comandos
const port = process.env.PORT;
const httpServer = http.createServer();

//const wsServer = new WebSocketServer(httpServer, '/ws-ies', new JWTTokenValidator());
//wsServer.listen();

httpServer.listen(port, () => {
    console.log('Servidor HTTP escuchando en http://localhost:'+port);
});
