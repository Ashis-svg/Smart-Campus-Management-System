import { Router } from 'express';
import {
  getOpinionsDashboard,
  addOpinion,
  updateOpinion,
  deleteOpinion,
  voteOnOpinion,
} from '../controllers/opinionController.js';

const router = Router();

router.get('/:userType/:userId', getOpinionsDashboard);
router.post('/:userType/:userId', addOpinion);
router.patch('/:userType/:userId/:opinion_id', updateOpinion);
router.delete('/:userType/:userId/:opinion_id', deleteOpinion);
router.post('/:userType/:userId/vote', voteOnOpinion);

export default router;