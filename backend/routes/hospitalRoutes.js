const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const hospitalController = require('../controllers/hospitalController');

router.get('', authMiddleware, adminMiddleware, hospitalController.getHospitals);

module.exports = router;
