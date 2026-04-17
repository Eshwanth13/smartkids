import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Loader2, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Navbar from '../components/Navbar';
import Starfield from '../components/Starfield';

const SUBJECT_THEMES: Record<string, any> = {
  math: {
    title: 'Space Adventure',
    subtitle: 'Solve cosmic equations to reach the stars!',
    emoji: '🚀',
    accentColor: 'text-blue-400',
    bgColor: 'bg-[#050810]',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
    nebula: 'bg-blue-600/10',
    planetThemes: [
      { emoji: '🌍', color: 'from-blue-500 to-indigo-600', border: 'border-blue-300' },
      { emoji: '🌙', color: 'from-gray-300 to-slate-500', border: 'border-white/30' },
      { emoji: '🔴', color: 'from-rose-500 to-orange-600', border: 'border-rose-300' },
      { emoji: '🪐', color: 'from-amber-500 to-orange-500', border: 'border-amber-300' },
      { emoji: '💜', color: 'from-purple-500 to-indigo-600', border: 'border-purple-300' },
      { emoji: '🟡', color: 'from-yellow-400 to-amber-400', border: 'border-yellow-200' },
      { emoji: '🔵', color: 'from-cyan-500 to-blue-500', border: 'border-cyan-300' },
      { emoji: '🧪', color: 'from-indigo-400 to-purple-600', border: 'border-indigo-300' },
      { emoji: '🌠', color: 'from-pink-500 to-rose-400', border: 'border-pink-300' },
      { emoji: '☀️', color: 'from-orange-400 to-yellow-500', border: 'border-orange-200' },
    ]
  },
  english: {
    title: 'Enchanted Forest',
    subtitle: 'Discover magic words hidden in the ancient trees.',
    emoji: '🪄',
    accentColor: 'text-emerald-400',
    bgColor: 'bg-[#061008]',
    bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600',
    nebula: 'bg-emerald-600/10',
    planetThemes: [
      { emoji: '🌱', color: 'from-emerald-400 to-teal-600', border: 'border-emerald-300' },
      { emoji: '🍄', color: 'from-rose-400 to-red-600', border: 'border-rose-300' },
      { emoji: '🌲', color: 'from-green-600 to-teal-800', border: 'border-green-400' },
      { emoji: '🦉', color: 'from-amber-600 to-amber-800', border: 'border-amber-400' },
      { emoji: '🧚', color: 'from-pink-400 to-purple-500', border: 'border-pink-300' },
      { emoji: '🦋', color: 'from-cyan-400 to-blue-500', border: 'border-cyan-200' },
      { emoji: '📜', color: 'from-amber-100 to-orange-200', border: 'border-amber-400' },
      { emoji: '🛖', color: 'from-orange-500 to-amber-700', border: 'border-orange-400' },
      { emoji: '💎', color: 'from-sky-300 to-blue-500', border: 'border-sky-200' },
      { emoji: '🏰', color: 'from-slate-300 to-indigo-500', border: 'border-slate-200' },
    ]
  },
  gk: {
    title: 'World Explorer',
    subtitle: 'Travel the continents and learn amazing facts!',
    emoji: '🌍',
    accentColor: 'text-amber-400',
    bgColor: 'bg-[#100b05]',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600',
    nebula: 'bg-amber-600/10',
    planetThemes: [
      { emoji: '🏜️', color: 'from-orange-400 to-amber-600', border: 'border-orange-200' },
      { emoji: '🏔️', color: 'from-sky-400 to-slate-500', border: 'border-sky-200' },
      { emoji: '🧊', color: 'from-cyan-200 to-blue-400', border: 'border-cyan-100' },
      { emoji: '🚢', color: 'from-blue-500 to-indigo-800', border: 'border-blue-300' },
      { emoji: '🏛️', color: 'from-stone-300 to-slate-500', border: 'border-stone-200' },
      { emoji: '⛩️', color: 'from-red-500 to-rose-700', border: 'border-red-300' },
      { emoji: '🛕', color: 'from-amber-500 to-orange-700', border: 'border-amber-300' },
      { emoji: '🗽', color: 'from-teal-300 to-emerald-600', border: 'border-teal-200' },
      { emoji: '🐯', color: 'from-orange-500 to-red-600', border: 'border-orange-300' },
      { emoji: '🔭', color: 'from-indigo-500 to-purple-800', border: 'border-indigo-300' },
    ]
  }
};

const WorldMap: React.FC = () => {
  const { subject = 'math' } = useParams();
  const navigate = useNavigate();
  const { child } = useAuthStore();
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = SUBJECT_THEMES[subject] || SUBJECT_THEMES.math;

  useEffect(() => {
    setLoading(true);
    api.get(`/game/levels?subject=${subject}`)
      .then(({ data }) => setLevels(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [subject]);

  if (loading) return (
    <div className={`min-h-screen ${theme.bgColor} flex items-center justify-center`}>
      <Loader2 className={`w-12 h-12 ${theme.accentColor} animate-spin`} />
    </div>
  );

  const currentLevel = (child?.progress as any)?.[subject] ?? 1;

  return (
    <div className={`min-h-screen w-full ${theme.bgColor} flex flex-col overflow-hidden relative`}>
      <Starfield />
      
      {/* Background Image with Parallax-like Overlay */}
      <div
        className="absolute inset-0 -z-0 opacity-40"
        style={{
          backgroundImage: `url("${theme.bgImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className={`absolute inset-0 ${theme.nebula} blur-[100px] -z-0 opacity-50`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 -z-0" />

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar variant={subject === 'math' ? 'space' : 'nature'} />
      </div>

      {/* Stats Strip */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10 mx-6 mt-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group px-3 py-1.5 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Subjects</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Star className="text-kids-yellow fill-kids-yellow w-4 h-4 ml-0.5" />
            <span className="text-white font-black text-sm pr-1">{child?.xp ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-white font-black text-sm pr-1">{child?.coins ?? 0}</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
           <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Pilot Status</span>
           <div className="px-3 py-1 bg-white/10 rounded-lg text-white font-bold text-xs border border-white/10 uppercase tracking-wider">
              Ready for Mission
           </div>
        </div>
      </div>

      {/* Title */}
      <div className="relative text-center pt-10 shrink-0 z-10 px-4">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-4 mb-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/10 backdrop-blur-md"
        >
            <span className="text-4xl animate-float">{theme.emoji}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-display uppercase tracking-tight">
                {theme.title}
            </h1>
        </motion.div>
        <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto font-medium">
          {theme.subtitle}
        </p>
      </div>

      {/* Level Grid */}
      <div className="relative flex-1 flex items-center justify-center p-8 z-10 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-16 gap-x-12 w-full max-w-7xl py-12">
          {levels.map((level, index) => {
            const planetTheme = theme.planetThemes[index] || theme.planetThemes[0];
            const isCompleted = level.levelNumber < currentLevel;
            const isCurrent = level.levelNumber === currentLevel;
            const isLocked = level.levelNumber > currentLevel;

            return (
              <motion.div
                key={level._id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, type: 'spring', damping: 15 }}
                className="flex flex-col items-center group"
              >
                {/* Level Marker */}
                <div className={`text-[10px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-[0.2em] transition-all duration-300 ${
                  isLocked ? 'bg-white/5 text-white/20' : 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                }`}>
                  Mission {level.levelNumber}
                </div>

                {/* Node */}
                <motion.div
                  whileHover={!isLocked ? { scale: 1.12, rotate: 5, y: -5 } : {}}
                  whileTap={!isLocked ? { scale: 0.92 } : {}}
                  onClick={() => !isLocked && navigate(`/game/${level._id}`)}
                  className={`
                    relative w-28 h-28 md:w-36 md:h-36 rounded-full
                    flex items-center justify-center text-5xl md:text-6xl
                    transition-all duration-500 shadow-2xl border-4
                    ${isLocked
                      ? 'bg-slate-900/80 border-white/5 grayscale opacity-30 cursor-not-allowed'
                      : `bg-gradient-to-br ${planetTheme.color} ${planetTheme.border} cursor-pointer hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]`
                    }
                    ${isCurrent ? 'ring-8 ring-white/10 ring-offset-4 ring-offset-transparent' : ''}
                  `}
                >
                  {isLocked ? (
                    <Lock className="text-white/20 w-10 h-10" />
                  ) : (
                    <span className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500">{planetTheme.emoji}</span>
                  )}

                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-2.5 border-4 border-black/50 shadow-2xl z-20">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {isCurrent && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-[-12px] rounded-full border-2 border-white/20 p-4"
                     />
                  )}
                </motion.div>

                {/* Label */}
                <div className={`mt-6 px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 min-w-[120px] text-center ${
                    isLocked 
                      ? 'bg-white/5 text-white/10 border border-transparent' 
                      : isCurrent
                        ? 'bg-white/20 text-white border border-white/20 shadow-xl'
                        : 'bg-black/40 text-white/80 border border-white/10 group-hover:bg-white/10 group-hover:text-white transition-all'
                }`}>
                    {level.topic}
                </div>

                {isCompleted && (
                    <button
                        onClick={() => navigate(`/game/${level._id}`)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Replay
                    </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
