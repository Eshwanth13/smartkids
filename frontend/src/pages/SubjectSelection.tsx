import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Globe2, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Starfield from '../components/Starfield';

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgImage: string;
  onClick: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, description, icon, color, bgImage, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -10 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl h-[400px] w-full border border-white/10"
  >
    {/* Background Image with Overlay */}
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
      style={{ backgroundImage: `url(${bgImage})` }}
    />
    <div className={`absolute inset-0 bg-gradient-to-t ${color} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

    {/* Content */}
    <div className="absolute inset-0 p-8 flex flex-col justify-end">
      <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-300">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-xl"
        >
          {icon}
        </motion.div>
        <h3 className="text-3xl font-display text-white mb-2 tracking-wide">{title}</h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-[250px] font-medium">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all opacity-80 group-hover:opacity-100">
        Start Mission <ChevronRight className="w-5 h-5" />
      </div>
    </div>
    
    {/* Hover Glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-white/10 to-transparent" />
  </motion.div>
);

const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'math',
      title: 'Mathematics',
      description: 'Journey through the stars and solve cosmic puzzles!',
      icon: <Calculator className="w-8 h-8 text-white" />,
      color: 'from-blue-600 to-indigo-900',
      bgImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'english',
      title: 'English',
      description: 'Explore the Enchanted Forest and master magical words.',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: 'from-emerald-600 to-green-900',
      bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'gk',
      title: 'General Knowledge',
      description: 'Travel the World and discover fascinating facts!',
      icon: <Globe2 className="w-8 h-8 text-white" />,
      color: 'from-amber-500 to-orange-800',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050810] relative overflow-hidden flex flex-col">
      <Starfield />
      
      {/* Magical Nebula Clouds */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar variant="space" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col justify-center">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-6"
          >
            Mission Selection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl text-white font-display mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[1.1]"
          >
            Choose Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Learning Path</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium"
          >
            Join thousands of mini-explorers on a journey to become a SmartKid!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 50 }}
            >
              <SubjectCard
                {...subject}
                onClick={() => navigate(`/world-map/${subject.id}`)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Call to adventure footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-white/40 text-sm italic">
            "Every mission you complete brings you closer to the stars!" ✨
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default SubjectSelection;
