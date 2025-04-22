module.exports = (sequelize, Sequelize) => {
    const Specialty = sequelize.define('specialty', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'specialty',
        timestamps: false,
    });

    return Specialty;
};