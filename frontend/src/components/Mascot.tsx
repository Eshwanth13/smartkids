import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  mood: 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'oops' | 'victory';
  message?: string;
}


const Mascot: React.FC<MascotProps> = ({ mood, message }) => {
  const getAsset = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return '/assets/mascot/zappy_happy.png';
      case 'victory':
        return '/assets/mascot/zappy_victory.png';
      case 'thinking':

      case 'encouraging':
        return '/assets/mascot/zappy_thinking.png';
      default:
        return '/assets/mascot/zappy_happy.png';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ y: 20, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative"
        >
          {/* Main Mascot Image */}
          <motion.img
            src={getAsset()}
            alt="Zappy"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl"
            animate={mood === 'happy' ? {
              y: [0, -20, 0],
              transition: { repeat: Infinity, duration: 2 }
            } : {}}
          />

          {/* Speech Bubble */}
          {message && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-16 -right-24 bg-white text-kids-purple-dark px-6 py-4 rounded-3xl rounded-bl-none shadow-xl border-4 border-kids-purple-light max-w-xs font-bold text-lg italic"
            >
              {message}
              <div className="absolute -bottom-4 left-0 w-8 h-8 bg-white border-l-4 border-b-4 border-kids-purple-light transform rotate-45 -z-10" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Mascot;
