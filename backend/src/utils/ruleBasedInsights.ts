import { AiInsightResponse, ChildSummary } from '../types/aiInsights.types';

export function generateRuleBasedInsights(summary: ChildSummary): AiInsightResponse {
  const { overallAccuracy, last7DaysAccuracy, previous7DaysAccuracy, trend, weakTopics, strongTopics, attemptsLast7Days, activeDaysLast7 } = summary;

  // Summary
  let summaryText = '';
  if (overallAccuracy >= 80) {
    summaryText = `Overall accuracy is an impressive ${overallAccuracy}% — your child is doing great!`;
  } else if (overallAccuracy >= 60) {
    summaryText = `Overall accuracy is ${overallAccuracy}%, showing solid effort and steady growth.`;
  } else {
    summaryText = `Overall accuracy is ${overallAccuracy}%. Every attempt is a learning step forward!`;
  }

  if (trend === 'improving' && last7DaysAccuracy > 0) {
    summaryText += ` This week's accuracy (${last7DaysAccuracy}%) is up from last week (${previous7DaysAccuracy}%) — great momentum!`;
  } else if (trend === 'declining' && last7DaysAccuracy > 0) {
    summaryText += ` This week (${last7DaysAccuracy}%) is a bit lower than last week (${previous7DaysAccuracy}%) — a great opportunity to focus and bounce back.`;
  } else if (last7DaysAccuracy > 0) {
    summaryText += ` Performance has been consistent this week at ${last7DaysAccuracy}%.`;
  }

  // Strengths
  const strengths: string[] = [];
  if (strongTopics.length > 0) {
    strengths.push(`Excellent at ${strongTopics.slice(0, 2).join(' and ')} — accuracy above 85%!`);
  }
  if (overallAccuracy >= 70) {
    strengths.push('Consistently answering most questions correctly shows great understanding.');
  }
  if (activeDaysLast7 >= 5) {
    strengths.push(`Great learning habit! Practised ${activeDaysLast7} days this week.`);
  } else if (attemptsLast7Days > 10) {
    strengths.push(`Completed ${attemptsLast7Days} practice questions this week — excellent effort!`);
  }
  if (strengths.length === 0) {
    strengths.push('Every question attempted is a building block for future success.');
  }

  // Areas to improve
  const areasToImprove: string[] = [];
  if (weakTopics.length > 0) {
    areasToImprove.push(`${weakTopics.slice(0, 2).join(' and ')} — a little more practice here will make a big difference.`);
  }
  if (trend === 'declining') {
    areasToImprove.push('Try to build back momentum with a few focused sessions this week.');
  }
  if (activeDaysLast7 < 3 && attemptsLast7Days < 5) {
    areasToImprove.push('More frequent short practice sessions will help build long-term retention.');
  }
  if (areasToImprove.length === 0) {
    areasToImprove.push('Keep challenging yourself with harder questions as you grow stronger!');
  }

  // Suggested actions
  const suggestedActions: string[] = [];
  if (weakTopics.length > 0) {
    suggestedActions.push(`Spend 10 minutes a day this week on ${weakTopics[0]} to build confidence.`);
  }
  if (activeDaysLast7 < 5) {
    suggestedActions.push('Try to practise a little every day — even 5 questions a day builds a great habit!');
  }
  suggestedActions.push('Celebrate every correct answer together — positive encouragement goes a long way!');

  if (suggestedActions.length < 2) {
    suggestedActions.push('Review recently missed questions together and talk through the answers.');
  }

  // Encouragement
  const encouragements = [
    'Every question is a step forward on the adventure — keep going! 🚀',
    'Learning is a journey, and your child is on the right path! ⭐',
    'With your support and their hard work, the sky is the limit! 🌟',
    'Each practice session makes them smarter and stronger! 💪',
  ];
  const encouragement = encouragements[Math.floor(overallAccuracy / 25) % encouragements.length];

  return {
    summary: summaryText,
    strengths: strengths.slice(0, 3),
    areasToImprove: areasToImprove.slice(0, 3),
    suggestedActions: suggestedActions.slice(0, 3),
    encouragement,
  };
}
