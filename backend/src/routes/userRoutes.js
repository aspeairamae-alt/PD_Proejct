import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', authenticateToken, getUser);

export default router;
