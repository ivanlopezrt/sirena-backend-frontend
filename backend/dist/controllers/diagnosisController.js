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
const diagnosisService = require('../services/diagnosisService');
exports.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.query;
        const diagnosis = yield diagnosisService.getAll(page);
        res.status(200).json(diagnosis);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.getByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diagnosis_id } = req.params;
        const diagnosis = yield diagnosisService.getByID(diagnosis_id);
        res.status(200).json(diagnosis);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.getByCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { diagnosis_code } = req.params;
        const diagnosis = yield diagnosisService.getByCode(diagnosis_code);
        res.status(200).json(diagnosis);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, page } = req.query;
        const diagnoses = yield diagnosisService.find(text, page);
        res.status(200).json(diagnoses);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
