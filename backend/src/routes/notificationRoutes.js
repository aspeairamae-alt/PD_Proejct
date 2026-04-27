import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/resident/:residentId', authenticateToken, getNotifications);
router.patch('/:id/read', authenticateToken, markNotificationAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

export default router;
