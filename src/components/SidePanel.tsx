import React, { useState, useEffect } from 'react';
import { CareerNode, University } from '../types';
import { motion } from 'motion/react';
import { X, GraduationCap, Clock, DollarSign, MapPin, Info, Loader2, ExternalLink } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface SidePanelProps {
  node: CareerNode | null;
  onClose: () => void;
  flatCareers?: any[];
}

const SidePanel: React.FC<SidePanelProps> = ({ node, onClose, flatCareers = [] }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (!node?.id) return;
      
      setLoading(true);
      try {
        // Get all descendant IDs if it's a branch
        const targetIds = [node.id];
        
        if (node.type !== 'leaf' && flatCareers.length > 0) {
          const addDescendants = (parentId: string) => {
            flatCareers.forEach(item => {
              if (item.parent_id === parentId) {
                targetIds.push(item.id);
                if (!item.is_leaf) {
                  addDescendants(item.id);
                }
              }
            });
          };
          addDescendants(node.id);
        }

        // Fetch from Firestore for all target IDs
        // Firestore 'in' query supports up to 30 items.
        // If we have more, we might need multiple queries.
        // For now, let's assume it's within limits or handle it simply.
        let firestoreUnis: any[] = [];
        
        if (targetIds.length <= 30) {
          const q = query(collection(db, 'colleges'), where('career_id', 'in', targetIds));
          const querySnapshot = await getDocs(q);
          firestoreUnis = querySnapshot.docs.map(doc => ({
            ...(doc.data() as any),
            id: doc.id
          }));
        } else {
          // Fallback for many IDs: fetch all and filter client-side (not ideal but safe)
          // Or just fetch in chunks of 30.
          const chunks = [];
          for (let i = 0; i < targetIds.length; i += 30) {
            chunks.push(targetIds.slice(i, i + 30));
          }
          
          const results = await Promise.all(chunks.map(chunk => 
            getDocs(query(collection(db, 'colleges'), where('career_id', 'in', chunk)))
          ));
          
          results.forEach(snapshot => {
            snapshot.docs.forEach(doc => {
              firestoreUnis.push({
                ...(doc.data() as any),
                id: doc.id
              });
            });
          });
        }

        // Combine with node's own universities if any
        const nodeUnis = node.universities || [];
        
        // Use a Map to deduplicate by name or ID
        const allUnis = [...nodeUnis, ...firestoreUnis];
        const uniqueUnis = Array.from(new Map(allUnis.map(item => [item.id || item.name, item])).values());
        
        setUniversities(uniqueUnis as University[]);
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [node?.id, node?.universities, flatCareers]);

  if (!node) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-2xl z-[200] overflow-y-auto border-l border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300"
    >
      <div className="p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-bold">
              {node.type === 'leaf' ? 'Career Path' : 'Career Branch'}
            </span>
            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mt-2 tracking-tight">{node.name}</h2>
            <div className="flex flex-wrap gap-3 mt-4">
              {node.parent_id && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  Stream: {node.parent_id.charAt(0).toUpperCase() + node.parent_id.slice(1).replace('-', ' ')}
                </div>
              )}
              {node.duration && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                  <Clock className="w-3 h-3" /> {node.duration}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {node.description && (
          <div className="mb-10 p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Career Overview</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-sans">
              {node.description}
            </p>
          </div>
        )}

        {node.job_roles && (
          <div className="mb-10 p-8 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Key Job Roles</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {node.job_roles.split(',').map((role, i) => (
                <span key={i} className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold border border-emerald-500/10 shadow-sm">
                  {role.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight">Top Institutions</h3>
            </div>
            {universities.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {universities.length} Found
              </span>
            )}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center py-20 text-slate-400 dark:text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Syncing Data...</p>
              </div>
            ) : universities.length > 0 ? (
              universities.map((uni, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-2xl transition-all group bg-white dark:bg-slate-900/50 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <h4 className="font-display font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xl leading-tight max-w-[70%]">
                      {uni.name}
                    </h4>
                    {uni.ranking && (
                      <span className={`shrink-0 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border ${
                        uni.ranking.toLowerCase().includes('govt') 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : uni.ranking.toLowerCase().includes('private')
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {uni.ranking}
                      </span>
                    )}
                  </div>
                  
                  {uni.specialization && (
                    <div className="mb-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                      {uni.specialization}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                        <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">Est. Fees</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{uni.fees}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">Duration</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{uni.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 col-span-2">
                      <div className="w-10 h-10 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
                        <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">Location</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{uni.location}</span>
                      </div>
                    </div>
                  </div>

                  {uni.website && (
                    <a 
                      href={uni.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5"
                    >
                      Visit Institution <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-16 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Info className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No specific institution data available for this branch yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SidePanel;
