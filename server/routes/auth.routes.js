import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
// Removed router.get('/current-user', authController.isAuthenticated, authController.getCurrentUser);

export default router;