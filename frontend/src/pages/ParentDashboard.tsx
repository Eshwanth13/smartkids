import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Loader2, Star, Trash2, Key, Plus,
  Target, Award, BookOpen, Calculator, Globe2, BarChart3, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Navbar from '../components/Navbar';

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [activeSubject, setActiveSubject] = useState<string>('overall');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchChildren = async () => {
    try {
      const { data } = await api.get('/parent/children');
      setChildren(data);
      if (data.length > 0 && !selectedChild) setSelectedChild(data[0]);
    } catch (err) {
      console.error('Failed to fetch children', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedChild) return;
    setAnalyticsLoading(true);
    try {
      const { data } = await api.get(`/parent/child/${selectedChild._id}/analytics`);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'parent') { navigate('/login'); return; }
    fetchChildren();
  }, []);

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [selectedChild?._id]);

  const handleDeleteChild = async (childId: string, childName: string) => {
    if (!window.confirm(`Delete ${childName}? All their progress will be permanently removed.`)) return;
    try {
      await api.delete(`/parent/child/${childId}`);
      const updated = children.filter(c => c._id !== childId);
      setChildren(updated);
      setSelectedChild(updated[0] || null);
    } catch {
      alert('Failed to remove explorer. Please try again.');
    }
  };

  const filteredAnalytics = () => {
    if (!analyticsData?.analytics) return [];
    if (activeSubject === 'overall') return analyticsData.analytics;
    return analyticsData.analytics.filter((a: any) => a.subject === activeSubject);
  };

  const buildChartData = (analytics: any[]) => {
    if (!analytics?.length) return [];
    return analytics.slice(-15).map((a: any, i: number) => ({
      name: i + 1,
      result: a.isCorrect ? 100 : 0,
      subject: a.subject
    }));
  };

  const buildTopicData = (analytics: any[]) => {
    if (!analytics?.length) return [];
    const map: Record<string, { total: number; correct: number }> = {};
    analytics.forEach((a: any) => {
      const t = a.topic || 'General';
      if (!map[t]) map[t] = { total: 0, correct: 0 };
      map[t].total++;
      if (a.isCorrect) map[t].correct++;
    });
    return Object.entries(map).map(([name, d]) => ({
      name,
      value: Math.round((d.correct / d.total) * 100),
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-kids-purple animate-spin" />
    </div>
  );

  const displayData = filteredAnalytics();
  const chartData = buildChartData(displayData);
  const topicData = buildTopicData(displayData);

  // Calculate dynamic stats for filtered view
  const currentAccuracy = displayData.length > 0 
    ? Math.round((displayData.filter((a: any) => a.isCorrect).length / displayData.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar variant="parent" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Parent Command Center</h1>
            <p className="text-slate-500 text-lg mt-1 font-medium">Tracking the progress of your little explorers</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/add-child')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-all w-fit"
          >
            <Plus className="w-5 h-5" /> Add New Explorer
          </motion.button>
        </div>

        {/* Child Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {children.map((child) => {
            const isSelected = selectedChild?._id === child._id;
            return (
              <motion.div
                key={child._id}
                onClick={() => setSelectedChild(child)}
                className={`cursor-pointer rounded-[2rem] p-6 border-4 transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'bg-white border-indigo-600 ring-4 ring-indigo-50' 
                    : 'bg-white border-transparent hover:border-indigo-100'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl shadow-inner border border-indigo-100">
                    {child.avatar ? <img src={child.avatar} alt="avatar" className="w-12 h-12" /> : '🚀'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{child.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-sm font-semibold mt-1">
                      <Key className="w-4 h-4" /> PIN: {child.pin}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="bg-blue-50/50 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-blue-600 font-bold uppercase">Math</p>
                    <p className="font-black text-blue-900">Lv {child.progress?.math || 1}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">Eng</p>
                    <p className="font-black text-emerald-900">Lv {child.progress?.english || 1}</p>
                  </div>
                  <div className="bg-amber-50/50 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-amber-600 font-bold uppercase">GK</p>
                    <p className="font-black text-amber-900">Lv {child.progress?.gk || 1}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteChild(child._id, child.name); }}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs & Analytics */}
        {selectedChild && (
          <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-indigo-100/50 border border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-10 bg-indigo-600 rounded-full" />
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mission Analytics</h2>
                </div>
                <button
                  onClick={fetchAnalytics}
                  disabled={analyticsLoading}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all group"
                  title="Refresh Data"
                >
                  <RotateCcw className={`w-5 h-5 ${analyticsLoading ? 'animate-spin text-indigo-600' : 'group-active:rotate-180 transition-transform duration-500'}`} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-200">
                <TabButton 
                  active={activeSubject === 'overall'} 
                  onClick={() => setActiveSubject('overall')} 
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Overall"
                />
                <TabButton 
                  active={activeSubject === 'math'} 
                  onClick={() => setActiveSubject('math')} 
                  icon={<Calculator className="w-4 h-4" />}
                  label="Math"
                />
                <TabButton 
                  active={activeSubject === 'english'} 
                  onClick={() => setActiveSubject('english')} 
                  icon={<BookOpen className="w-4 h-4" />}
                  label="English"
                />
                <TabButton 
                  active={activeSubject === 'gk'} 
                  onClick={() => setActiveSubject('gk')} 
                  icon={<Globe2 className="w-4 h-4" />}
                  label="GK"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <AnalyticsCard label="Accuracy" value={`${currentAccuracy}%`} color="indigo" icon={<Target />} />
              <AnalyticsCard label="XP Points" value={selectedChild.xp} color="amber" icon={<Star />} />
              <AnalyticsCard label="Reward Coins" value={selectedChild.coins} color="emerald" icon={<Award />} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Chart */}
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 h-[400px]">
                <h4 className="text-xl font-bold mb-6 text-slate-800">Recent Answer Trend</h4>
                {analyticsLoading ? <LoadingSpinner /> : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                        formatter={(v) => [`${v}%`, 'Result']}
                      />
                      <Line type="monotone" dataKey="result" stroke="#4f46e5" strokeWidth={5} dot={{ r: 6, fill: '#4f46e5' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <EmptyState text="Complete more levels to see trends" />}
              </div>

              {/* Progress Bars */}
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                <h4 className="text-xl font-bold mb-8 text-slate-800">Topic Proficiency</h4>
                {analyticsLoading ? <LoadingSpinner /> : topicData.length > 0 ? (
                  <div className="space-y-6">
                    {topicData.map((topic, i) => (
                      <div key={i}>
                        <div className="flex justify-between font-bold text-slate-600 mb-2 px-1">
                          <span className="text-sm">{topic.name}</span>
                          <span className="text-sm">{topic.value}%</span>
                        </div>
                        <div className="h-4 bg-white rounded-full overflow-hidden border border-slate-200 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.value}%` }}
                            className="h-full bg-indigo-600 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Start your adventure to build proficiency" />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-bold transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'
    }`}
  >
    {icon} {label}
  </button>
);

const AnalyticsCard = ({ label, value, color, icon }: any) => {
    const colors: any = {
        indigo: 'text-indigo-600 bg-indigo-50',
        amber: 'text-amber-600 bg-amber-50',
        emerald: 'text-emerald-600 bg-emerald-50'
    };
    return (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
};

const EmptyState = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
        <Star className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold text-lg">{text}</p>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-48">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
);

export default ParentDashboard;
