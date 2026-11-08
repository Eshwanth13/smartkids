import { test, describe } from 'node:test';
import assert from 'node:assert';
import { computeChildSummary, AttemptInput } from '../utils/buildChildSummary';

describe('buildChildSummary - Unit Tests', () => {
  const baseChild = {
    progress: { math: 3, english: 2, gk: 1 },
    xp: 450,
    coins: 120,
  };

  test('insufficient data: returns insufficientData = true when totalAttempts < 10', () => {
    const attempts: AttemptInput[] = Array.from({ length: 9 }, (_, i) => ({
      isCorrect: true,
      createdAt: new Date(),
      topic: 'Addition',
      timeTaken: 5000,
    }));

    const result = computeChildSummary(baseChild, attempts);

    assert.strictEqual(result.insufficientData, true);
    assert.strictEqual(result.totalAttempts, 9);
    assert.strictEqual(result.trend, 'steady');
    assert.strictEqual(result.perTopic.length, 0);
  });

  test('trend logic: identifies "improving" when last 7 days accuracy is > 5 points higher than previous 7 days', () => {
    const now = new Date('2026-11-08T12:00:00Z');
    const dayMs = 24 * 60 * 60 * 1000;

    // Previous 7 days: 5 attempts, 2 correct = 40%
    const prevAttempts: AttemptInput[] = Array.from({ length: 5 }, (_, i) => ({
      isCorrect: i < 2,
      createdAt: new Date(now.getTime() - 10 * dayMs),
      topic: 'Addition',
      timeTaken: 4000,
    }));

    // Last 7 days: 6 attempts, 5 correct = 83% (diff = +43 > +5)
    const recentAttempts: AttemptInput[] = Array.from({ length: 6 }, (_, i) => ({
      isCorrect: i < 5,
      createdAt: new Date(now.getTime() - 2 * dayMs),
      topic: 'Addition',
      timeTaken: 4000,
    }));

    const result = computeChildSummary(baseChild, [...prevAttempts, ...recentAttempts], now);

    assert.strictEqual(result.insufficientData, false);
    assert.strictEqual(result.totalAttempts, 11);
    assert.strictEqual(result.trend, 'improving');
    assert.ok(result.last7DaysAccuracy > result.previous7DaysAccuracy + 5);
  });

  test('trend logic: identifies "declining" when last 7 days accuracy is > 5 points lower than previous 7 days', () => {
    const now = new Date('2026-11-08T12:00:00Z');
    const dayMs = 24 * 60 * 60 * 1000;

    // Previous 7 days: 6 attempts, 5 correct = 83%
    const prevAttempts: AttemptInput[] = Array.from({ length: 6 }, (_, i) => ({
      isCorrect: i < 5,
      createdAt: new Date(now.getTime() - 9 * dayMs),
      topic: 'Subtraction',
      timeTaken: 3000,
    }));

    // Last 7 days: 5 attempts, 1 correct = 20% (diff = -63 < -5)
    const recentAttempts: AttemptInput[] = Array.from({ length: 5 }, (_, i) => ({
      isCorrect: i < 1,
      createdAt: new Date(now.getTime() - 3 * dayMs),
      topic: 'Subtraction',
      timeTaken: 3000,
    }));

    const result = computeChildSummary(baseChild, [...prevAttempts, ...recentAttempts], now);

    assert.strictEqual(result.insufficientData, false);
    assert.strictEqual(result.trend, 'declining');
    assert.ok(result.last7DaysAccuracy < result.previous7DaysAccuracy - 5);
  });

  test('trend logic: identifies "steady" when accuracy difference is within [-5, 5]', () => {
    const now = new Date('2026-11-08T12:00:00Z');
    const dayMs = 24 * 60 * 60 * 1000;

    // Previous 7 days: 5 attempts, 4 correct = 80%
    const prevAttempts: AttemptInput[] = Array.from({ length: 5 }, (_, i) => ({
      isCorrect: i < 4,
      createdAt: new Date(now.getTime() - 8 * dayMs),
      topic: 'Multiplication',
      timeTaken: 3500,
    }));

    // Last 7 days: 5 attempts, 4 correct = 80% (diff = 0)
    const recentAttempts: AttemptInput[] = Array.from({ length: 5 }, (_, i) => ({
      isCorrect: i < 4,
      createdAt: new Date(now.getTime() - 2 * dayMs),
      topic: 'Multiplication',
      timeTaken: 3500,
    }));

    const result = computeChildSummary(baseChild, [...prevAttempts, ...recentAttempts], now);

    assert.strictEqual(result.insufficientData, false);
    assert.strictEqual(result.trend, 'steady');
  });

  test('weak topic threshold: requires accuracy < 60% with at least 5 attempts', () => {
    const now = new Date('2026-11-08T12:00:00Z');

    // Topic A: 6 attempts, 2 correct = 33% (< 60% and >= 5) -> WEAK
    const topicA: AttemptInput[] = Array.from({ length: 6 }, (_, i) => ({
      isCorrect: i < 2,
      createdAt: now,
      topic: 'Fractions',
      timeTaken: 6000,
    }));

    // Topic B: 4 attempts, 0 correct = 0% (< 60% BUT < 5 attempts) -> NOT WEAK
    const topicB: AttemptInput[] = Array.from({ length: 4 }, () => ({
      isCorrect: false,
      createdAt: now,
      topic: 'Division',
      timeTaken: 7000,
    }));

    // Topic C: 6 attempts, 6 correct = 100% (>= 85% and >= 5) -> STRONG
    const topicC: AttemptInput[] = Array.from({ length: 6 }, () => ({
      isCorrect: true,
      createdAt: now,
      topic: 'Addition',
      timeTaken: 2500,
    }));

    const result = computeChildSummary(baseChild, [...topicA, ...topicB, ...topicC], now);

    assert.strictEqual(result.insufficientData, false);
    assert.ok(result.weakTopics.includes('Fractions'), 'Fractions should be marked weak');
    assert.ok(!result.weakTopics.includes('Division'), 'Division has < 5 attempts, must not be marked weak');
    assert.ok(result.strongTopics.includes('Addition'), 'Addition should be marked strong');
  });

  test('active days calculation: counts distinct calendar dates with attempts in last 7 days', () => {
    const now = new Date('2026-11-08T12:00:00Z');
    const dayMs = 24 * 60 * 60 * 1000;

    // Attempts on 3 distinct days within the last 7 days
    const attempts: AttemptInput[] = [
      { isCorrect: true, createdAt: new Date(now.getTime() - 1 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 1 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 2 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 4 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 4 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 4 * dayMs), topic: 'Addition' },
      // 4 more attempts to reach 10 total
      { isCorrect: true, createdAt: new Date(now.getTime() - 10 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 10 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 11 * dayMs), topic: 'Addition' },
      { isCorrect: true, createdAt: new Date(now.getTime() - 11 * dayMs), topic: 'Addition' },
    ];

    const result = computeChildSummary(baseChild, attempts, now);

    assert.strictEqual(result.insufficientData, false);
    assert.strictEqual(result.activeDaysLast7, 3);
  });
});

