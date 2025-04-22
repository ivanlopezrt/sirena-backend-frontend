module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            collegiate_number: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            role_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            specialty_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            hospital_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            creation_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            last_start: {
                type: Sequelize.DATE,
                allowNull: true
            },
        },
        {
            tableName: 'user',
            timestamps: false,
        });


    User.associate = (models) => {
        User.belongsTo(models.Role, {foreignKey: 'role_id'});
        User.belongsTo(models.Specialty, {foreignKey: 'specialty_id'});
        User.belongsTo(models.Hospital, {foreignKey: 'hospital_id'});
    };

    return User;
};