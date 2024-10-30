const diagnosisService = require('../services/diagnosisService');

exports.getAll = async (req, res) => {
    try {
        const {page} = req.query
        const diagnosis = await diagnosisService.getAll(page);
        res.status(200).json(diagnosis);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
}

exports.getByID = async (req, res) => {
    try {
        const {diagnosis_id} = req.params;
        const diagnosis = await diagnosisService.getByID(diagnosis_id);
        res.status(200).json(diagnosis);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
}

exports.getByCode = async (req, res) => {
    try {
        const {diagnosis_code} = req.params;
        const diagnosis = await diagnosisService.getByCode(diagnosis_code);
        res.status(200).json(diagnosis);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
}

exports.find = async (req, res) => {
    try {
        const {text, page} = req.query;
        const diagnoses = await diagnosisService.find(text, page);
        res.status(200).json(diagnoses);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
}
