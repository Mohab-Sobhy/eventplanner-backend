const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authenticate = require('../Middlewares/authenticate');
const authorizeRoles = require('../Middlewares/authorizeRoles');

router.get('/getAll', authenticate, authorizeRoles('admin'), userController.getAllUsers);

module.exports = router;
