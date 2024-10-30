const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const userController = require('../controllers/userController');

router.get('', authMiddleware, adminMiddleware, userController.getUsers);

module.exports = router;
