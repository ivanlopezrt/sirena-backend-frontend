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
const patientDiagnosisService = require('../services/patientDiagnosisService');
exports.getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientDiagnosis = yield patientDiagnosisService.getFilters(req.user.id, req.query);
        res.status(200).json(patientDiagnosis);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.createPatientDiagnosis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diagnosis } = req.body;
        if (Array.isArray(diagnosis)) {
            return yield createPatientDiagnosisMultiple(req, res);
        }
        return yield createPatientDiagnosisSingle(req, res);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
const createPatientDiagnosisSingle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dni, gender, diagnosis } = req.body;
        const patientDiagnosis = yield patientDiagnosisService.createPatientDiagnosis(dni, gender, req.user.id, diagnosis);
        const response = patientDiagnosis.code == 200 ? { message: patientDiagnosis.message } : { error: patientDiagnosis.message };
        res.status(patientDiagnosis.code).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
const createPatientDiagnosisMultiple = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dni, gender, diagnosis, message_id } = req.body;
        const patientDiagnosis = yield patientDiagnosisService.createBulkPatientDiagnosis(dni, gender, req.user.id, diagnosis, message_id);
        const response = patientDiagnosis.code == 200 ? { message: patientDiagnosis.message } : { error: patientDiagnosis.message };
        res.status(patientDiagnosis.code).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
