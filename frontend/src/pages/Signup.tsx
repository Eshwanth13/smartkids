import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowLeft, Rocket } from 'lucide-react';
import api from '../services/api';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/register-parent', { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-space-dark flex flex-col lg:flex-row overflow-hidden">

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center w-2/5 bg-gradient-to-b from-kids-green/20 to-space-dark border-r border-white/10 p-12 relative overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1
            }}
          />
        ))}

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center z-10"
        >
          <div className="text-8xl mb-6">🎖️</div>
          <h1 className="text-4xl text-white mb-4">Join SmartKids</h1>
          <p className="text-white/60 text-base max-w-xs text-center leading-relaxed">
            Create a parent account to manage your child's space learning journey.
          </p>
          <div className="mt-8 space-y-3">
            {['📊 Track learning progress', '🚀 Manage multiple explorers', '🔐 Secure PIN-based child login'].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70 text-sm">
                {f}
              </div>
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
          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <div className="glass-card p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🚀</div>
              <h2 className="text-3xl text-white">Join Mission Control</h2>
              <p className="text-white/50 text-sm mt-1">Create your parent account</p>
            </div>

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl text-white mb-2">Account Created!</h3>
                <p className="text-white/60">Redirecting to login...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="kid-input pl-12"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="kid-input pl-12"
                      placeholder="name@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="kid-input pl-12"
                      placeholder="Min. 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-kids-pink text-sm font-bold text-center bg-kids-pink/10 py-2 px-4 rounded-xl">{error}</p>
                )}

                <button type="submit" disabled={loading} className="kid-button kid-button-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-white/50 text-sm mt-2">
                  Already have an account?{' '}
                  <Link to="/login" className="text-kids-purple-light font-bold hover:underline">Login here</Link>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
