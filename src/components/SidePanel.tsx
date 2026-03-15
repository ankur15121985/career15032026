import React, { useState, useEffect } from 'react';
import { CareerNode, University } from '../types';
import { motion } from 'motion/react';
import { X, GraduationCap, Clock, DollarSign, MapPin, Info, Loader2, ExternalLink } from 'lucide-react';
import { DEFAULT_UNIVERSITIES } from '../data/defaultCareers';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

interface SidePanelProps {
  node: CareerNode | null;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ node, onClose }) => {
  const { db } = useFirebase();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (node?.id) {
      const fetchColleges = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, 'colleges'), where('career_id', '==', node.id));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any;
          
          if (data && data.length > 0) {
            setUniversities(data);
          } else {
            // Fallback to default data if Firestore returns empty
            setUniversities(DEFAULT_UNIVERSITIES[node.id] || []);
          }
        } catch (err) {
          console.error('Failed to fetch colleges from Firestore, using fallback', err);
          // Fallback to default data if Firestore fails
          setUniversities(DEFAULT_UNIVERSITIES[node.id] || []);
        } finally {
          setLoading(false);
        }
      };
      fetchColleges();
    }
  }, [node?.id, db]);

  if (!node) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-[200] overflow-y-auto border-l border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
              {node.type === 'leaf' ? 'Career Path' : 'Career Branch'}
            </span>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">{node.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {node.duration && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" /> {node.duration}
                </div>
              )}
              {node.job_roles && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-3 h-3" /> Job Roles
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {node.description && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-400">
              <Info className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Overview</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              {node.description}
            </p>
          </div>
        )}

        {node.job_roles && (
          <div className="mb-8 p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Key Job Roles</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {node.job_roles.split(',').map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                  {role.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-display font-bold">Top Institutions</h3>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center py-12 text-slate-400 dark:text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Fetching Colleges...</p>
              </div>
            ) : universities.length > 0 ? (
              universities.map((uni, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl transition-all group bg-white dark:bg-slate-800/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-display font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-lg leading-tight">
                      {uni.name}
                    </h4>
                    {uni.ranking && (
                      <span className="shrink-0 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded uppercase tracking-tighter">
                        {uni.ranking}
                      </span>
                    )}
                  </div>
                  
                  {uni.specialization && (
                    <div className="mb-4 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {uni.specialization}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                      <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Fees</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{uni.fees}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                      <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Duration</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{uni.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs col-span-2">
                      <div className="w-7 h-7 bg-rose-50 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Location</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{uni.location}</span>
                      </div>
                    </div>
                  </div>

                  {uni.website && (
                    <a 
                      href={uni.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-800"
                    >
                      Official Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-500 text-sm">No specific institution data available for this branch yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SidePanel;
