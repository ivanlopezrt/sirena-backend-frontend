module.exports = (sequelize, Sequelize) => {
    const Feedback = sequelize.define('feedback', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            message_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
            },
            feedback: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            rating: {
                type: Sequelize.ENUM('success', 'mistake'),
                allowNull: false
            },
        },
        {
            tableName: 'feedback',
            timestamps: false,
        });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.Message, {
            foreignKey: 'message_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Feedback;
};