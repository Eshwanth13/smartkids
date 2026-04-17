import express from 'express';
import { getChildren, getChildAnalytics, deleteChild } from '../controllers/parentController';
import { protect, parentOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(parentOnly);

router.get('/children', getChildren);
router.get('/child/:childId/analytics', getChildAnalytics);
router.delete('/child/:childId', deleteChild);


export default router;
