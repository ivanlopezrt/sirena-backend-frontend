module.exports = (sequelize, Sequelize) => {
    const Authentication = sequelize.define('authentication', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            used: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            expiration_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
        },
        {
            tableName: 'authentication',
            timestamps: false,
        });

    Authentication.associate = (models) => {
        Authentication.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return Authentication;
};