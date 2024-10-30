const {Diagnosis, User} = require('../models');
const {Op} = require('sequelize');

/**
 * Service for handling patient diagnoses.
 * @class PatientDiagnosisService
 */
class PatientDiagnosisService {

    /**
     * Retrieves a paginated list of all diagnoses.
     * @async
     * @param {number} [page] - The page number for pagination.
     * @returns {Promise<Array<Object>>} - List of diagnoses.
     */
    async getAll(page) {

        let filter = {};
        const pageSize = 100;

        if (page) {
            filter = {
                limit: 100,
                offset: (page - 1) * pageSize
            }
        }

        const diagnosis = await Diagnosis.findAll({
            order: [['code', 'ASC']],
            ...filter
        });

        return diagnosis;
    }

    /**
     * Retrieves a diagnosis by its ID.
     * @async
     * @param {number} id - The ID of the diagnosis.
     * @returns {Promise<Object>} - The diagnosis object if found, otherwise an empty object.
     */
    async getByID(id) {
        if (id) {
            const diagnosis = await Diagnosis.findOne({where: {id: id}});
            if (diagnosis) {
                return diagnosis;
            }
        }
        return {};
    }

    /**
     * Retrieves a diagnosis by its code.
     * @async
     * @param {string} code - The code of the diagnosis.
     * @returns {Promise<Object>} - The diagnosis object if found, otherwise an empty object.
     */
    async getByCode(code) {
        if (code) {
            const diagnosis = await Diagnosis.findOne({where: {code: code}});
            if (diagnosis) {
                return diagnosis;
            }
        }
        return {};
    }

    /**
     * Searches for diagnoses by code or description, with pagination support.
     * @async
     * @param {string} text - The search text for code or description.
     * @param {number} [page] - The page number for pagination.
     * @returns {Promise<Array<Object>>} - List of diagnoses matching the search criteria.
     */
    async find(text, page) {
        if (text) {

            let filter = {};
            const pageSize = 100;

            if (page) {
                filter = {
                    limit: 100,
                    offset: (page - 1) * pageSize
                }
            }

            const diagnoses = await Diagnosis.findAll({
                order: [['code', 'ASC']],
                ...filter,
                where: {
                    [Op.or]: [
                        {
                            code: {
                                [Op.like]: `%${text}%`
                            }
                        },
                        {
                            description: {
                                [Op.like]: `%${text}%`
                            }
                        }
                    ]
                }
            });
            if (diagnoses) {
                return diagnoses;
            }
        }
        return [];
    }
}

module.exports = new PatientDiagnosisService();
