import { z } from 'zod';

export const AiInsightResponseSchema = z.object({
  summary: z.string().max(500),
  strengths: z.array(z.string()).min(1).max(3),
  areasToImprove: z.array(z.string()).min(1).max(3),
  suggestedActions: z.array(z.string()).min(2).max(3),
  encouragement: z.string().max(200),
});

export type AiInsightResponse = z.infer<typeof AiInsightResponseSchema>;

export interface ChildSummary {
  overallAccuracy: number;
  last7DaysAccuracy: number;
  previous7DaysAccuracy: number;
  trend: 'improving' | 'steady' | 'declining';
  totalAttempts: number;
  attemptsLast7Days: number;
  perTopic: Array<{
    topic: string;
    attempts: number;
    accuracy: number;
    avgTimeSec: number;
  }>;
  weakTopics: string[];
  strongTopics: string[];
  avgTimePerQuestionSec: number;
  hintsUsedCount: number;
  hintRate: number;
  currentLevel: { math: number; english: number; gk: number };
  gradeBand?: string;
  xp: number;
  coins: number;
  activeDaysLast7: number;
  insufficientData: boolean;
}

export interface AiInsightApiResponse {
  success: boolean;
  data: {
    insight: AiInsightResponse;
    source: 'ai' | 'rule-based';
    generatedAt: string;
    insufficientData: boolean;
  };
}
