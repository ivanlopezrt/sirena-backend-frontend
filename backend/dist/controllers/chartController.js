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
const ChartService = require('../services/chartService');
exports.loadLastDays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new ChartService().getGroupedDiagnisticsLastDays(req.user.id, 30);
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.topMonth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new ChartService().getDiagnosesByUserForMonth(req.user.id, new Date().getMonth() + 1, new Date().getFullYear());
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.topsEver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new ChartService().getTopsHistory(req.user.id, 20);
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.codeEvolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { year, code } = req.query;
        if (!year || year == undefined) {
            year = new Date().getFullYear();
        }
        if (!code) {
            res.status(400).json({ message: "Falta código de diagnostico(code)" });
        }
        const data = yield new ChartService().getDiagnosesForYear(req.user.id, code, year);
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
exports.topsSpeciality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield new ChartService().getTopDiagnosisBySpecialty();
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ha sucedido un error" });
    }
});
