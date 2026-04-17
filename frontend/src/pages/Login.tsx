import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, User, Lock, Mail, KeyRound, Loader2, Star } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

const Login: React.FC = () => {
  const [isParent, setIsParent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user, setUser, setChild, child } = useAuthStore();

  React.useEffect(() => {
    if (user?.token) {
      if (user.role === 'parent') navigate('/parent-dashboard');
      else if (child) navigate('/subjects');
    }
  }, [user, child]);

  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login-parent', { email, password });
      setUser(data);
      navigate('/parent-dashboard');
    } catch {
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChildLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login-child', { name, pin });
      setChild(data);
      setUser(data);
      navigate('/subjects');
    } catch {
      setError('Incorrect Name or PIN. Ask your parent!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-space-dark flex flex-col lg:flex-row overflow-hidden">

      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex flex-col items-center justify-center w-2/5 bg-gradient-to-b from-kids-purple/30 to-space-dark border-r border-white/10 p-12 relative overflow-hidden">
        {/* Starfield dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center z-10"
        >
          <div className="text-8xl mb-6">🚀</div>
          <h1 className="text-5xl text-white mb-4">SmartKids</h1>
          <p className="text-white/60 text-lg max-w-xs text-center">
            A space adventure where every question makes you a better explorer!
          </p>
        </motion.div>

        <div className="absolute bottom-8 flex gap-3 z-10">
          {['⭐', '🪐', '✨', '🌙', '⚡'].map((e, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="text-6xl mb-3">🚀</div>
          <h1 className="text-4xl text-white">SmartKids</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Tab Switcher */}
          <div className="flex rounded-2xl overflow-hidden border-2 border-white/10 mb-8 bg-white/5">
            <button
              className={`flex-1 py-3.5 font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${
                !isParent
                  ? 'bg-kids-purple text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'
              }`}
              onClick={() => { setIsParent(false); setError(''); }}
            >
              <Star className="w-4 h-4" /> I'm a Kid!
            </button>
            <button
              className={`flex-1 py-3.5 font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${
                isParent
                  ? 'bg-kids-yellow text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'
              }`}
              onClick={() => { setIsParent(true); setError(''); }}
            >
              <User className="w-4 h-4" /> Parent
            </button>
          </div>

          {/* Card */}
          <div className="glass-card p-6 sm:p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {!isParent ? (
                <motion.form
                  key="kid"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleChildLogin}
                  className="space-y-5"
                >
                  <h2 className="text-2xl sm:text-3xl text-white text-center mb-2">Ready for Liftoff? 🚀</h2>

                  <div>
                    <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">Explorer Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="kid-input pl-12"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-semibold text-sm uppercase tracking-wide">Secret PIN</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                      <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="kid-input pl-12 text-center text-3xl tracking-[0.8rem]"
                        placeholder="••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-kids-pink text-sm font-bold text-center bg-kids-pink/10 py-2 px-4 rounded-xl">{error}</p>
                  )}

                  <button type="submit" disabled={loading} className="kid-button kid-button-primary w-full flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                    {loading ? 'Flying...' : 'Start Adventure!'}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="parent"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleParentLogin}
                  className="space-y-5"
                >
                  <h2 className="text-2xl sm:text-3xl text-white text-center mb-2">Welcome, Captain! 🎖️</h2>

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
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-kids-pink text-sm font-bold text-center bg-kids-pink/10 py-2 px-4 rounded-xl">{error}</p>
                  )}

                  <button type="submit" disabled={loading} className="kid-button kid-button-warning w-full flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {loading ? 'Logging in...' : 'Parent Login'}
                  </button>

                  <p className="text-center text-white/50 text-sm">
                    New here?{' '}
                    <Link to="/signup" className="text-kids-yellow font-bold hover:text-kids-yellow-light transition-colors">
                      Create an Account
                    </Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-white/30 mt-6 text-xs italic">
              "Every mistake is a step towards the stars!" ⭐
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
