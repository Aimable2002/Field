import express from 'express';
import {
  createResponse,
  getResponses,
  getResponseById,
  getTeamStats,
  getInterestDistribution,
} from '../controller/responseController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createResponse);
router.get('/', getResponses);
router.get('/:id', getResponseById);
router.get('/stats/teams', getTeamStats);
router.get('/stats/interest', getInterestDistribution);

export default router;