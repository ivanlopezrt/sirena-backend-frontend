const {Sequelize} = require('sequelize');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];

const sequelize = new Sequelize(configEnv);

const db = {
    sequelize,
    Sequelize,
    Specialty: require('./specialty')(sequelize, Sequelize),
    Role: require('./role')(sequelize, Sequelize),
    Hospital: require('./hospital')(sequelize, Sequelize),
    User: require('./user')(sequelize, Sequelize),
    Authentication: require('./authentication')(sequelize, Sequelize),

    PatientDiagnosis: require('./patient_diagnosis')(sequelize, Sequelize),
    Diagnosis: require('./diagnosis')(sequelize, Sequelize),

    Chat: require('./chat')(sequelize, Sequelize),
    Message: require('./message')(sequelize, Sequelize),
    Feedback: require('./feedback')(sequelize, Sequelize),

};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
