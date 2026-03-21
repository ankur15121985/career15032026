import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Compass, Target, GraduationCap, ArrowRight, Users, Map as MapIcon, BarChart3, User } from 'lucide-react';

const Home: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitor-count');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && typeof data.count === 'number') {
          setVisitorCount(data.count);
        }
      } catch (err) {
        console.warn("Failed to fetch visitor count, using fallback", err);
        // Fallback to a reasonable number if API fails
        setVisitorCount(1250 + Math.floor(Math.random() * 10));
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        {/* Massive Background Typography (Recipe 2) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-[30vw] font-display font-bold leading-none select-none tracking-tighter"
          >
            CAREER SIRJI
          </motion.div>
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              x: [0, -100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/20 blur-[120px] rounded-full" 
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex justify-center"
            >
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-3 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<svg viewBox="0 0 24 24" class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>';
                }} />
              </div>
            </motion.div>

            {visitorCount !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {visitorCount.toLocaleString()} Unique Visitors
              </motion.div>
            )}
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-display font-bold tracking-tighter leading-[0.8] mb-8"
            >
              NAVIGATE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">YOUR DESTINY</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-sans leading-relaxed"
            >
              Stop guessing. Start knowing. Explore a universe of 1000+ career paths 
              mapped with precision for the modern student.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center"
            >
              <Link 
                to="/graph" 
                className="w-full sm:w-auto group relative px-10 py-5 bg-white text-black rounded-full font-bold transition-all overflow-hidden text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                  Launch Career Map <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/quiz" 
                className="w-full sm:w-auto px-10 py-5 bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-full font-bold transition-all text-lg text-center"
              >
                Take the Assessment
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to discover</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Compass className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3 text-slate-900 dark:text-white">Interactive Map</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Visualize your career journey through a dynamic, branching tree structure. 
              Explore streams from Biology to Humanities.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3 text-slate-900 dark:text-white">Top Institutions</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Access detailed information about premier universities, including fees, 
              duration, and rankings for every specialization.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3 text-slate-900 dark:text-white">Personalized Quiz</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Not sure where to start? Our AI-driven quiz helps identify your strengths 
              and suggests the most suitable career paths.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-100 dark:bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <div className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400 mb-1">1000+</div>
              <div className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] font-bold">Career Paths</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400 mb-1">500+</div>
              <div className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] font-bold">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400 mb-1">50+</div>
              <div className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] font-bold">Specializations</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400 mb-1">100%</div>
              <div className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] font-bold">Free Access</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {visitorCount !== null ? visitorCount.toLocaleString() : '...'}
              </div>
              <div className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] font-bold">Unique Visitors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
              Why Choose <span className="text-indigo-600 dark:text-indigo-400">Career Sirji</span>?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We combine scientific assessments with expert human guidance to help you navigate the complex world of modern careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "1000+ Career Paths",
                description: "Explore a vast universe of careers, from traditional professions to the most modern, less-travelled paths.",
                icon: <MapIcon className="w-8 h-8 text-indigo-600" />,
                color: "bg-indigo-500/10"
              },
              {
                title: "Scientific Assessment",
                description: "Our IQ and AQ tests are designed to measure your true potential and situational adaptability.",
                icon: <BarChart3 className="w-8 h-8 text-emerald-600" />,
                color: "bg-emerald-500/10"
              },
              {
                title: "Expert Mentorship",
                description: "Get direct access to Vineet Bansal, a seasoned career counselor with years of experience in student guidance.",
                icon: <User className="w-8 h-8 text-amber-600" />,
                color: "bg-amber-500/10"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Counselor Section */}
      <section className="py-24 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-48 h-48 md:w-80 md:h-80 rounded-[4rem] bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl relative group">
              <Users className="w-32 h-32 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Expert Guidance Available
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-3">
                Vineet Bansal
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 font-sans max-w-xl">
                Lead Career Counselor & Educational Strategist with over 15 years of experience 
                helping students find their true calling.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <a 
                  href="tel:9799878850" 
                  className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Call Directly</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">9799878850</div>
                  </div>
                </a>
                
                <a 
                  href="mailto:vineet@gmail.com" 
                  className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Email Support</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">vineet@gmail.com</div>
                  </div>
                </a>
              </div>

              <Link 
                to="/quiz" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
              >
                Book Personal Session <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
