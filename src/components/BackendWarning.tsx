import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BackendWarning: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [isFirebaseOffline, setIsFirebaseOffline] = useState(false);
  const [isWrongUrl, setIsWrongUrl] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const OFFICIAL_URL = process.env.SHARED_APP_URL || process.env.APP_URL || "https://ais-dev-mhlrlis3atm6intgpw7ttg-356645113135.asia-east1.run.app";

  useEffect(() => {
    const hostname = window.location.hostname;
    const origin = window.location.origin;
    
    // Check if we are on a known static host that doesn't support our backend
    const isNetlify = hostname.includes('netlify.app');
    const isGithub = hostname.includes('github.io');
    
    // Official domains that ARE allowed
    const isOfficialDomain = hostname.includes('careersirji.com') || 
                            hostname.includes('run.app') || 
                            hostname.includes('vercel.app') ||
                            hostname === 'localhost';
    
    if ((isNetlify || isGithub) && !isOfficialDomain) {
      setIsWrongUrl(true);
      // Auto-redirect after 5 seconds if on Netlify
      const timer = setTimeout(() => {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        if (!window.location.href.startsWith(OFFICIAL_URL)) {
          window.location.href = `${OFFICIAL_URL}${currentPath}${currentSearch}`;
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Check if backend is reachable
    fetch('/api/health')
      .then(res => {
        if (!res.ok) throw new Error('Backend unreachable');
        return res.json();
      })
      .then(data => {
        if (data.status !== 'ok') {
          setIsOffline(true);
        } else if (!data.firebase) {
          setIsFirebaseOffline(true);
        }
      })
      .catch((err) => {
        console.warn("Backend health check failed:", err);
        setIsOffline(true);
      });
  }, [OFFICIAL_URL]);

  if (!isVisible || (!isOffline && !isWrongUrl && !isFirebaseOffline)) return null;

  // If on Netlify, show a full-screen blocking overlay
  if (isWrongUrl) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl text-center border border-slate-200 dark:border-slate-800"
        >
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Wrong URL Detected</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            You are accessing the app via <strong>Netlify</strong>, which does not support our backend features. 
            Redirecting you to the official app now...
          </p>
          <a 
            href={OFFICIAL_URL}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-3 mb-4"
          >
            Go to Official App <ExternalLink className="w-6 h-6" />
          </a>
          <button 
            onClick={() => {
              setIsWrongUrl(false);
              setIsOffline(true); // Treat as offline mode
            }}
            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Continue with limited features
          </button>
          <p className="mt-6 text-xs text-slate-400">
            Redirecting to {OFFICIAL_URL.replace('https://', '')} in 5 seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-6 right-6 z-[9999] md:left-auto md:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-rose-600 text-white p-6 rounded-3xl shadow-2xl border border-rose-500/50 backdrop-blur-lg"
        >
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1">Backend Connection Error</h3>
              <p className="text-sm text-rose-100 leading-relaxed mb-4">
                {isWrongUrl 
                  ? "You are using a static version of the app (Netlify). Features like Quiz, Email, and Admin will NOT work here."
                  : isFirebaseOffline
                  ? "The backend is connected, but the database is not initialized. Please check your Firebase configuration."
                  : "The backend server is currently unreachable. Some features may be disabled."}
              </p>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-white text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors"
                >
                  Open Official App URL <ExternalLink className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-xs text-rose-200 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  Dismiss for now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BackendWarning;
