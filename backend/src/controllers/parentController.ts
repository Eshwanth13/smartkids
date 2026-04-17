import { Response } from 'express';
import User from '../models/User';
import Analytics from '../models/Analytics';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Get all children of a parent
// @route   GET /api/v1/parent/children
export const getChildren = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  const children = await User.find({ parentId: req.user._id, role: 'child' });
  res.json(children);
};

// @desc    Get analytics for a specific child
// @route   GET /api/v1/parent/child/:childId/analytics
export const getChildAnalytics = async (req: AuthRequest, res: Response) => {
  const { childId } = req.params;
  
  const analytics = await Analytics.find({ userId: childId }).sort({ createdAt: -1 });
  
  // Calculate stats (Accuracy, topics, etc.)
  const totalAttempts = analytics.length;
  const correctAttempts = analytics.filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

  res.json({
    analytics,
    stats: {
      totalAttempts,
      correctAttempts,
      accuracy: Math.round(accuracy)
    }
  });
};
// @desc    Delete a child and their associated analytics
// @route   DELETE /api/v1/parent/child/:childId
export const deleteChild = async (req: AuthRequest, res: Response) => {
  const { childId } = req.params;

  try {
    const child = await User.findOne({ _id: childId, parentId: req.user?._id });
    if (!child) return res.status(404).json({ message: 'Child not found or not authorized' });

    // Delete child's analytics
    await Analytics.deleteMany({ userId: childId });
    
    // Delete the child user
    await User.findByIdAndDelete(childId);

    res.json({ message: 'Child and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
