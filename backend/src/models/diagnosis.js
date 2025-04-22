module.exports = (sequelize, Sequelize) => {
    const Diagnosis = sequelize.define('diagnosis', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'diagnosis',
            timestamps: false,
        });

    return Diagnosis;
};
