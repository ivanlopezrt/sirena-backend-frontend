const express = require('express');
const router = express.Router();
const chartController = require("../controllers/chartController");
const authenticateToken = require("../middleware/authMiddleware");

router.get('/last_days', authenticateToken, chartController.loadLastDays);
router.get('/top_month', authenticateToken, chartController.topMonth);
router.get('/top_ever', authenticateToken, chartController.topsEver);
router.get('/code_evolution', authenticateToken, chartController.codeEvolution);
router.get('/top_specialities', authenticateToken, chartController.topsSpeciality);
module.exports = router;
