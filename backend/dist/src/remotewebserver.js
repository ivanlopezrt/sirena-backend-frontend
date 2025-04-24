"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BypassTokenValidator_1 = __importDefault(require("./auth/TokenValidator/BypassTokenValidator"));
const RemoteDummyWebServer_1 = __importDefault(require("./websocket/RemoteDummyWebServer"));
// Obtener el puerto desde argumentos de línea de comandos
const args = process.argv.slice(2);
const port = parseInt(args[0]) || 8080; // Valor por defecto si no se pasa argumento
// Iniciar el servidor WebSocket
const server = new RemoteDummyWebServer_1.default(port, new BypassTokenValidator_1.default());
server.listen();
