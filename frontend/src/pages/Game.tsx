import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import Mascot from '../components/Mascot';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import Starfield from '../components/Starfield';

const SUBJECT_CONFIGS: Record<string, any> = {
  math: {
    name: 'Mathematics',
    theme: 'space',
    bgColor: 'bg-[#050810]',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
    accent: 'bg-blue-600',
    glow: 'shadow-blue-500/20',
    mascotPrefix: 'Cosmic Navigator',
    successMsg: 'Mission Accomplished! You\'re a true Space Explorer! ⭐',
    gameOverMsg: 'Out of fuel! But every explorer learns from mistakes! 💫',
    backBtn: 'Back to Galaxy 🚀'
  },
  english: {
    name: 'English',
    theme: 'nature',
    bgColor: 'bg-[#061008]',
    bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600',
    accent: 'bg-emerald-600',
    glow: 'shadow-emerald-500/20',
    mascotPrefix: 'Forest Guardian',
    successMsg: 'Magic Mastered! The forest spirits are cheering for you! 🧚',
    gameOverMsg: 'Magic depleted! Nature says try another path! 🍄',
    backBtn: 'Back to Forest 🌳'
  },
  gk: {
    name: 'General Knowledge',
    theme: 'nature',
    bgColor: 'bg-[#100b05]',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600',
    accent: 'bg-amber-600',
    glow: 'shadow-amber-500/20',
    mascotPrefix: 'World Traveler',
    successMsg: 'Discovery Complete! You\'ve mastered world facts! 🌍',
    gameOverMsg: 'Journey paused! Even the greatest explorers need a map! 🔭',
    backBtn: 'Back to World Map 🗺️'
  }
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const { setChild } = useAuthStore();

  const {
    questions,
    currentQuestionIndex,
    answerQuestion,
    hearts,
    isGameOver,
    isLevelComplete,
    setQuestions,
    resetLevel,
    mistakesInCurrentQuestion,
  } = useGameStore();

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [wrongMessage, setWrongMessage] = useState('');
  const [inputError, setInputError] = useState('');
  const [mascotMessage, setMascotMessage] = useState('Initiating mission sequence...');
  const [loading, setLoading] = useState(true);
  const [hasSavedResult, setHasSavedResult] = useState(false);
  const [levelInfo, setLevelInfo] = useState<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const subject = levelInfo?.subject || 'math';
  const config = SUBJECT_CONFIGS[subject] || SUBJECT_CONFIGS.math;

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        const { data } = await api.post('/game/start-level', { levelId });
        setQuestions(data.questions);
        setLevelInfo(data.level);
        setMascotMessage(`Mission: ${data.level.topic}. Let's go! ✨`);
        startTimeRef.current = Date.now();
      } catch (error) {
        console.error('Failed to load mission', error);
        setMascotMessage('Communication error! Try going back.');
      } finally {
        setLoading(false);
      }
    };
    fetchLevelData();
  }, [levelId, setQuestions]);

  useEffect(() => {
    if (isLevelComplete && !hasSavedResult) {
      const saveProgress = async () => {
        try {
          const { data } = await api.post('/game/complete-level', {
            levelId,
            xpEarned: 50 + (levelInfo?.levelNumber * 10 || 0),
            coinsEarned: 20 + (levelInfo?.levelNumber * 5 || 0)
          });
          if (data.child) {
            setChild(data.child);
          }
          setHasSavedResult(true);
        } catch (error) {
          console.error('Failed to save progress', error);
        }
      };
      saveProgress();
    }
  }, [isLevelComplete, levelId, hasSavedResult, setChild, levelInfo]);

  const currentQuestion = questions[currentQuestionIndex];

  const checkAnswer = (input: string, correctAnswer: number | string): boolean => {
    const trimmed = input.trim().toLowerCase();
    const correct = String(correctAnswer).toLowerCase().trim();

    if (subject === 'math') {
        if (correct.includes('/')) {
            const [cn, cd] = correct.split('/').map(Number);
            const correctDecimal = cn / cd;
            if (trimmed.includes('/')) {
              const [un, ud] = trimmed.split('/').map(Number);
              if (!isNaN(un) && !isNaN(ud) && ud !== 0) return Math.abs((un / ud) - correctDecimal) < 0.01;
            }
            const userDecimal = parseFloat(trimmed);
            if (!isNaN(userDecimal)) return Math.abs(userDecimal - correctDecimal) < 0.01;
            return false;
        }
        const cNum = parseFloat(correct);
        const uNum = parseFloat(trimmed);
        if (!isNaN(cNum) && !isNaN(uNum)) return Math.abs(cNum - uNum) < 0.01;
    }

    return trimmed === correct;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '') {
      setInputError('✏️ Enter your answer!');
      return;
    }
    if (!currentQuestion || feedback) return;

    const isCorrect = checkAnswer(userInput, currentQuestion.correctAnswer);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    api.post('/game/submit-answer', {
      levelId,
      question: currentQuestion.question,
      userAnswer: userInput,
      correctAnswer: String(currentQuestion.correctAnswer),
      isCorrect,
      topic: levelInfo?.topic || 'General',
      subject,
      timeTaken
    }).catch(console.error);

    if (isCorrect) {
      setFeedback('correct');
      setMascotMessage('Excellent job! You gained knowledge! 🌟');
      answerQuestion(true);
    } else {
      setFeedback('wrong');
      const isHint = mistakesInCurrentQuestion === 0;
      
      if (isHint) {
        setWrongMessage(`Oops! Take a hint: It starts with "${String(currentQuestion.correctAnswer)[0]}"`);
        setMascotMessage("Don't worry, mistakes happen! I've given you a hint. Try one more time! 💪");
      } else {
        setWrongMessage(`Not quite! The correct answer was: ${currentQuestion.correctAnswer}`);
        setMascotMessage("That was tough! Let's keep moving forward. 🚀");
      }
      
      answerQuestion(false);
    }
    
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (feedback === 'correct' && !isLevelComplete) {
      const timer = setTimeout(() => {
        setUserInput('');
        setFeedback(null);
        setInputError('');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [feedback, isLevelComplete]);

  const handleRetry = () => {
    setUserInput('');
    setFeedback(null);
    setInputError('');
  };

  if (loading) return (
    <div className={`min-h-screen ${config.bgColor} flex flex-col items-center justify-center`}>
      <Loader2 className="w-16 h-16 text-white animate-spin" />
      <p className="text-white mt-4 font-display text-xl">Loading Mission...</p>
    </div>
  );

  if (isGameOver) return (
    <div className={`min-h-screen ${config.bgColor} flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
      <Starfield />
      <Mascot mood="thinking" message={config.gameOverMsg} />
      <h2 className="text-6xl text-white mt-8 mb-4 font-display text-center drop-shadow-2xl">Mission Paused</h2>
      <button
        onClick={() => { resetLevel(); navigate(`/world-map/${subject}`); }}
        className="kid-button kid-button-primary mt-8 scale-110 active:scale-100"
      >
        {config.backBtn}
      </button>
    </div>
  );

  if (isLevelComplete) return (
    <div className={`min-h-screen ${config.bgColor} flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
      <Starfield />
      <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
      <Mascot mood="victory" message={config.successMsg} />
      <h2 className="text-7xl text-white mt-8 mb-4 font-display text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">Mission Clear!</h2>
      <motion.button
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => navigate(`/world-map/${subject}`)}
        className="kid-button kid-button-success px-16 py-6 text-2xl mt-8"
      >
        {config.backBtn}
      </motion.button>
    </div>
  );

  return (
    <div className={`min-h-screen w-full ${config.bgColor} text-white flex flex-col relative overflow-hidden`}>
      <Starfield />
      {/* Background Layer */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${config.bgImage})`, backgroundSize: 'cover' }}
      />

      {/* Top Bar */}
      <div className="w-full px-8 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className={`w-8 h-8 transition-all duration-300 ${
                i < hearts ? 'fill-rose-500 text-rose-500' : 'text-white/10'
              }`}
            />
          ))}
        </div>
        <div className="text-white bg-white/10 px-6 py-1 rounded-full font-bold">
           Mission Level {levelInfo?.levelNumber} — {config.name}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 relative z-10">
        <Mascot
          mood={feedback === 'correct' ? 'celebrating' : feedback === 'wrong' ? 'encouraging' : 'thinking'}
          message={mascotMessage}
        />

        <motion.div layout className="glass-card p-10 flex flex-col items-center shadow-2xl w-full max-w-xl border-t-4 border-white/20">
          <div className="mb-6">
            <span className={`${config.accent} text-white px-4 py-1 rounded-full text-sm font-bold uppercase`}>
              {levelInfo?.topic} Challenge
            </span>
          </div>

          <div className="text-4xl md:text-5xl font-display mb-10 text-center leading-tight">
            {currentQuestion?.question}
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
            <div className="w-full">
              <input
                type="text"
                value={userInput}
                onChange={(e) => { setUserInput(e.target.value); setInputError(''); }}
                disabled={feedback === 'wrong'}
                autoFocus
                className="w-full text-center text-4xl py-4 rounded-3xl font-display bg-white/10 border-4 border-white/10 text-white outline-none focus:border-white/40 transition-all shadow-inner"
                placeholder="?"
              />
              {inputError && <p className="text-rose-400 text-center mt-2 font-bold">{inputError}</p>}
            </div>

            <AnimatePresence mode="wait">
              {!feedback && (
                <button type="submit" className={`kid-button ${config.accent} w-full text-2xl py-5 shadow-lg`}>
                  Submit Answer ✓
                </button>
              )}

              {feedback === 'correct' && (
                <div className="text-green-400 text-2xl font-bold animate-bounce pt-4 text-center">✓ CORRECT! GREAT JOB! 🎉</div>
              )}

              {feedback === 'wrong' && (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="text-rose-400 font-bold p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-center">
                    {wrongMessage}
                  </div>
                  <button type="button" onClick={handleRetry} className="kid-button bg-rose-500 w-full">
                    Try One More Time!
                  </button>
                </div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePage;
