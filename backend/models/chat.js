module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define('chat', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            creation_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
        },
        {
            tableName: 'chat',
            timestamps: false,
        });

    Chat.associate = (models) => {
        Chat.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
    };

    return Chat;
};