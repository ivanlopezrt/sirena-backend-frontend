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
const { Diagnosis, User } = require("../src/models");
const { Op } = require("sequelize");
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
    getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            const pageSize = 100;
            if (page) {
                filter = {
                    limit: 100,
                    offset: (page - 1) * pageSize,
                };
            }
            const diagnosis = yield Diagnosis.findAll(Object.assign({ order: [["code", "ASC"]] }, filter));
            return diagnosis;
        });
    }
    /**
     * Retrieves a diagnosis by its ID.
     * @async
     * @param {number} id - The ID of the diagnosis.
     * @returns {Promise<Object>} - The diagnosis object if found, otherwise an empty object.
     */
    getByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                const diagnosis = yield Diagnosis.findOne({ where: { id: id } });
                if (diagnosis) {
                    return diagnosis;
                }
            }
            return {};
        });
    }
    /**
     * Retrieves a diagnosis by its code.
     * @async
     * @param {string} code - The code of the diagnosis.
     * @returns {Promise<Object>} - The diagnosis object if found, otherwise an empty object.
     */
    getByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (code) {
                const diagnosis = yield Diagnosis.findOne({
                    where: { code: code },
                });
                if (diagnosis) {
                    return diagnosis;
                }
            }
            return {};
        });
    }
    /**
     * Searches for diagnoses by code or description, with pagination support.
     * @async
     * @param {string} text - The search text for code or description.
     * @param {number} [page] - The page number for pagination.
     * @returns {Promise<Array<Object>>} - List of diagnoses matching the search criteria.
     */
    find(text, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (text) {
                let filter = {};
                const pageSize = 100;
                if (page) {
                    filter = {
                        limit: 100,
                        offset: (page - 1) * pageSize,
                    };
                }
                const diagnoses = yield Diagnosis.findAll(Object.assign(Object.assign({ order: [["code", "ASC"]] }, filter), { where: {
                        [Op.or]: [
                            {
                                code: {
                                    [Op.like]: `%${text}%`,
                                },
                            },
                            {
                                description: {
                                    [Op.like]: `%${text}%`,
                                },
                            },
                        ],
                    } }));
                if (diagnoses) {
                    return diagnoses;
                }
            }
            return [];
        });
    }
}
module.exports = new PatientDiagnosisService();
