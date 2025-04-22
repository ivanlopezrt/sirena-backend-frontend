module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('role', {
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
        tableName: 'role',
        timestamps: false,
    });

    return Role;
};