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
 * UserService handles user-related operations, including retrieving users with their associated details.
 */
class UserService {
    /**
     * Retrieves a paginated list of users along with their hospital, role, and specialty information.
     * @async
     * @param {number} [page] - The page number for pagination.
     * @returns {Promise<Array<Object>>} - An array of user objects with detailed information.
     */
    getUsers(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            const pageSize = 100;
            if (page) {
                filter = {
                    limit: 100,
                    offset: (page - 1) * pageSize
                };
            }
            const users = yield User.findAll(Object.assign({ order: [['creation_date', 'ASC']] }, filter));
            const filteredUsers = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const hospital = yield Hospital.findOne({ where: { id: user.dataValues.hospital_id } });
                const hospital_name = hospital.name;
                const role = yield Role.findOne({ where: { id: user.dataValues.role_id } });
                const role_name = role.name;
                const specialty = yield Specialty.findOne({ where: { id: user.dataValues.specialty_id } });
                const specialty_name = specialty.name;
                return {
                    name: (_a = user.dataValues) === null || _a === void 0 ? void 0 : _a.name,
                    email: (_b = user.dataValues) === null || _b === void 0 ? void 0 : _b.email,
                    collegiate_number: (_c = user.dataValues) === null || _c === void 0 ? void 0 : _c.collegiate_number,
                    hospital_name, specialty_name, role_name
                };
            })));
            return filteredUsers;
        });
    }
}
module.exports = new UserService();
