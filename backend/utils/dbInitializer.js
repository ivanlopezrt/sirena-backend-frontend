const Hospital = require('../models/hospital')(require('../models').sequelize, require('sequelize'));
const Role = require('../models/role')(require('../models').sequelize, require('sequelize'));
const Specialty = require('../models/specialty')(require('../models').sequelize, require('sequelize'));


/**
 * Initializes the database with default hospital, role, and specialty data.
 * Creates records in the tables if they do not already exist.
 *
 * @function initializeDatabase
 */
async function initializeDatabase() {
    try {
        /**
         * Creates or finds a Hospital record with specific name and postal code.
         * @typedef {Object} Hospital
         * @property {string} name - Name of the hospital.
         * @property {string} postal_code - Postal code of the hospital.
         *
         * @type {[Hospital, boolean]} hospital and hospitalCreated
         */
        const [hospital, hospitalCreated] = await Hospital.findOrCreate({
            where: {name: 'Hospital Central', postal_code: '12345'},
        });

        /**
         * Creates or finds an admin role.
         * @typedef {Object} Role
         * @property {string} name - Name of the role.
         *
         * @type {[Role, boolean]} adminRole and adminCreated
         */
        const [adminRole, adminCreated] = await Role.findOrCreate({
            where: {name: 'Admin'},
        });

        /**
         * Creates or finds a user role.
         *
         * @type {[Role, boolean]} userRole and userCreated
         */
        const [userRole, userCreated] = await Role.findOrCreate({
            where: {name: 'User'},
        });

        /**
         * List of predefined medical specialties.
         *
         * @type {string[]}
         */
        const specialties = [
            'Nefrología',
            'Cardiología',
            'Dermatología',
            'Gastroenterología',
            'Endocrinología',
            'Hematología',
            'Neurología',
            'Oncología',
            'Oftalmología',
            'Pediatría',
            'Psiquiatría',
            'Reumatología',
            'Urología',
            'Geriatría',
            'Cirugía General',
            'Medicina Interna',
            'Ginecología',
            'Traumatología',
            'Otorrinolaringología',
            'Neumología',
            'Radiología'
        ];

        /**
         * Creates or finds a specialty for each name in the specialties list.
         * @typedef {Object} Specialty
         * @property {string} name - Name of the specialty.
         */
        for (const name of specialties) {
            const [specialty, specialtyCreated] = await Specialty.findOrCreate({
                where: {name: name},
            });
        }

    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
    }
}

module.exports = {initializeDatabase};
