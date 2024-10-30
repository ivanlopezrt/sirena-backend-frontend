const {User, Hospital, Role, Specialty} = require('../models');
const {Sequelize} = require("sequelize");

/**
 * HospitalService manages the retrieval of hospital data with optional pagination.
 */
class HospitalService {

    /**
     * Retrieves a paginated list of hospitals, ordered by postal code.
     * @async
     * @param {number} [page] - Optional page number for pagination. If not provided, all hospitals are returned.
     * @returns {Promise<Array<Object>>} - An array of hospital objects with `id`, `name`, and `postal_code`.
     */
    async getHospitals(page) {
        let filter = {};
        const pageSize = 100;

        if (page) {
            filter = {
                limit: 100,
                offset: (page - 1) * pageSize
            }
        }

        const hospitals = await Hospital.findAll({
            order: [['postal_code', 'ASC']],
            ...filter
        });

        const filteredHospitals = await Promise.all(hospitals.map(async (hospital) => {

            return {
                id: hospital.dataValues?.id,
                name: hospital.dataValues?.name,
                postal_code: hospital.dataValues?.postal_code,
            };

        }));
        return filteredHospitals;
    }

}

module.exports = new HospitalService();
