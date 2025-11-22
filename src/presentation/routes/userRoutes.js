import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

export default router;




