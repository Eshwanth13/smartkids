import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Zap, ChevronRight, Star, AlertCircle, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';
import { getAiInsights, type AiInsightData } from '../services/analyticsService';

interface Props {
  childId: string;
}

const REFRESH_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

const SkeletonLine = ({ width = 'w-full' }: { width?: string }) => (
  <div className={`h-4 bg-slate-200 rounded-full animate-pulse ${width}`} />
);

const SectionItem = ({ text, icon }: { text: string; icon: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
  </div>
);

const AiInsightsCard: React.FC<Props> = ({ childId }) => {
  const [insight, setInsight] = useState<AiInsightData | null>(null);
  const [source, setSource] = useState<'ai' | 'rule-based'>('rule-based');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insufficientData, setInsufficientData] = useState(false);
  const [refreshCooldown, setRefreshCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    setRefreshCooldown(true);
    setCooldownSeconds(REFRESH_COOLDOWN_MS / 1000);
    cooldownTimer.current = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(cooldownTimer.current!);
          setRefreshCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const fetchInsights = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAiInsights(childId, refresh);
      if (response.success && response.data) {
        setInsight(response.data.insight);
        setSource(response.data.source);
        setGeneratedAt(response.data.generatedAt);
        setInsufficientData(response.data.insufficientData);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Could not load insights. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchInsights(false);
    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
  }, [fetchInsights]);

  const handleRefresh = async () => {
    if (loading || refreshCooldown) return;
    startCooldown();
    await fetchInsights(true);
  };

  const formatTimeAgo = (isoDate: string): string => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const isAi = source === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/20 pointer-events-none rounded-[2.5rem]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Insights</h3>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Child Progress Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Source badge */}
          {!loading && insight && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isAi
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {isAi ? '✨ AI-powered' : '📊 Smart summary'}
            </motion.span>
          )}

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={loading || refreshCooldown}
            title={refreshCooldown ? `Refresh available in ${Math.ceil(cooldownSeconds / 60)}m` : 'Refresh insights'}
            className={`p-2.5 rounded-xl border transition-all group ${
              loading || refreshCooldown
                ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <SkeletonLine />
                <SkeletonLine width="w-4/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                    <div className="h-3 bg-slate-200 rounded-full w-2/3 animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded-full animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded-full w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-slate-100 rounded-2xl animate-pulse w-full" />
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <AlertCircle className="w-10 h-10 text-red-300 mb-3" />
              <p className="text-slate-500 font-medium mb-4">{error}</p>
              <button
                onClick={() => fetchInsights(false)}
                className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Try again
              </button>
            </motion.div>
          )}

          {!loading && !error && insufficientData && (
            <motion.div
              key="insufficient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Star className="w-12 h-12 text-amber-300 mb-4 animate-bounce" />
              <h4 className="text-slate-800 font-black text-xl mb-2 tracking-tight">Almost Ready! ⭐</h4>
              <p className="text-slate-600 font-medium max-w-md mb-4 leading-relaxed">
                {insight?.summary || 'Keep practising — AI insights unlock after 10 questions. Every attempt counts!'}
              </p>
              {insight?.suggestedActions?.[0] && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 max-w-md text-amber-800 text-xs font-bold shadow-sm">
                  💡 {insight.suggestedActions[0]}
                </div>
              )}
            </motion.div>
          )}

          {!loading && !error && !insufficientData && insight && (
            <motion.div
              key="insight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Summary */}
              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <p className="text-slate-700 font-medium leading-relaxed">{insight.summary}</p>
              </div>

              {/* Three sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Strengths */}
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <h4 className="font-black text-emerald-800 text-sm uppercase tracking-wider">Strengths</h4>
                  </div>
                  <div className="space-y-1">
                    {insight.strengths.map((s, i) => (
                      <SectionItem
                        key={i}
                        text={s}
                        icon={<ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />}
                      />
                    ))}
                  </div>
                </div>

                {/* Areas to improve */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <h4 className="font-black text-amber-800 text-sm uppercase tracking-wider">To Improve</h4>
                  </div>
                  <div className="space-y-1">
                    {insight.areasToImprove.map((a, i) => (
                      <SectionItem
                        key={i}
                        text={a}
                        icon={<ChevronRight className="w-3.5 h-3.5 text-amber-500 mt-0.5" />}
                      />
                    ))}
                  </div>
                </div>

                {/* Suggested actions */}
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <h4 className="font-black text-blue-800 text-sm uppercase tracking-wider">This Week</h4>
                  </div>
                  <div className="space-y-1">
                    {insight.suggestedActions.map((action, i) => (
                      <SectionItem
                        key={i}
                        text={action}
                        icon={<ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5" />}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Encouragement */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <Zap className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <p className="text-indigo-700 font-semibold text-sm italic">{insight.encouragement}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-slate-400 text-xs font-medium">
                  {generatedAt ? `Generated ${formatTimeAgo(generatedAt)}` : ''}
                </p>
                {refreshCooldown && (
                  <p className="text-slate-400 text-xs font-medium">
                    Refresh in {Math.floor(cooldownSeconds / 60)}:{String(cooldownSeconds % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AiInsightsCard;
