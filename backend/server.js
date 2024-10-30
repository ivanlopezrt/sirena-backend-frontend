const express = require('express');
const cors = require('cors');
const {sequelize} = require('./models');
const authRoutes = require('./routes/authRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const patientDiagnosisRoutes = require('./routes/patientDiagnosisRoutes');
const chatRoutes = require('./routes/chatRoutes');
const usersRoutes = require('./routes/userRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const chartRoutes = require('./routes/chartRoutes');

const {initializeDatabase} = require('./utils/dbInitializer');

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

sequelize.sync({force: false}).then(() => {
    app.listen(port, () => {
        initializeDatabase();
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
});
