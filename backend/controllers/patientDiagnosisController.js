const patientDiagnosisService = require('../services/patientDiagnosisService');

exports.getFilters = async (req, res) => {
    try {
        const patientDiagnosis = await patientDiagnosisService.getFilters(req.user.id, req.query)
        res.status(200).json(patientDiagnosis);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

exports.createPatientDiagnosis = async (req, res) => {
    try {
        const {diagnosis} = req.body;

        if(Array.isArray(diagnosis)){
            return await createPatientDiagnosisMultiple(req, res);
        }

        return await createPatientDiagnosisSingle(req, res);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

const createPatientDiagnosisSingle = async (req, res) => {
    try {
        const {dni, gender, diagnosis} = req.body;
        const patientDiagnosis = await patientDiagnosisService.createPatientDiagnosis(dni, gender, req.user.id, diagnosis)
        const response = patientDiagnosis.code == 200 ? {message: patientDiagnosis.message} : {error: patientDiagnosis.message}
        res.status(patientDiagnosis.code).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};

const createPatientDiagnosisMultiple = async (req, res) => {
    try {
        const {dni, gender, diagnosis,message_id} = req.body;
        const patientDiagnosis = await patientDiagnosisService.createBulkPatientDiagnosis(dni, gender, req.user.id, diagnosis,message_id)
        const response = patientDiagnosis.code == 200 ? {message: patientDiagnosis.message} : {error: patientDiagnosis.message}
        res.status(patientDiagnosis.code).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ha sucedido un error"});
    }
};
