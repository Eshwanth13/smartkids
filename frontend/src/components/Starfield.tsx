import React from 'react';
import { motion } from 'framer-motion';

const Starfield: React.FC = () => {
  const stars = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-30"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [0.8, 1.2, 0.8],
            y: ['-10vh', '110vh'],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            delay: Math.random() * -20,
            ease: "linear"
          }}
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
          }}
        />
      ))}
      
      {/* Occasional larger "twinkling" stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`twinkle-${i}`}
          className="absolute bg-white rounded-full box-shadow-[0_0_10px_white]"
          style={{
            width: '3px',
            height: '3px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
