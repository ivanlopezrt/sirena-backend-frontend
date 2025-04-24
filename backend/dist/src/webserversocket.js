"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
// Obtener el puerto desde argumentos de línea de comandos
const port = process.env.PORT;
const httpServer = http_1.default.createServer();
//const wsServer = new WebSocketServer(httpServer, '/ws-ies', new JWTTokenValidator());
//wsServer.listen();
httpServer.listen(port, () => {
    console.log('Servidor HTTP escuchando en http://localhost:' + port);
});
