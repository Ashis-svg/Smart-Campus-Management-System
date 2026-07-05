import { Router } from 'express';
import { getAcademicsDashboard } from '../controllers/academicsController.js';

const router = Router();

router.get('/:id', getAcademicsDashboard);

export default router;