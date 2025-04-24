"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Hospital = require('../src/models/hospital')(require('../src/models').sequelize, require('sequelize'));
const Role = require('../src/models/role')(require('../src/models').sequelize, require('sequelize'));
const Specialty = require('../src/models/specialty')(require('../src/models').sequelize, require('sequelize'));
/**
 * Initializes the database with default hospital, role, and specialty data.
 * Creates records in the tables if they do not already exist.
 *
 * @function initializeDatabase
 */
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /**
             * Creates or finds a Hospital record with specific name and postal code.
             * @typedef {Object} Hospital
             * @property {string} name - Name of the hospital.
             * @property {string} postal_code - Postal code of the hospital.
             *
             * @type {[Hospital, boolean]} hospital and hospitalCreated
             */
            const [hospital, hospitalCreated] = yield Hospital.findOrCreate({
                where: { name: 'Hospital Central', postal_code: '12345' },
            });
            /**
             * Creates or finds an admin role.
             * @typedef {Object} Role
             * @property {string} name - Name of the role.
             *
             * @type {[Role, boolean]} adminRole and adminCreated
             */
            const [adminRole, adminCreated] = yield Role.findOrCreate({
                where: { name: 'Admin' },
            });
            /**
             * Creates or finds a user role.
             *
             * @type {[Role, boolean]} userRole and userCreated
             */
            const [userRole, userCreated] = yield Role.findOrCreate({
                where: { name: 'User' },
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
                const [specialty, specialtyCreated] = yield Specialty.findOrCreate({
                    where: { name: name },
                });
            }
        }
        catch (error) {
            console.error('Error inicializando la base de datos:', error);
        }
    });
}
module.exports = { initializeDatabase };
