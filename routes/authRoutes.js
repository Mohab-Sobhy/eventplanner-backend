const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authenticate = require('../Middlewares/authMiddleware');
const { registerValidator } = require('../Validators/registerValidator');

router.post('/login', authController.login);

router.post('/token', authController.refreshToken);

router.delete('/logout', authController.logout);

router.post('/register', registerValidator, authController.register)

module.exports = router;
