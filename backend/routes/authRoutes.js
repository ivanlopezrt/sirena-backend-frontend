const express = require('express');
const router = express.Router();
const authController = require('../controllers/authenticationController');

router.post('/login', authController.authenticateUser);
router.post('/verify', authController.verifyCode);

module.exports = router;
