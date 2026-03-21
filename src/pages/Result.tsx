import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, ArrowRight, Map, GraduationCap, BarChart3, Calendar, User, X, Clock, ExternalLink, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLLEGES } from '../data/colleges';

import { dataService } from '../services/dataService';

const Result: React.FC = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedColleges, setRecommendedColleges] = useState<any[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const data = location.state as { answers: any[], contactInfo: any } | null;

  if (!data) return <Navigate to="/quiz" />;

  const { answers, contactInfo } = data;

  // Analysis logic
  const getScores = () => {
    const aq = answers.filter((a: { type: string }) => a.type === 'AQ');
    const iq = answers.filter((a: { type: string }) => a.type === 'IQ');

    const aqScore = Math.round((aq.filter((a: { isCorrect: boolean }) => a.isCorrect).length / aq.length) * 100) || 0;
    const iqScore = Math.round((iq.filter((a: { isCorrect: boolean }) => a.isCorrect).length / iq.length) * 100) || 0;

    return { aqScore, iqScore };
  };

  const { aqScore, iqScore } = getScores();

  const getAnalysisData = () => {
    // For the chart, we can show category-wise performance
    const categories: Record<string, { correct: number, total: number }> = {};
    
    answers.forEach((ans: { category: string; isCorrect: boolean }) => {
      if (!categories[ans.category]) {
        categories[ans.category] = { correct: 0, total: 0 };
      }
      categories[ans.category].total += 1;
      if (ans.isCorrect) categories[ans.category].correct += 1;
    });

    return Object.entries(categories).map(([name, stats]) => ({
      name,
      value: Math.round((stats.correct / stats.total) * 100)
    }));
  };

  const chartData = getAnalysisData();
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Simple logic to determine recommended paths based on category performance
  const getRecommendations = () => {
    const sorted = [...chartData].sort((a, b) => b.value - a.value);
    const top = sorted[0]?.name;
    
    if (top === 'Numerical') return ['Computer Science', 'Finance', 'Engineering'];
    if (top === 'Logical') return ['Software Engineering', 'Research', 'Architecture'];
    if (top === 'Verbal') return ['Journalism', 'Law', 'Marketing'];
    if (top === 'Situational') return ['Management', 'Human Resources', 'Public Relations'];
    return ['General Management', 'Business Administration'];
  };

  const recommendations = React.useMemo(() => getRecommendations(), [chartData]);

  // Fetch colleges based on recommendations
  useEffect(() => {
    const fetchColleges = async () => {
      setLoadingColleges(true);
      try {
        // Map recommendation names to career_ids or specializations
        const mapping: Record<string, string> = {
          'Computer Science': 'cse',
          'Engineering': 'cse',
          'Finance': 'bcom-regular',
          'Law': 'ba-llb',
          'Journalism': 'journalism',
          'Management': 'bba',
          'Architecture': 'b-arch',
          'Medicine': 'mbbs'
        };

        const targetCareerIds = recommendations
          .map(r => mapping[r])
          .filter(Boolean);

        if (targetCareerIds.length > 0) {
          // Use local static data instead of Firebase
          const filteredColleges = COLLEGES.filter(c => targetCareerIds.includes(c.career_id)).slice(0, 6);
          setRecommendedColleges(filteredColleges);
        }
      } catch (error) {
        console.error("Error loading recommended colleges:", error);
      } finally {
        setLoadingColleges(false);
      }
    };

    fetchColleges();
  }, [recommendations]);

  const handleConfirmAppointment = async () => {
    if (!appointmentTime) {
      setError("Please select a time for your appointment.");
      return;
    }
    
    setIsSending(true);
    setError(null);
    try {
      const appointmentData = {
        consultant_name: "Vineet Bansal",
        appointment_time: appointmentTime,
        user_name: contactInfo.name,
        user_email: contactInfo.email,
        user_phone: contactInfo.phone,
        aq_score: aqScore,
        iq_score: iqScore,
        top_recommendation: recommendations[0]
      };

      const success = await dataService.saveAppointment(appointmentData);

      if (!success) {
        throw new Error("Failed to book appointment. Please try again.");
      }

      setIsSending(false);
      setIsSent(true);
      console.log(`Appointment confirmed and saved locally for ${contactInfo.email}`);
    } catch (error: any) {
      console.error("Failed to save appointment:", error);
      setIsSending(false);
      setError(error.message || "Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 mb-12"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Results for {contactInfo.name}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We've analyzed your responses. Here's your performance breakdown.
            </p>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 text-center">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 block">Aptitude Quotient (AQ)</span>
              <div className="text-6xl font-display font-black text-emerald-900 dark:text-emerald-50">{aqScore}%</div>
              <p className="text-emerald-700 dark:text-emerald-400 mt-2 text-sm">Measures your situational and verbal skills</p>
            </div>
            <div className="p-8 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/50 text-center">
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 block">Intelligence Quotient (IQ)</span>
              <div className="text-6xl font-display font-black text-amber-900 dark:text-amber-50">{iqScore}%</div>
              <p className="text-amber-700 dark:text-amber-400 mt-2 text-sm">Measures your logical and numerical ability</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8 justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white">Performance by Category</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', opacity: 0.1 }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-8">Top Recommended Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {recommendations.map((path, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all cursor-default rounded-3xl"
                >
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:text-white transition-colors mx-auto" />
                  <h3 className="text-xl font-display font-bold text-indigo-900 dark:text-indigo-100 group-hover:text-white transition-colors">
                    {path}
                  </h3>
                </motion.div>
              ))}
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
            >
              <Calendar className="w-6 h-6" />
              Book Consultation with Vinit Bansal
            </button>
          </div>

          {/* Recommended Colleges Section */}
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-8 justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white">Top Recommended Institutions</h2>
            </div>

            {loadingColleges ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recommendedColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedColleges.map((college) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                      </div>
                      {college.ranking && (
                        <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full uppercase tracking-wider">
                          {college.ranking}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{college.name}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {college.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {college.duration}
                      </div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {college.specialization}
                      </div>
                    </div>
                    {college.website && (
                      <a 
                        href={college.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                      >
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">No specific colleges found for these paths yet. Our team is updating the database.</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link 
            to="/graph"
            className="p-10 bg-slate-900 dark:bg-slate-900 text-white rounded-[40px] shadow-lg hover:shadow-2xl transition-all group flex flex-col justify-between h-full border border-slate-800"
          >
            <div>
              <Map className="w-10 h-10 text-indigo-400 mb-6" />
              <h2 className="text-3xl font-display font-bold mb-4">Explore the Map</h2>
              <p className="text-slate-400 leading-relaxed">
                See how your recommended paths branch out and discover specific specializations.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-indigo-400 font-bold group-hover:translate-x-2 transition-transform">
              Go to Career Map <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-sm flex flex-col justify-between h-full">
            <div>
              <GraduationCap className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-6" />
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">University Guide</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                We've sent a detailed guide of top universities for your recommended paths to <strong>{contactInfo.email || contactInfo.phone}</strong>.
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="mt-8 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Download PDF Guide
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="p-8 md:p-10">
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Appointment Details</h3>
                    <p className="text-slate-500 dark:text-slate-400">Waqt Career Consultation</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Consultant</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">Vineet Bansal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Appointment Time</p>
                      {!isSent ? (
                        <input 
                          type="datetime-local" 
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                          className="mt-2 w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      ) : (
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {new Date(appointmentTime).toLocaleString('en-IN', {
                            dateStyle: 'full',
                            timeStyle: 'short'
                          })}
                        </p>
                      )}
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Online Video Consultation</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  {isSent ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 text-center"
                    >
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-50 mb-1">Appointment done.</h4>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        Your session has been successfully scheduled.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Waqt Result Summary</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-indigo-400 font-bold uppercase">AQ Score</p>
                          <p className="text-2xl font-display font-black text-indigo-900 dark:text-indigo-50">{aqScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-indigo-400 font-bold uppercase">IQ Score</p>
                          <p className="text-2xl font-display font-black text-indigo-900 dark:text-indigo-50">{iqScore}%</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-800">
                        <p className="text-xs text-indigo-400 font-bold uppercase">Top Recommendation</p>
                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">{recommendations[0]}</p>
                      </div>
                    </div>
                  )}
                </div>

                {!isSent && (
                  <button 
                    onClick={handleConfirmAppointment}
                    disabled={isSending}
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSending ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </button>
                )}
                
                {isSent && (
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Result;
