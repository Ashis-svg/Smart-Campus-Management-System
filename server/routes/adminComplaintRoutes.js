import { Router } from 'express';
import {
  getHalls,
  getPersonalComplaints,
  resolvePersonalComplaint,
  getGeneralComplaints,
  resolveGeneralComplaint,
} from '../controllers/adminComplaintController.js';

const router = Router();

// '/halls' and '/:adminId/general' must come before '/:adminId', otherwise
// Express would try to match them as :adminId.
router.get(   '/halls',                              getHalls);
router.get(   '/:adminId/general',                   getGeneralComplaints);
router.patch( '/:adminId/general/:c_id/resolve',      resolveGeneralComplaint);
router.get(   '/:adminId',                           getPersonalComplaints);
router.patch( '/:adminId/resolve/:c_id',              resolvePersonalComplaint);

export default router;
