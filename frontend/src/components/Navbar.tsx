import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home, Plus, BookOpen, Star } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface NavbarProps {
  variant?: 'parent' | 'space' | 'nature'; 
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'parent' }) => {
  const [open, setOpen] = useState(false);
  const { user, child, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  const isParent = user?.role === 'parent';
  const isDark = variant === 'space' || variant === 'nature';

  const parentLinks = [
    { to: '/parent-dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { to: '/add-child', label: 'Add Explorer', icon: <Plus className="w-4 h-4" /> },
  ];

  const childLinks = [
    { to: '/subjects', label: 'Back to Subjects', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const links = isParent ? parentLinks : childLinks;

  const getNavStyle = () => {
    if (variant === 'space') return 'bg-black/40 backdrop-blur-md border-b border-white/10';
    if (variant === 'nature') return 'bg-[#121a12]/50 backdrop-blur-md border-b border-white/5';
    return 'bg-white border-b border-slate-100 shadow-sm';
  };

  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const mutedText = isDark ? 'text-white/60' : 'text-slate-500';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50';
  const activeBg = isDark ? 'bg-white/15 text-white' : 'bg-kids-purple/10 text-kids-purple';

  return (
    <nav className={`w-full z-50 transition-colors duration-500 ${getNavStyle()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to={isParent ? '/parent-dashboard' : '/subjects'}
            className={`flex items-center gap-2 font-display text-xl ${textColor}`}
          >
            <span className="text-2xl">🚀</span>
            <span className="hidden sm:block">SmartKids</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  location.pathname === link.to
                    ? activeBg
                    : `${mutedText} ${hoverBg}`
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Profile + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isParent && child && (
              <div className="hidden sm:flex items-center gap-2 bg-kids-purple/20 text-white px-3 py-1.5 rounded-full text-sm font-bold border border-white/10">
                <Star className="w-3.5 h-3.5 fill-kids-yellow text-kids-yellow" />
                {child.xp ?? 0}
              </div>
            )}

            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${
              isDark ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}>
              <div className="w-6 h-6 rounded-full bg-kids-purple flex items-center justify-center text-white text-[10px] font-bold">
                {(user?.name || child?.name || '?')[0].toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate">{user?.name || child?.name || 'Explorer'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-kids-pink bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all text-sm font-bold border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-xl transition-all ${hoverBg} ${textColor}`}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t overflow-hidden ${
              isDark ? 'border-white/10 bg-slate-900' : 'border-slate-100 bg-white'
            }`}
          >
            <div className="px-4 py-4 space-y-1">
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-3 ${
                isDark ? 'bg-white/5' : 'bg-slate-50'
              }`}>
                <div className="w-10 h-10 rounded-full bg-kids-purple flex items-center justify-center text-white font-bold text-lg">
                  {(user?.name || child?.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className={`font-bold text-sm ${textColor}`}>{user?.name || child?.name || 'Explorer'}</p>
                  <p className={`text-xs ${mutedText}`}>{user?.email || (child ? 'Explorer Pilot' : '')}</p>
                </div>
              </div>

              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    location.pathname === link.to
                      ? activeBg
                      : `${mutedText} ${hoverBg}`
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-kids-pink hover:bg-kids-pink/10 transition-all mt-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
