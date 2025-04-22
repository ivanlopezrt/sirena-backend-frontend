const { Diagnosis, User } = require(".");

module.exports = (sequelize, Sequelize) => {
    const PatientDiagnosis = sequelize.define('patient_diagnosis', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            patient: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            gender: {
                type: Sequelize.TINYINT,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: User, // Relacionar con la tabla Usuario
                    key: 'id'
                  }
            },
            diagnosis_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: Diagnosis, // Relacionar con la tabla Usuario
                    key: 'id'
                  }
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'patient_diagnosis',
            timestamps: false,
        });

    PatientDiagnosis.associate = (models) => {
        PatientDiagnosis.belongsTo(models.User, {foreignKey: 'user_id'});
        PatientDiagnosis.belongsTo(models.Diagnosis, {foreignKey: 'diagnosis_id'});
    };

    return PatientDiagnosis;
};
