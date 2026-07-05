import { Router } from 'express';
import {
  getComplaintDashboard,
  addPersonalComplaint,
  resolveComplaint,
  addGeneralComplaint,
  voteOnComplaint,
} from '../controllers/complaintController.js';

const router = Router();

router.get('/:id',                    getComplaintDashboard);
router.post('/:id',                   addPersonalComplaint);
router.patch('/:id/resolve/:c_id',    resolveComplaint);
router.post('/:id/general',           addGeneralComplaint);
router.post('/:id/vote',              voteOnComplaint);

export default router;