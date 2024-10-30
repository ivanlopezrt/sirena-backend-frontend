const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
const authenticateToken = require('../middleware/authMiddleware');


router.get('', authenticateToken, diagnosisController.getAll);
router.get('/by/id/:diagnosis_id', authenticateToken, diagnosisController.getByID);
router.get('/by/code/:diagnosis_code', authenticateToken, diagnosisController.getByCode);
router.get('/find', authenticateToken, diagnosisController.find);
module.exports = router;
