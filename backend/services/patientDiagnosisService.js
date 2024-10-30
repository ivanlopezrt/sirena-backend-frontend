const { Diagnosis, PatientDiagnosis, Message } = require('../models');
const { Sequelize } = require("sequelize");
const DNI = require("../models/DNI");
const messageService = require('./messageService');

/**
 * PatientDiagnosisService handles the creation and retrieval of patient diagnosis records.
 */
class PatientDiagnosisService {

    /**
     * Retrieves patient diagnosis records based on provided filters.
     * @async
     * @param {number} professional_id - The ID of the healthcare professional requesting the records.
     * @param {Object} query - Query parameters for filtering.
     * @param {number} [query.id] - Optional diagnosis record ID.
     * @param {string} [query.patient] - Optional patient identifier (DNI).
     * @param {string} [query.gender] - Optional patient gender.
     * @param {number} [query.diagnosis] - Optional diagnosis ID.
     * @returns {Promise<Array<Object>>} - An array of matching patient diagnosis records.
     */
    async getFilters(professional_id, query) {
        const { id, patient, gender, diagnosis } = query;

        const filters = {};

        if (id) {
            filters.id = id;
        }

        if (patient) {
            filters.patient = patient;
        }

        if (diagnosis) {
            filters.diagnosis_id = diagnosis;
        }

        if (gender) {
            filters.gender = gender;
        }

        filters.professional_id = professional_id

        const patientDiagnosis = await PatientDiagnosis.findAll({ where: filters });

        return patientDiagnosis;
    }

    /**
     * Creates a new patient diagnosis record.
     * @async
     * @param {string} patient - The patient's DNI.
     * @param {number} gender - The patient's gender.
     * @param {number} user_id - The ID of the user creating the record.
     * @param {string} diagnosis_code - The code of the diagnosis being recorded.
     * @returns {Promise<Object>} - Result code and message indicating success or failure.
     */
    async createPatientDiagnosis(patient, gender, user_id, diagnosis_code) {

        const dni = new DNI(patient);
        const patientId = patient ? dni.hashDNI() : "";

        if (patient!= "" && !dni.isValid()) {
            return { code: 400, message: "El DNI introducido no es válido" }
        }

        if (gender === undefined || gender === null) {
            return { code: 400, message: "Se debe de introducir un género" }
        }

        gender = gender > 0 && gender != 1 ? 1 : gender

        const diagnosis = await Diagnosis.findOne({ where: { code: diagnosis_code } })

        if (!diagnosis) {
            return { code: 404, message: "El diagnóstico no existe" }
        }

        const createdPatientDiagnosisRecord = await PatientDiagnosis.create({
            patient: patientId,
            gender: gender,
            user_id: user_id,
            diagnosis_id: diagnosis.id,
            date: new Date()
        });

        if (!createdPatientDiagnosisRecord) {
            return { code: 500, message: "Fallo al crear el nuevo diagnóstico de paciente" }
        }

        return { code: 200, message: "El diagnóstico de paciente se ha creado correctamente" }

    }

    /**
     * Creates multiple patient diagnosis records in bulk.
     * @async
     * @param {string} patient - The patient's DNI.
     * @param {number} gender - The patient's gender.
     * @param {number} user_id - The ID of the user creating the records.
     * @param {Array<string>} diagnosis_codes - An array of diagnosis codes to be recorded.
     * @param {number} message_id - The ID of the message associated with this action.
     * @returns {Promise<Object>} - Result code and message indicating success or failure.
     */
    async createBulkPatientDiagnosis(patient, gender, user_id, diagnosis_codes, message_id) {

        const dni = new DNI(patient);
        const patientId = patient ? dni.hashDNI() : "";

        if (!message_id) {
            return { code: 400, message: "Se requiere un mensaje" }
        }

        if (patient!= "" && !dni.isValid()) {
            return { code: 400, message: "El DNI introducido no es válido" }
        }

        if (gender === undefined || gender === null) {
            return { code: 400, message: "Se debe de introducir un género" }
        }

        gender = gender > 0 && gender != 1 ? 1 : gender

        const message = await Message.findOne({ where: { id: message_id } });

        if (message) {
            for (let index = 0; index < diagnosis_codes.length; index++) {

                let diagnosis_code = diagnosis_codes[index];

                const diagnosis = await Diagnosis.findOne({ where: { code: diagnosis_code } })

                console.log("diagnosis encotnrad",diagnosis);

                if (diagnosis) {

                    await PatientDiagnosis.create({
                        patient: patientId,
                        gender: gender,
                        user_id: user_id,
                        diagnosis_id: diagnosis.id,
                        date: message.date
                    });

                }

            }

            await message.update({saved: true});
        }

        return { code: 200, message: "El diagnóstico de paciente se ha creado correctamente" };
    }
}

module.exports = new PatientDiagnosisService();
