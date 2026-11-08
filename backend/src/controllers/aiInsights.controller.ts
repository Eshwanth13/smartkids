import { Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';
import AiInsight from '../models/AiInsight';
import { buildChildSummary } from '../utils/buildChildSummary';
import { getAiGeneratedInsights } from '../services/aiInsights.service';
import { generateRuleBasedInsights } from '../utils/ruleBasedInsights';
import { aiConfig } from '../config/aiConfig';

const ParamsSchema = z.object({
  childId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid childId format'),
});

const QuerySchema = z.object({
  refresh: z.string().optional().transform(v => v === 'true'),
});

// In-memory rate limiting map for forced refresh per child: childId -> timestamp ms
const refreshRateLimit = new Map<string, number>();
const REFRESH_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

// @desc    Get AI-powered insights for a child
// @route   GET /api/v1/analytics/:childId/ai-insights or /api/analytics/:childId/ai-insights
export const getAiInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  // 1. Validate route params
  const paramsResult = ParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ success: false, message: 'Invalid childId parameter' });
    return;
  }

  const queryResult = QuerySchema.safeParse(req.query);
  const forceRefresh = queryResult.success ? queryResult.data.refresh : false;

  const { childId } = paramsResult.data;
  const parentId = req.user?._id?.toString();

  if (!parentId) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  // 2. Fetch and verify child ownership
  const child = await User.findById(childId).select('_id role parentId');
  if (!child || child.role !== 'child') {
    res.status(404).json({ success: false, message: 'Child not found' });
    return;
  }

  if (!child.parentId || child.parentId.toString() !== parentId) {
    res.status(403).json({ success: false, message: 'Access denied: not your child' });
    return;
  }

  const now = Date.now();

  // 3. Handle forced refresh rate limiting (1 per child per 10 minutes)
  if (forceRefresh) {
    const lastRefresh = refreshRateLimit.get(childId);
    if (lastRefresh && now - lastRefresh < REFRESH_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((REFRESH_COOLDOWN_MS - (now - lastRefresh)) / 1000);
      res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before refreshing again.`,
      });
      return;
    }
  }

  try {
    // 4. Build child statistics summary
    const summary = await buildChildSummary(childId);

    // 5. Edge case: insufficient practice data (< 10 questions)
    if (summary.insufficientData) {
      res.json({
        success: true,
        data: {
          insight: {
            summary: `Your child has completed ${summary.totalAttempts} practice question${summary.totalAttempts === 1 ? '' : 's'} so far. AI insights unlock after 10 questions!`,
            strengths: ['Great enthusiasm taking on new practice challenges.'],
            areasToImprove: ['Complete a few more questions to unlock personalized insights.'],
            suggestedActions: [
              `Encourage your child to answer ${10 - summary.totalAttempts} more question${10 - summary.totalAttempts === 1 ? '' : 's'} to unlock their full AI report.`,
              'Spend 5-10 minutes practising together to build initial momentum.',
            ],
            encouragement: 'Every question is a step forward — keep going! 🚀',
          },
          source: 'rule-based',
          generatedAt: new Date().toISOString(),
          insufficientData: true,
        },
      });
      return;
    }

    const { statsHash } = summary;
    const cacheMaxAge = aiConfig.AI_INSIGHTS_CACHE_HOURS * 60 * 60 * 1000;

    // 6. Check cache if not forcing refresh
    if (!forceRefresh) {
      const cached = await AiInsight.findOne({ childId: new mongoose.Types.ObjectId(childId) })
        .sort({ generatedAt: -1 })
        .lean();

      if (
        cached &&
        cached.statsHash === statsHash &&
        now - new Date(cached.generatedAt).getTime() < cacheMaxAge
      ) {
        res.json({
          success: true,
          data: {
            insight: cached.insight,
            source: cached.source,
            generatedAt: new Date(cached.generatedAt).toISOString(),
            insufficientData: false,
          },
        });
        return;
      }
    }

    // 7. Request AI insights or fallback to rule-based
    let aiResult = null;
    try {
      aiResult = await getAiGeneratedInsights(summary);
    } catch (err: any) {
      console.warn('[AI Insights] Generation encountered an error, falling back to rule-based:', err?.message);
    }

    let insight: any;
    let source: 'ai' | 'rule-based';
    let modelUsed: string | undefined;

    if (aiResult) {
      insight = aiResult.data;
      source = 'ai';
      modelUsed = aiResult.modelUsed;
    } else {
      insight = generateRuleBasedInsights(summary);
      source = 'rule-based';
    }

    const generatedAt = new Date();

    // 8. Cache the insight in MongoDB
    try {
      await AiInsight.findOneAndUpdate(
        { childId: new mongoose.Types.ObjectId(childId) },
        {
          childId: new mongoose.Types.ObjectId(childId),
          insight,
          source,
          modelUsed,
          statsHash,
          generatedAt,
        },
        { upsert: true, new: true }
      );
    } catch (cacheErr: any) {
      console.warn('[AI Insights] Could not cache insight:', cacheErr?.message);
    }

    // Record refresh timestamp on successful generation
    if (forceRefresh) {
      refreshRateLimit.set(childId, now);
    }

    res.json({
      success: true,
      data: {
        insight,
        source,
        generatedAt: generatedAt.toISOString(),
        insufficientData: false,
      },
    });
  } catch (err: any) {
    console.error('[AI Insights] Unhandled error, returning safe rule-based response:', err?.message || err);
    try {
      const summary = await buildChildSummary(childId);
      const fallbackInsight = generateRuleBasedInsights(summary);
      res.json({
        success: true,
        data: {
          insight: fallbackInsight,
          source: 'rule-based',
          generatedAt: new Date().toISOString(),
          insufficientData: false,
        },
      });
    } catch {
      res.status(500).json({ success: false, message: 'Unable to load insights at this time' });
    }
  }
};
