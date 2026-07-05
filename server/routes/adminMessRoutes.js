import { Router } from 'express';
import {
  getHalls,
  getAdminMessDashboard,
  publishNotice,
  deleteNotice,
  updateMenu,
} from '../controllers/adminMessController.js';

const router = Router();

// '/halls' must come before '/:adminId', otherwise Express would match
// GET /admin/mess/halls to the :adminId route with adminId = "halls".
router.get( '/halls',                           getHalls);
router.get( '/:adminId',                        getAdminMessDashboard);
router.post('/:adminId/notice',                 publishNotice);
router.delete('/:adminId/notice/:notice_id',    deleteNotice);
router.patch('/:adminId/menu',                  updateMenu);

export default router;