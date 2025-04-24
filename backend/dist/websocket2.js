"use strict";
const WebSocket = require('ws');
const args = process.argv.slice(2);
console.log(args);
const wss = new WebSocket.Server({ port: args[0] });
wss.on('connection', (ws) => {
    console.log('Cliente conectado python');
    // Enviar un mensaje de bienvenida al cliente
    ws.send('¡Bienvenido al servidor WebSocket python!');
    // Escuchar mensajes del cliente
    ws.on('message', (message) => {
        console.log(`Mensaje recibido en python: ${message}`);
        ws.send(`Respuesta desde servidor python: ${message}`); // Responder con el mismo mensaje
    });
    // Manejar cierre de conexión
    ws.on('close', () => {
        console.log('Cliente desconectado python');
    });
});
console.log('Servidor WebSocket python corriendo en ws://localhost:' + args[0]);
