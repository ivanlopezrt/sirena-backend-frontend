const {User, Hospital, Role, Specialty} = require('../models');
const {Sequelize} = require("sequelize");

/**
 * UserService handles user-related operations, including retrieving users with their associated details.
 */
class UserService {

    /**
     * Retrieves a paginated list of users along with their hospital, role, and specialty information.
     * @async
     * @param {number} [page] - The page number for pagination.
     * @returns {Promise<Array<Object>>} - An array of user objects with detailed information.
     */
    async getUsers(page) {

        let filter = {};
        const pageSize = 100;

        if (page) {
            filter = {
                limit: 100,
                offset: (page - 1) * pageSize
            }
        }

        const users = await User.findAll({
            order: [['creation_date', 'ASC']],
            ...filter
        });

        const filteredUsers = await Promise.all(users.map(async (user) => {

            const hospital = await Hospital.findOne({where: {id: user.dataValues.hospital_id}});
            const hospital_name = hospital.name
            const role = await Role.findOne({where: {id: user.dataValues.role_id}});
            const role_name = role.name
            const specialty = await Specialty.findOne({where: {id: user.dataValues.specialty_id}});
            const specialty_name = specialty.name

            return {
                name: user.dataValues?.name,
                email: user.dataValues?.email,
                collegiate_number: user.dataValues?.collegiate_number,
                hospital_name, specialty_name, role_name
            };

        }));
        return filteredUsers;
    }

}

module.exports = new UserService();
