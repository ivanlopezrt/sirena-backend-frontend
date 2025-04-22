module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('message', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            chat_id: {
                type: Sequelize.UUID,
                allowNull: true
            },
            role: {
                type: Sequelize.ENUM('assistant', 'user'),
                allowNull: false
            },
            text: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            rateable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE(6),
                allowNull: false
            },
            saved:{
                type: Sequelize.BOOLEAN,
                allowNull: true,
            }
        },
        {
            tableName: 'message',
            timestamps: false,
        });

    Message.associate = (models) => {
        Message.belongsTo(models.Chat, {
            foreignKey: 'chat_id',
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL'
        });
    };

    return Message;
};