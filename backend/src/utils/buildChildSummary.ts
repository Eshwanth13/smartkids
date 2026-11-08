import mongoose from 'mongoose';
import Analytics from '../models/Analytics';
import User from '../models/User';
import { ChildSummary } from '../types/aiInsights.types';
import crypto from 'crypto';

export interface ChildDataInput {
  progress?: { math: number; english: number; gk: number };
  xp?: number;
  coins?: number;
}

export interface AttemptInput {
  isCorrect: boolean;
  createdAt: Date | string;
  topic?: string;
  timeTaken?: number;
  hintsUsed?: number;
}

/**
 * Pure calculation function for child statistics aggregation.
 * Easily unit tested without database dependencies.
 */
export function computeChildSummary(
  child: ChildDataInput,
  allAttempts: AttemptInput[],
  referenceDate = new Date()
): ChildSummary & { statsHash: string } {
  const totalAttempts = allAttempts.length;
  const currentLevel = child.progress || { math: 1, english: 1, gk: 1 };
  const maxLevel = Math.max(currentLevel.math || 1, currentLevel.english || 1, currentLevel.gk || 1, 1);
  const gradeBand = `Class ${maxLevel}`;

  if (totalAttempts < 10) {
    const insufficientSummary: ChildSummary & { statsHash: string } = {
      overallAccuracy: 0,
      last7DaysAccuracy: 0,
      previous7DaysAccuracy: 0,
      trend: 'steady',
      totalAttempts,
      attemptsLast7Days: 0,
      perTopic: [],
      weakTopics: [],
      strongTopics: [],
      avgTimePerQuestionSec: 0,
      hintsUsedCount: 0,
      hintRate: 0,
      currentLevel,
      gradeBand,
      xp: child.xp || 0,
      coins: child.coins || 0,
      activeDaysLast7: 0,
      insufficientData: true,
      statsHash: crypto.createHash('md5').update(`insufficient-${totalAttempts}`).digest('hex'),
    };
    return insufficientSummary;
  }

  const now = referenceDate;
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Overall accuracy
  const correctTotal = allAttempts.filter(a => a.isCorrect).length;
  const overallAccuracy = Math.round((correctTotal / totalAttempts) * 100);

  // Last 7 days vs previous 7 days
  const last7 = allAttempts.filter(a => new Date(a.createdAt) >= sevenDaysAgo && new Date(a.createdAt) <= now);
  const prev7 = allAttempts.filter(a => {
    const d = new Date(a.createdAt);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  });

  const last7Accuracy = last7.length > 0
    ? Math.round((last7.filter(a => a.isCorrect).length / last7.length) * 100)
    : 0;
  const prev7Accuracy = prev7.length > 0
    ? Math.round((prev7.filter(a => a.isCorrect).length / prev7.length) * 100)
    : 0;

  const diff = last7Accuracy - prev7Accuracy;
  const trend: 'improving' | 'steady' | 'declining' =
    diff > 5 ? 'improving' : diff < -5 ? 'declining' : 'steady';

  // Active days in last 7
  const activeDaySet = new Set(
    last7.map(a => new Date(a.createdAt).toDateString())
  );
  const activeDaysLast7 = activeDaySet.size;

  // Per topic aggregation
  const topicMap: Record<string, { total: number; correct: number; totalTime: number }> = {};
  allAttempts.forEach(a => {
    const key = a.topic || 'General';
    if (!topicMap[key]) topicMap[key] = { total: 0, correct: 0, totalTime: 0 };
    topicMap[key].total++;
    if (a.isCorrect) topicMap[key].correct++;
    topicMap[key].totalTime += a.timeTaken || 0;
  });

  const perTopic = Object.entries(topicMap).map(([topic, d]) => ({
    topic,
    attempts: d.total,
    accuracy: Math.round((d.correct / d.total) * 100),
    avgTimeSec: Math.round(d.totalTime / d.total / 1000),
  }));

  // Weak topics (< 60% with at least 5 attempts)
  const weakTopics = perTopic
    .filter(t => t.attempts >= 5 && t.accuracy < 60)
    .map(t => t.topic);

  // Strong topics (>= 85% with at least 5 attempts)
  const strongTopics = perTopic
    .filter(t => t.attempts >= 5 && t.accuracy >= 85)
    .map(t => t.topic);

  // Average time per question
  const totalTime = allAttempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0);
  const avgTimePerQuestionSec = totalAttempts > 0
    ? Math.round(totalTime / totalAttempts / 1000)
    : 0;

  // Hints
  const hintsUsedCount = allAttempts.reduce((sum, a) => sum + (a.hintsUsed || 0), 0);
  const hintRate = totalAttempts > 0
    ? Math.round((hintsUsedCount / totalAttempts) * 100)
    : 0;

  const summaryData: ChildSummary = {
    overallAccuracy,
    last7DaysAccuracy: last7Accuracy,
    previous7DaysAccuracy: prev7Accuracy,
    trend,
    totalAttempts,
    attemptsLast7Days: last7.length,
    perTopic,
    weakTopics,
    strongTopics,
    avgTimePerQuestionSec,
    hintsUsedCount,
    hintRate,
    currentLevel,
    gradeBand,
    xp: child.xp || 0,
    coins: child.coins || 0,
    activeDaysLast7,
    insufficientData: false,
  };

  // Build deterministic statsHash for caching (contains only non-identifying stats)
  const hashInput = JSON.stringify({
    overallAccuracy,
    last7DaysAccuracy: last7Accuracy,
    previous7DaysAccuracy: prev7Accuracy,
    totalAttempts,
    attemptsLast7Days: last7.length,
    weakTopics,
    strongTopics,
    trend,
    currentLevel,
    xp: summaryData.xp,
    coins: summaryData.coins,
  });
  const statsHash = crypto.createHash('md5').update(hashInput).digest('hex');

  return { ...summaryData, statsHash };
}

/**
 * Loads child and attempts from DB and runs computeChildSummary.
 */
export async function buildChildSummary(childId: string): Promise<ChildSummary & { statsHash: string }> {
  const child = await User.findById(childId).select('xp coins progress');
  if (!child) throw new Error('Child not found');

  const allAttempts = await Analytics.find({
    userId: new mongoose.Types.ObjectId(childId),
  }).lean();

  return computeChildSummary(
    {
      progress: child.progress,
      xp: child.xp,
      coins: child.coins,
    },
    allAttempts.map(a => ({
      isCorrect: a.isCorrect,
      createdAt: a.createdAt,
      topic: a.topic,
      timeTaken: a.timeTaken,
    }))
  );
}
