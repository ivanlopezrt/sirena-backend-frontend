module.exports = (sequelize, Sequelize) => {
    const Hospital = sequelize.define('hospital', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        postal_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        tableName: 'hospital',
        timestamps: false,
    });

    return Hospital;
};
