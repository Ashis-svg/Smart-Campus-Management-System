import { Router } from 'express';
import { registerStudent, registerAdmin } from '../controllers/registerController.js';

const router = Router();

router.post('/student/register', registerStudent);
router.post('/admin/register', registerAdmin);

export default router;