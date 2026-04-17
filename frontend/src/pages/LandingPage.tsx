import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, ShieldCheck, Sparkles, BookOpen, Calculator, Globe2, 
  ArrowRight, Heart, Star, Layout, Zap, Users, Brain, Mic, 
  Clock, CheckCircle2, XCircle
} from 'lucide-react';
import Starfield from '../components/Starfield';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-hidden relative font-sans">
      <Starfield />

      {/* Nebula Backdrop */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-display">
          <span className="text-3xl">🚀</span>
          <span>SmartKids</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Available Missions</a>
          <a href="#difference" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Our Difference</a>
          <a href="#roadmap" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Roadmap</a>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full mb-8 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2"
        >
          <Sparkles className="w-3 h-3 text-yellow-400" />
          The Ultimate Learning Mission
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl lg:text-9xl font-display mb-8 leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          Learning is <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-500">
            an Adventure.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-xl md:text-2xl max-w-3xl mb-12 font-medium"
        >
          Turning Math, English, and GK into a journey through the stars. No failure, just exploration and joy-first design.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="flex-1 bg-white text-black px-8 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-white/10 hover:bg-white/90 transition-all flex items-center justify-center gap-3 group"
          >
            <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Child Launch
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="flex-1 bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-6 rounded-3xl font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-6 h-6" />
            Parent Hub
          </motion.button>
        </div>
      </section>

      {/* Available Missions (Features) */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-center whitespace-nowrap">Available Now</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MissionCard icon={<Globe2 />} title="3 Subject Maps" desc="Math, English & GK maps with 10 unique levels each." />
          <MissionCard icon={<Zap />} title="Dynamic Questions" desc="Infinite variety! Questions are generated on the fly." />
          <MissionCard icon={<Heart />} title="No-Fail Hearts" desc="First mistakes earn hints, not penalties. No more stress!" />
          <MissionCard icon={<Zap className="text-kids-yellow" />} title="Digital Pet (Zappy)" desc="Your companion reacts to your wins and study sessions." />
          <MissionCard icon={<Star />} title="Prizes & Progress" desc="Earn XP and Coins as you progress through missions." />
          <MissionCard icon={<Layout />} title="Parent Analytics" desc="Detailed performance tracking across all subjects." />
        </div>
      </section>

      {/* Why We Are Different (Comparison) */}
      <section id="difference" className="relative z-10 max-w-7xl mx-auto px-8 py-32 overflow-hidden">
        <div className="text-center mb-20 px-4">
          <h2 className="text-4xl md:text-6xl font-display mb-6">Built Differently.</h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">Traditional apps make kids feel bad for mistakes. SmartKids is built for emotional safety.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Traditional Apps */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/5 p-10 rounded-[3rem] border border-white/5"
          >
            <div className="text-rose-500 font-black tracking-widest uppercase mb-8 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Other Apps
            </div>
            <ul className="space-y-6">
              <ComparisonItem bad text="Harsh 'WRONG!' messages that stress kids out." />
              <ComparisonItem bad text="Heavy competition that leads to anxiety." />
              <ComparisonItem bad text="Static, repetitive questions that become boring." />
              <ComparisonItem bad text="Focus only on scores, not joy or exploration." />
            </ul>
          </motion.div>

          {/* SmartKids */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-blue-600/10 p-10 rounded-[3rem] border border-blue-500/20 shadow-2xl shadow-blue-500/10"
          >
            <div className="text-emerald-400 font-black tracking-widest uppercase mb-8 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> SmartKids Path
            </div>
            <ul className="space-y-6 text-xl">
              <ComparisonItem text="True No-Fail Learning with helper hints." />
              <ComparisonItem text="3 Beautiful Themed Worlds (Space, Forest, World)." />
              <ComparisonItem text="Dynamic Question Engine — always fresh!" />
              <ComparisonItem text="Age-appropriate, India-specific GK facts." />
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Roadmap (Coming Soon) */}
      <section id="roadmap" className="relative z-10 max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display mb-4">Coming Soon</h2>
          <p className="text-white/40 text-lg uppercase tracking-widest font-black">Future Horizons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RoadmapCard icon={<Brain />} title="Adaptive Difficulty" desc="Learning paths that adjust based on your unique strengths." />
          <RoadmapCard icon={<Zap />} title="AI Smart Explained" desc="Visual hint explanations that teach the 'Why' behind answers." />
          <RoadmapCard icon={<Mic />} title="Voice English" desc="Interactive speaking practice using advanced recognition." />
          <RoadmapCard icon={<Clock />} title="Streaks & Rewards" desc="Daily milestones, leaderboards, and super-prizes." />
          <RoadmapCard icon={<Users />} title="Friend Challenges" desc="Invite friends for cooperative missions and team games." />
          <RoadmapCard icon={<Globe2 />} title="New Subjects" desc="History, Science & Discovery missions currently in the lab." />
        </div>
      </section>

      {/* Call to action */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-32">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[3rem] p-12 lg:p-20 text-center shadow-2xl shadow-indigo-500/40">
           <h2 className="text-4xl md:text-6xl font-display mb-6">Ready to Launch?</h2>
           <p className="text-white/80 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">Join thousands of mini-explorers on the most joyful learning mission ever built.</p>
           <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/login')} className="bg-white text-indigo-700 font-black px-12 py-5 rounded-2xl text-2xl hover:bg-slate-100 transition-all">Start Your Mission 🚀</button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-white/10 font-bold text-xs tracking-widest uppercase border-t border-white/5">
        © 2026 SmartKids Learning Platform • Joy-First Education • Made for Mini Explorers
      </footer>
    </div>
  );
};

const MissionCard = ({ icon, title, desc }: any) => (
  <motion.div 
    whileHover={{ y: -5, background: 'rgba(255,255,255,0.08)' }}
    className="p-8 rounded-[2rem] bg-white/5 border border-white/10 transition-all flex items-start gap-4"
  >
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white/70">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h4 className="text-xl font-display text-white mb-2">{title}</h4>
      <p className="text-white/40 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  </motion.div>
);

const ComparisonItem = ({ text, bad = false }: any) => (
  <li className="flex items-start gap-3">
    {bad ? <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-1" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />}
    <span className={bad ? 'text-white/30' : 'text-white/80'}>{text}</span>
  </li>
);

const RoadmapCard = ({ icon, title, desc }: any) => (
  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center text-center">
    <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10 text-white/40">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <h4 className="text-lg font-display mb-2 text-white">{title}</h4>
    <p className="text-white/30 text-xs leading-relaxed font-medium">{desc}</p>
  </div>
);

export default LandingPage;
