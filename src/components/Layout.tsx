import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, Target, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/graph', label: 'Career Map', icon: Compass },
    { path: '/quiz', label: 'Quiz', icon: Target },
  ];

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => {
                // Fallback if logo.png is missing
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <svg viewBox="0 0 100 100" class="w-8 h-8 text-indigo-600 fill-current">
                    <path d="M20 40 L50 25 L80 40 L50 55 Z M50 55 L50 75 M35 48 L35 65 C35 65 50 75 65 65 L65 48" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M40 80 L60 60 L75 75 M60 60 L60 45 M60 60 L75 60" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                `;
              }} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-none">Career Sirji</span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none mt-1">Vineet Bansal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all relative py-2 ${
                  location.pathname === item.path 
                    ? 'text-indigo-600' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link
              to="/quiz"
              className="px-7 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-indigo-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white dark:bg-slate-900 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                >
                  <item.icon className="w-6 h-6 text-indigo-600" />
                  <span className="text-xl font-display font-bold text-slate-900 dark:text-white">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Compass className="w-8 h-8 text-indigo-400" />
              <span className="text-2xl font-display font-bold tracking-tight">Career Sirji</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Empowering students to find their true calling through data-driven career exploration 
              and interactive visualization by <strong>Vineet Bansal</strong>.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/graph" className="hover:text-white transition-colors">Career Map</Link></li>
              <li><Link to="/quiz" className="hover:text-white transition-colors">Career Quiz</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4 text-slate-400">
              <li>support@waqt.edu</li>
              <li>+91 9799878850</li>
              <li>Jaipur, Rajasthan, India</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Career Sirji | Vineet Bansal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
