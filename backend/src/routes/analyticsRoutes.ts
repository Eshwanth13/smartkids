import express from 'express';
import { getAiInsights } from '../controllers/aiInsights.controller';
import { protect, parentOnly } from '../middlewares/authMiddleware';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const aiInsightsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  keyGenerator: (req: any) => req.user?._id?.toString() || 'anonymous',
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { default: false },
});

router.use(protect);
router.use(parentOnly);

router.get('/:childId/ai-insights', aiInsightsLimiter, getAiInsights);

export default router;
