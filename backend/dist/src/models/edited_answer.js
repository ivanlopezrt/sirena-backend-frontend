"use strict";
module.exports = (sequelize, Sequelize) => {
    const EditedAnswer = sequelize.define('edited_answer', {
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
        response: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    }, {
        tableName: 'edited_answer',
        timestamps: false,
    });
    EditedAnswer.associate = (models) => {
        EditedAnswer.belongsTo(models.Message, {
            foreignKey: 'message_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };
    return EditedAnswer;
};
