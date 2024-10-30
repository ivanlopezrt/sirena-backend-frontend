const express = require('express');
const router = express.Router();
const patientDiagnosisController = require("../controllers/patientDiagnosisController");
const authenticateToken = require("../middleware/authMiddleware");

router.get('/diagnosis', authenticateToken, patientDiagnosisController.getFilters);
router.post('/diagnosis', authenticateToken, patientDiagnosisController.createPatientDiagnosis);

module.exports = router;
