import api from './api';

export interface AiInsightData {
  summary: string;
  strengths: string[];
  areasToImprove: string[];
  suggestedActions: string[];
  encouragement: string;
}

export interface AiInsightsResponse {
  success: boolean;
  data: {
    insight: AiInsightData;
    source: 'ai' | 'rule-based';
    generatedAt: string;
    insufficientData: boolean;
  };
}

export const getAiInsights = async (
  childId: string,
  refresh = false
): Promise<AiInsightsResponse> => {
  const { data } = await api.get<AiInsightsResponse>(
    `/analytics/${childId}/ai-insights`,
    { params: refresh ? { refresh: 'true' } : {} }
  );
  return data;
};
