import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} from '../controllers/reportController.js';
import { authenticateToken, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.patch('/:id/status', authenticateToken, authorizeStaff, updateReportStatus);
router.delete('/:id', authenticateToken, authorizeStaff, deleteReport);

export default router;
