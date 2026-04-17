import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Level from '../models/Level';
import User from '../models/User';
import Analytics from '../models/Analytics';
import { getQuestionGenerator } from '../utils/mathGenerators';
import { getEnglishGenerator } from '../utils/englishGenerators';
import { getGKGenerator } from '../utils/gkGenerators';
import { AuthRequest } from '../middlewares/authMiddleware';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Start a level and generate questions
// @route   POST /api/v1/game/start-level
export const startLevel = async (req: Request, res: Response) => {
  const { levelId } = req.body;
  
  let level;
  if (mongoose.Types.ObjectId.isValid(levelId)) {
    level = await Level.findById(levelId);
  } else {
    level = await Level.findOne({ levelNumber: levelId });
  }

  if (!level) return res.status(404).json({ message: 'Level not found' });

  let generator: any;
  const subject = level.subject?.toLowerCase();
  
  if (subject === 'english') {
    generator = getEnglishGenerator(level.questionTemplate);
  } else if (subject === 'gk') {
    generator = getGKGenerator(level.questionTemplate);
  } else {
    generator = getQuestionGenerator(level.topic); // Fallback to math
  }

  const questions = [];

  for (let i = 0; i < 5; i++) {
    // Math generator uses min/max, English/GK use levelNumber currently
    if (subject === 'english' || subject === 'gk') {
      questions.push(generator(level.levelNumber));
    } else {
      questions.push(generator(level.minValue, level.maxValue, level.levelNumber));
    }
  }

  res.json({ level, questions });
};

// @desc    Submit a single answer for analytics tracking
// @route   POST /api/v1/game/submit-answer
export const submitAnswer = async (req: AuthRequest, res: Response) => {
  const { levelId, question, userAnswer, correctAnswer, isCorrect, topic, subject, timeTaken } = req.body;
  const childId = req.user?._id;

  if (!childId) return res.status(401).json({ message: 'Not authorized' });

  try {
    await Analytics.create({
      userId: childId,
      levelId: levelId || undefined,
      question: question || '',
      userAnswer: String(userAnswer),
      correctAnswer: String(correctAnswer),
      isCorrect,
      timeTaken: timeTaken || 0,
      topic: topic || 'General',
      subject: subject || 'math', // Default to math if not provided for legacy
      difficulty: 'medium'
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Analytics save error:', err);
    res.json({ success: false }); // Non-blocking — don't fail the game
  }
};

// @desc    Complete a level and save results
// @route   POST /api/v1/game/complete-level
export const completeLevel = async (req: AuthRequest, res: Response) => {
  const { levelId, xpEarned, coinsEarned } = req.body;
  const childId = req.user?._id;

  if (!childId) return res.status(401).json({ message: 'Not authorized' });

  try {
    const child = await User.findById(childId);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    let level;
    if (mongoose.Types.ObjectId.isValid(levelId)) {
      level = await Level.findById(levelId);
    }

    // Update stats
    child.xp = (child.xp || 0) + (xpEarned || 50);
    child.coins = (child.coins || 0) + (coinsEarned || 20);

    // Unlock next level only if this is the current one for that subject
    const subject = (level.subject as 'math' | 'english' | 'gk') || 'math';
    if (level && level.levelNumber >= child.progress[subject]) {
      child.progress[subject] = level.levelNumber + 1;
      child.markModified('progress'); // Required for Map/Object updates in Mongoose
    }

    await child.save();

    res.json({ 
      message: 'Level completed!',
      child: {
        _id: child._id.toString(),
        name: child.name,
        xp: child.xp,
        coins: child.coins,
        progress: child.progress,
        parentId: child.parentId?.toString(),
        token: generateToken(child._id.toString()),
      }
    });
  } catch (error) {
    console.error('Complete level error:', error);
    res.status(500).json({ message: 'Server error saving progress' });
  }
};

// @desc    Get all levels
// @route   GET /api/v1/game/levels
export const getLevels = async (req: Request, res: Response) => {
  const { subject } = req.query;
  const filter = subject ? { subject: String(subject).toLowerCase() } : {};
  const levels = await Level.find(filter).sort({ levelNumber: 1 });
  res.json(levels);
};
