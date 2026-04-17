import express from 'express';
import { getLevels, startLevel, submitAnswer, completeLevel } from '../controllers/gameController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/levels', getLevels);
router.post('/start-level', startLevel);
router.post('/submit-answer', submitAnswer);
router.post('/complete-level', completeLevel);

export default router;
