import axios from 'axios';
import { aiConfig, hasOpenRouterKey } from '../config/aiConfig';
import { AiInsightResponse, AiInsightResponseSchema, ChildSummary } from '../types/aiInsights.types';

const SYSTEM_PROMPT = `You are a warm, encouraging learning assistant helping parents understand their child's progress in a gamified maths learning app for Classes 1-8. The app has a no-fail philosophy: mistakes are learning opportunities. Use ONLY the statistics provided; never invent numbers. Never make medical, psychological or diagnostic claims. Never compare the child to other children. Keep language simple, positive and practical. Respond with valid JSON only, no markdown, no extra text.`;

export function buildUserMessage(summary: Omit<ChildSummary, 'insufficientData'>): string {
  // Anonymised stats only - strictly NO child names, parent names, IDs, PINs, or emails
  const anonymisedStats = {
    gradeBand: summary.gradeBand || 'Class 1-8',
    overallAccuracy: summary.overallAccuracy,
    last7DaysAccuracy: summary.last7DaysAccuracy,
    previous7DaysAccuracy: summary.previous7DaysAccuracy,
    trend: summary.trend,
    totalAttempts: summary.totalAttempts,
    attemptsLast7Days: summary.attemptsLast7Days,
    activeDaysLast7: summary.activeDaysLast7,
    weakTopics: summary.weakTopics,
    strongTopics: summary.strongTopics,
    perTopic: summary.perTopic.map(t => ({
      topic: t.topic,
      attempts: t.attempts,
      accuracy: t.accuracy,
      avgTimeSec: t.avgTimeSec,
    })),
    avgTimePerQuestionSec: summary.avgTimePerQuestionSec,
    hintRate: summary.hintRate,
    currentLevel: summary.currentLevel,
    xp: summary.xp,
    coins: summary.coins,
  };

  return `Analyse this child's recent performance and respond in exactly this JSON shape: { "summary": string (max 2 sentences), "strengths": string[] (1-3 items), "areasToImprove": string[] (1-3 items, framed positively), "suggestedActions": string[] (2-3 concrete things the parent can do this week), "encouragement": string (1 short sentence) }. Statistics: ${JSON.stringify(anonymisedStats)}`;
}

export function extractAndParseJson(text: string): any {
  let cleaned = text.trim();
  // Strip markdown code fences if present (```json ... ``` or ``` ...)
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }
  // Isolate outermost JSON object bounds if extra text surrounds it
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

async function callOpenRouterModel(
  model: string,
  summary: Omit<ChildSummary, 'insufficientData'>
): Promise<{ data: AiInsightResponse; modelUsed: string }> {
  const response = await axios.post(
    `${aiConfig.OPENROUTER_BASE_URL}/chat/completions`,
    {
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(summary) },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    },
    {
      headers: {
        Authorization: `Bearer ${aiConfig.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'SmartKids',
      },
      timeout: aiConfig.AI_INSIGHTS_TIMEOUT_MS,
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from model');
  }

  const parsed = extractAndParseJson(content);
  const validated = AiInsightResponseSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(`Schema validation failed: ${JSON.stringify(validated.error.flatten())}`);
  }

  return { data: validated.data, modelUsed: model };
}

const isRetryableError = (err: any): boolean => {
  // Network errors, timeouts, or JSON parse errors are retryable
  if (!err.response) return true;
  const status = err.response.status;
  // 429 (rate limit), 404 (model removed/unavailable), 5xx (server error)
  return status === 429 || status === 404 || status >= 500;
};

export async function getAiGeneratedInsights(
  summary: Omit<ChildSummary, 'insufficientData'>
): Promise<{ data: AiInsightResponse; modelUsed: string } | null> {
  if (!hasOpenRouterKey()) {
    return null;
  }

  const models = [
    aiConfig.OPENROUTER_MODEL_PRIMARY,
    aiConfig.OPENROUTER_MODEL_FALLBACK,
    aiConfig.OPENROUTER_MODEL_LAST_RESORT,
  ];

  for (const model of models) {
    try {
      const result = await callOpenRouterModel(model, summary);
      // Log model name only - never log API key or prompt content
      console.log(`[AI Insights] Model succeeded: ${result.modelUsed}`);
      return result;
    } catch (err: any) {
      const status = err.response?.status;
      const errorMsg = status ? `HTTP ${status}` : err.message || 'Unknown error';
      console.warn(`[AI Insights] Model ${model} failed (${errorMsg}), checking fallback...`);

      // If unauthorized (invalid API key), stop calling further models
      if (status === 401 || status === 403) {
        console.warn('[AI Insights] Authentication error with OpenRouter API key; falling back to rule-based.');
        return null;
      }

      if (!isRetryableError(err)) {
        return null;
      }
      // Continue down the fallback chain
    }
  }

  return null;
}
