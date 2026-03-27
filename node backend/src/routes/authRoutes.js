
const express = require('express');
const router = express.Router();
const { loginAccount } = require('../controllers/authController');

// Define route: POST /api/auth/login
router.post('/login', loginAccount);

module.exports = router;
