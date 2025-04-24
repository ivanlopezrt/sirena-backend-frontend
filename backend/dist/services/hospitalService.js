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
const { User, Hospital, Role, Specialty } = require('../src/models');
const { Sequelize } = require("sequelize");
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
    getHospitals(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            const pageSize = 100;
            if (page) {
                filter = {
                    limit: 100,
                    offset: (page - 1) * pageSize
                };
            }
            const hospitals = yield Hospital.findAll(Object.assign({ order: [['postal_code', 'ASC']] }, filter));
            const filteredHospitals = yield Promise.all(hospitals.map((hospital) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                return {
                    id: (_a = hospital.dataValues) === null || _a === void 0 ? void 0 : _a.id,
                    name: (_b = hospital.dataValues) === null || _b === void 0 ? void 0 : _b.name,
                    postal_code: (_c = hospital.dataValues) === null || _c === void 0 ? void 0 : _c.postal_code,
                };
            })));
            return filteredHospitals;
        });
    }
}
module.exports = new HospitalService();
