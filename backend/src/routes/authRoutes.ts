import express from 'express';
import { 
  registerParent, 
  loginParent, 
  createChild, 
  loginChild 
} from '../controllers/authController';
import { protect, parentOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register-parent', registerParent);
router.post('/login-parent', loginParent);
router.post('/login-child', loginChild);

// Protected routes
router.post('/create-child', protect, parentOnly, createChild);

export default router;
