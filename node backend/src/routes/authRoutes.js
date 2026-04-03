
const express = require('express');
const router = express.Router();
const { loginAccount } = require('../controllers/authController');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in to an account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginAccount);

module.exports = router;
