const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const authRoutes = require('./routes/authRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const patientDiagnosisRoutes = require('./routes/patientDiagnosisRoutes');
const chatRoutes = require('./routes/chatRoutes');
const usersRoutes = require('./routes/userRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const chartRoutes = require('./routes/chartRoutes');
const WebSocketServer = require('./dist/src/websocket/WebSocketServer').default;
const JWTTokenValidator = require('./dist/src/auth/TokenValidator/JWTTokenValidator').default;

const { initializeDatabase } = require('./utils/dbInitializer');
const http = require('http');

const path = require('path');
require('dotenv').config({ path: path.resolve("conf/.env") });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/chart', chartRoutes);
app.use('/users', usersRoutes);
app.use('/hospitals', hospitalRoutes)
app.use('/diagnosis', diagnosisRoutes);
app.use('/patient', patientDiagnosisRoutes);

// Crear servidor HTTP a partir de Express
const httpServer = http.createServer(app);

sequelize.sync({ force: false }).then(() => {
    initializeDatabase();

    const wsServer = new WebSocketServer(new JWTTokenValidator());
    wsServer.listen();

    httpServer.on('upgrade', (req, socket, head) => {
        const { pathname } = new URL(req.url, 'wss://base.url');
        if (pathname === '/chat') {
            wsServer.server.handleUpgrade(req, socket, head, (ws) => {
                wsServer.server.emit('connection', ws, req);
            });
        }
    });

    httpServer.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
});

