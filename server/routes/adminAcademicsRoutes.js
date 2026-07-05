import { Router } from 'express';
import {
  getAcademicsDashboard,
  cancelClass,
  restoreClass,
  publishNotice,
  deleteNotice,
} from '../controllers/adminAcademicsController.js';

const router = Router();

router.get('/:adminId', getAcademicsDashboard);
router.patch('/:adminId/class/:course_id/cancel', cancelClass);
router.patch('/:adminId/class/:course_id/restore', restoreClass);
router.post('/:adminId/notice', publishNotice);
router.delete('/:adminId/notice/:notice_id', deleteNotice);

export default router;