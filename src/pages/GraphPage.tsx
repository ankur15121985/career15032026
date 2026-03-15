import React, { useState, useEffect, useMemo } from 'react';
import Graph from '../components/Graph';
import SidePanel from '../components/SidePanel';
import { CareerNode } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_CAREERS_FLAT, buildTree } from '../data/defaultCareers';
import { Filter, Search, Clock, GraduationCap, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

const GraphPage: React.FC = () => {
  const { db } = useFirebase();
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [flatCareers, setFlatCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Reset field when stream changes
    setSelectedField('all');
  }, [selectedStream]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'careers'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (data && data.length > 0) {
          setFlatCareers(data);
        } else {
          setFlatCareers(DEFAULT_CAREERS_FLAT);
        }
      } catch (err) {
        console.error('Failed to fetch careers from Firestore, using fallback data', err);
        setFlatCareers(DEFAULT_CAREERS_FLAT);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareers();
  }, [db]);

  const filteredTree = useMemo(() => {
    if (!flatCareers.length) return null;

    let filtered = [...flatCareers];

    // 1. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchingIds = new Set<string>();
      
      // Find all matching nodes
      filtered.forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
          matchingIds.add(item.id);
          // Add all ancestors to ensure they are visible
          let current = item;
          while (current && current.parent_id) {
            matchingIds.add(current.parent_id);
            current = flatCareers.find(c => c.id === current.parent_id);
          }
        }
      });
      
      filtered = flatCareers.filter(item => matchingIds.has(item.id));
    }

    // 2. Filter by Stream (Top-level branches)
    if (selectedStream !== 'all') {
      const matchingIds = new Set<string>();
      matchingIds.add('root'); // Always keep root
      matchingIds.add(selectedStream);
      
      // Find all descendants of the selected stream
      const addDescendants = (parentId: string) => {
        flatCareers.forEach(item => {
          if (item.parent_id === parentId) {
            matchingIds.add(item.id);
            addDescendants(item.id);
          }
        });
      };
      addDescendants(selectedStream);
      
      filtered = filtered.filter(item => matchingIds.has(item.id));
    }

    // 2.5 Filter by Field (Sub-branches)
    if (selectedField !== 'all') {
      const matchingIds = new Set<string>();
      matchingIds.add('root'); // Always keep root
      
      // Add ancestors of the field
      let currentField = flatCareers.find(c => c.id === selectedField);
      while (currentField) {
        matchingIds.add(currentField.id);
        currentField = flatCareers.find(c => c.id === currentField.parent_id);
      }

      // Find all descendants of the selected field
      const addDescendants = (parentId: string) => {
        flatCareers.forEach(item => {
          if (item.parent_id === parentId) {
            matchingIds.add(item.id);
            addDescendants(item.id);
          }
        });
      };
      addDescendants(selectedField);
      
      filtered = filtered.filter(item => matchingIds.has(item.id));
    }

    // 3. Filter by Duration (Leaf nodes)
    if (selectedDuration !== 'all') {
      const matchingIds = new Set<string>();
      matchingIds.add('root'); // Always keep root
      
      filtered.forEach(item => {
        if (item.is_leaf && item.duration && item.duration.includes(selectedDuration)) {
          matchingIds.add(item.id);
          // Add all ancestors
          let current = item;
          while (current && current.parent_id) {
            matchingIds.add(current.parent_id);
            current = flatCareers.find(c => c.id === current.parent_id);
          }
        }
      });
      
      filtered = filtered.filter(item => matchingIds.has(item.id));
    }

    return buildTree(filtered);
  }, [flatCareers, searchQuery, selectedStream, selectedDuration]);

  const streams = useMemo(() => {
    return flatCareers.filter(c => c.parent_id === 'root');
  }, [flatCareers]);

  const fields = useMemo(() => {
    if (selectedStream === 'all') return [];
    return flatCareers.filter(c => c.parent_id === selectedStream && !c.is_leaf);
  }, [flatCareers, selectedStream]);

  const durations = ['1 year', '2 years', '3 years', '4 years', '5 years'];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Loading Career Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Filter Controls Overlay */}
      <div className="absolute top-6 left-6 z-50 flex flex-col gap-4 max-w-md w-full pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl backdrop-blur-xl border transition-all shadow-xl ${showFilters ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl pointer-events-auto space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Interactive Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Stream Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <GraduationCap className="w-3 h-3" /> Stream / Major
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedStream('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedStream === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    All Streams
                  </button>
                  {streams.map(stream => (
                    <button 
                      key={stream.id}
                      onClick={() => setSelectedStream(stream.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedStream === stream.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      {stream.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Filter */}
              {selectedStream !== 'all' && fields.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Filter className="w-3 h-3" /> Career Field
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedField('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedField === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      All Fields
                    </button>
                    {fields.map(field => (
                      <button 
                        key={field.id}
                        onClick={() => setSelectedField(field.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedField === field.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      >
                        {field.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3 h-3" /> Duration
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedDuration('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedDuration === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    Any Duration
                  </button>
                  {durations.map(d => (
                    <button 
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedDuration === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStream('all');
                  setSelectedField('all');
                  setSelectedDuration('all');
                }}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredTree ? (
        <Graph 
          data={filteredTree} 
          onNodeClick={(node) => setSelectedNode(node)} 
          expandAll={searchQuery !== '' || selectedStream !== 'all' || selectedField !== 'all' || selectedDuration !== 'all'}
        />
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm">
            <Filter className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Results Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedStream('all');
                setSelectedField('all');
                setSelectedDuration('all');
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {selectedNode && (
          <SidePanel 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 dark:bg-indigo-900 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100 dark:bg-emerald-900 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default GraphPage;
