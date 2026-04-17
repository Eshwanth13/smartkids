import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, ArrowLeft, Rocket, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const AddChild: React.FC = () => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(true); // visible by default during creation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits (numbers only).');
      return;
    }
    setLoading(true); setError('');
    try {
      await api.post('/auth/create-child', { name, pin });
      navigate('/parent-dashboard');
    } catch {
      setError('Failed to add explorer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-space-dark flex flex-col lg:flex-row overflow-hidden">

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center w-2/5 bg-gradient-to-b from-kids-blue/20 to-space-dark border-r border-white/10 p-12 relative overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center z-10"
        >
          <div className="text-8xl mb-6">👨‍🚀</div>
          <h1 className="text-4xl text-white mb-4">New Pilot</h1>
          <p className="text-white/60 text-base max-w-xs text-center leading-relaxed">
            Register a new explorer to your command center. They'll use their name and PIN to login.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              '🔑 4-digit PIN for easy login',
              '📈 Automatic progress tracking',
              '🌍 Access to all mission planets',
            ].map((f, i) => (
              <div key={i} className="text-white/60 text-sm">{f}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate('/parent-dashboard')}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="glass-card p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🚀</div>
              <h2 className="text-3xl text-white">Register New Explorer</h2>
              <p className="text-white/50 text-sm mt-1">Add a child to your Mission Control</p>
            </div>

            <form onSubmit={handleAddChild} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">
                  Explorer's Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="kid-input pl-12"
                    placeholder="e.g. Astro Junior"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">
                  Create a 4-Digit PIN
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={4}
                    pattern="\d{4}"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="kid-input pl-12 pr-12 text-center text-3xl tracking-[0.8rem]"
                    placeholder="0000"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-white/40 text-xs mt-2">
                  ⚠️ Note this PIN — your child will use it to login.
                </p>
              </div>

              {error && (
                <p className="text-kids-pink text-sm font-bold text-center bg-kids-pink/10 py-2 px-4 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="kid-button kid-button-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                {loading ? 'Registering...' : 'Register Explorer'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddChild;
