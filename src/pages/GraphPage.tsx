import React, { useState, useEffect, useMemo } from 'react';
import Graph from '../components/Graph';
import SidePanel from '../components/SidePanel';
import { CareerNode } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { buildTree } from '../data/defaultCareers';
import { Filter, Search, Clock, GraduationCap, X } from 'lucide-react';
import { CAREERS } from '../data/careers';

const GraphPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [flatCareers, setFlatCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandAllNodes, setExpandAllNodes] = useState(false);

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      console.log("[GraphPage] Fetching careers...");
      try {
        const response = await fetch('/api/careers');
        if (response.ok) {
          const data = await response.json();
          console.log("[GraphPage] Received data from API:", data?.length);
          if (data && data.length > 0) {
            setFlatCareers(data);
          } else {
            console.log("[GraphPage] API returned empty, seeding with local CAREERS");
            setFlatCareers(CAREERS);
            fetch('/api/careers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(CAREERS)
            }).then(res => console.log("[GraphPage] Seed POST response:", res.status))
              .catch(err => console.error("[GraphPage] Failed to seed API careers:", err));
          }
        } else {
          console.log("[GraphPage] API response not OK, using local CAREERS");
          setFlatCareers(CAREERS);
        }
      } catch (error) {
        console.error("[GraphPage] Error loading careers:", error);
        setFlatCareers(CAREERS);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    // Reset field when stream changes
    setSelectedField('all');
  }, [selectedStream]);

  const filteredTree = useMemo(() => {
    console.log("[GraphPage] Computing filteredTree, flatCareers length:", flatCareers.length);
    if (!flatCareers.length) return null;

    const matchingIds = new Set<string>();
    const hasActiveFilters = searchQuery.trim() !== '' || selectedStream !== 'all' || selectedField !== 'all' || selectedDuration !== 'all';

    if (!hasActiveFilters) {
      const tree = buildTree(flatCareers);
      console.log("[GraphPage] No active filters, tree built:", !!tree);
      return tree;
    }

    // Helper to add all ancestors of a node
    const addAncestors = (nodeId: string) => {
      let current = flatCareers.find(c => c.id === nodeId);
      while (current) {
        matchingIds.add(current.id);
        if (!current.parent_id) break;
        current = flatCareers.find(c => c.id === current.parent_id);
      }
    };

    // Helper to add all descendants of a node
    const addDescendants = (nodeId: string) => {
      flatCareers.forEach(item => {
        if (item.parent_id === nodeId) {
          matchingIds.add(item.id);
          addDescendants(item.id);
        }
      });
    };

    // Apply filters
    flatCareers.forEach(item => {
      let matches = true;

      // Search Filter
      if (searchQuery.trim()) {
        if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          matches = false;
        }
      }

      // Stream Filter
      if (matches && selectedStream !== 'all') {
        // If we are filtering by stream, we want to see nodes in that stream
        // A node matches if it is the stream itself OR if its top-level ancestor is the stream
        let isChildOfStream = false;
        let current = item;
        while (current) {
          if (current.id === selectedStream) {
            isChildOfStream = true;
            break;
          }
          current = flatCareers.find(c => c.id === current.parent_id);
        }
        if (!isChildOfStream) matches = false;
      }

      // Field Filter
      if (matches && selectedField !== 'all') {
        let isChildOfField = false;
        let current = item;
        while (current) {
          if (current.id === selectedField) {
            isChildOfField = true;
            break;
          }
          current = flatCareers.find(c => c.id === current.parent_id);
        }
        if (!isChildOfField) matches = false;
      }

      // Duration Filter
      if (matches && selectedDuration !== 'all') {
        if (!(item.is_leaf && item.duration && item.duration.includes(selectedDuration))) {
          matches = false;
        }
      }

      if (matches) {
        addAncestors(item.id);
        // If it's a branch (not a leaf), we might want to show its children too?
        // Usually, if I search for "Engineering", I want to see all engineering branches.
        if (!item.is_leaf) {
          addDescendants(item.id);
        }
      }
    });

    // Always ensure root is there if we have any matches
    if (matchingIds.size > 0) {
      matchingIds.add('root');
    }

    const filtered = flatCareers.filter(item => matchingIds.has(item.id));
    const tree = buildTree(filtered);
    console.log("[GraphPage] Filtered tree built:", !!tree, "Filtered count:", filtered.length);
    return tree;
  }, [flatCareers, searchQuery, selectedStream, selectedField, selectedDuration]);

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
      {/* Massive Background Typography (Recipe 2) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <motion.div
          initial={{ opacity: 0, scale: 1.2, skewX: -10 }}
          animate={{ opacity: 0.05, scale: 1, skewX: -10 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-[25vw] font-display font-bold leading-none tracking-tighter text-slate-900 dark:text-white uppercase"
        >
          Explore
        </motion.div>
      </div>

      {/* Atmospheric Background (Recipe 7) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Filter Controls Overlay */}
      <div className="absolute top-6 left-4 right-4 md:left-6 md:right-auto z-50 flex flex-col gap-4 max-w-md w-auto md:w-full pointer-events-none">
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
          <button 
            onClick={() => setExpandAllNodes(!expandAllNodes)}
            className={`hidden sm:block px-4 py-3 rounded-2xl backdrop-blur-xl border transition-all shadow-xl text-xs font-bold uppercase tracking-widest ${expandAllNodes ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            {expandAllNodes ? 'Collapse' : 'Expand All'}
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
                  setExpandAllNodes(false);
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
          expandAll={expandAllNodes || searchQuery !== '' || selectedStream !== 'all' || selectedField !== 'all' || selectedDuration !== 'all'}
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
            flatCareers={flatCareers}
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
