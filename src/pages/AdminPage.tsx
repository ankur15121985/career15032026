import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  ChevronRight, 
  GraduationCap, 
  Briefcase,
  X,
  Save,
  Loader2,
  LogOut,
  Database,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  writeBatch
} from 'firebase/firestore';
import { CAREERS } from '../data/careers';
import { COLLEGES } from '../data/colleges';

interface Career {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
  duration: string | null;
  job_roles: string | null;
  is_leaf: boolean;
}

interface College {
  id?: string;
  career_id: string;
  name: string;
  location: string;
  fees: string;
  duration: string;
  ranking: string;
  specialization: string;
  website?: string;
}

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'careers' | 'colleges'>('careers');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Data states
  const [careers, setCareers] = useState<Career[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; callback: () => void } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      setLoading(false);
      if (user) {
        fetchTabData(activeTab);
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        providerInfo: auth.currentUser?.providerData.map((provider: any) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const fetchTabData = async (tab: string) => {
    setLoading(true);
    try {
      const colRef = collection(db, tab);
      const q = query(colRef);
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any;
      if (tab === 'careers') setCareers(data);
      if (tab === 'colleges') setColleges(data);
    } catch (err) {
      handleFirestoreError(err, 'get', tab);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDeleteCareer = async (id: string) => {
    setConfirmAction({
      type: 'Delete Career',
      callback: async () => {
        try {
          await deleteDoc(doc(db, 'careers', id));
          setCareers(careers.filter(c => c.id !== id));
          setConfirmAction(null);
          setSuccessMessage('Career deleted successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          handleFirestoreError(err, 'delete', `careers/${id}`);
        }
      }
    });
  };

  const handleDeleteCollege = async (id: string) => {
    setConfirmAction({
      type: 'Delete College',
      callback: async () => {
        try {
          await deleteDoc(doc(db, 'colleges', id));
          setColleges(colleges.filter(c => c.id !== id));
          setConfirmAction(null);
          setSuccessMessage('College deleted successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          handleFirestoreError(err, 'delete', `colleges/${id}`);
        }
      }
    });
  };

  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const careerId = editingItem?.id || (data.id as string);
    const careerData = {
      name: data.name as string,
      type: data.type as string,
      parent_id: data.parent_id as string || null,
      duration: data.duration as string || null,
      job_roles: data.job_roles as string || null,
      is_leaf: data.is_leaf === 'on'
    };

    try {
      await setDoc(doc(db, 'careers', careerId), careerData);
      await fetchTabData('careers');
      setIsModalOpen(false);
      setEditingItem(null);
      setSuccessMessage('Career saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      handleFirestoreError(err, 'write', `careers/${careerId}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const collegeData = {
      career_id: data.career_id as string,
      name: data.name as string,
      location: data.location as string,
      fees: data.fees as string,
      duration: data.duration as string,
      ranking: data.ranking as string,
      specialization: data.specialization as string,
      website: data.website as string || ''
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'colleges', editingItem.id), collegeData);
      } else {
        await addDoc(collection(db, 'colleges'), collegeData);
      }
      await fetchTabData('colleges');
      setIsModalOpen(false);
      setEditingItem(null);
      setSuccessMessage('College saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      handleFirestoreError(err, editingItem ? 'update' : 'create', 'colleges');
    } finally {
      setUpdateLoading(false);
    }
  };

  const syncDataToFirestore = async () => {
    setConfirmAction({
      type: 'Sync Static Data to Firestore',
      callback: async () => {
        setSyncing(true);
        setConfirmAction(null);
        try {
          const batch = writeBatch(db);
          
          // Sync Careers
          for (const career of CAREERS) {
            const careerRef = doc(db, 'careers', career.id);
            batch.set(careerRef, {
              name: career.name,
              type: career.type,
              parent_id: career.parent_id,
              duration: career.duration,
              job_roles: career.job_roles,
              is_leaf: career.is_leaf
            });
          }
          
          // Sync Colleges
          for (const college of COLLEGES) {
            const { id, ...collegeData } = college;
            const collegeRef = doc(db, 'colleges', id);
            batch.set(collegeRef, collegeData);
          }
          
          await batch.commit();
          setSuccessMessage('Data synced successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
          fetchTabData(activeTab);
        } catch (err) {
          handleFirestoreError(err, 'write', 'sync');
        } finally {
          setSyncing(false);
        }
      }
    });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let result: any[] = activeTab === 'careers' ? [...careers] : [...colleges];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item: any) => 
        (item.name?.toLowerCase().includes(lowerSearch)) ||
        (item.id?.toLowerCase().includes(lowerSearch)) ||
        (item.career_id?.toLowerCase().includes(lowerSearch)) ||
        (item.location?.toLowerCase().includes(lowerSearch))
      );
    }

    // Filter by type (careers only)
    if (activeTab === 'careers' && filterType !== 'all') {
      result = result.filter((item: any) => item.type === filterType);
    }

    // Sort
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [careers, colleges, activeTab, searchTerm, filterType, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 p-10 relative z-10"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 overflow-hidden p-2">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<svg viewBox="0 0 24 24" class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
              }} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight text-center">Career Sirji Admin</h1>
            <p className="text-slate-400 text-sm text-center mt-3 leading-relaxed">
              Sign in with your admin credentials.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-xs font-medium text-center bg-rose-400/10 py-2 rounded-lg border border-rose-400/20"
              >
                {error}
              </motion.p>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@careersirji.com"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-slate-950 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Confirm Action</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Are you sure you want to proceed with <span className="font-bold text-slate-900 dark:text-white">{confirmAction.type}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction.callback}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 dark:shadow-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<svg viewBox="0 0 24 24" class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>';
              }} />
            </div>
            <span className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Career Sirji</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'careers', icon: Briefcase, label: 'Careers' },
              { id: 'colleges', icon: GraduationCap, label: 'Colleges' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 min-h-screen p-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2 capitalize">
                  {activeTab.replace('-', ' ')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  {activeTab === 'careers' && 'Manage career paths and branching structures.'}
                  {activeTab === 'colleges' && 'Manage institutions and their specializations.'}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={syncDataToFirestore}
                  disabled={syncing}
                  className="px-6 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center gap-2"
                >
                  <Database className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Data'}
                </button>
                <button 
                  onClick={() => fetchTabData(activeTab)}
                  disabled={loading}
                  className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              {['careers', 'colleges'].includes(activeTab) && (
                <button 
                  onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  <Plus className="w-5 h-5" /> Add {activeTab === 'careers' ? 'Career' : 'College'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Bento */}
          {activeTab === 'careers' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Careers</p>
                <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{careers.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Leaf Nodes</p>
                <p className="text-3xl font-display font-bold text-emerald-600">{careers.filter(c => c.is_leaf).length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Colleges</p>
                <p className="text-3xl font-display font-bold text-indigo-600">{colleges.length}</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all"
              />
            </div>
            {activeTab === 'careers' && (
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white appearance-none transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="root">Root</option>
                  <option value="branch">Branch</option>
                  <option value="leaf">Leaf</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {activeTab === 'careers' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th 
                      className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        ID <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Name <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-2">
                        Type <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Duration</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredAndSortedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No careers found matching your criteria.
                      </td>
                    </tr>
                  ) : filteredAndSortedData.map((career: any) => (
                    <tr key={career.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5 font-mono text-xs text-slate-400 dark:text-slate-500">{career.id}</td>
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">
                        <div>
                          {career.name}
                          {career.job_roles && (
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1" title={career.job_roles}>
                              {career.job_roles}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${career.type === 'leaf' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                          {career.type}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-medium">{career.duration || '-'}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingItem(career); setIsModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCareer(career.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'colleges' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th 
                      className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        College Name <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleSort('career_id')}
                    >
                      <div className="flex items-center gap-2">
                        Career Link <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Location <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Fees</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredAndSortedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No colleges found matching your criteria.
                      </td>
                    </tr>
                  ) : filteredAndSortedData.map((college: any) => (
                    <tr key={college.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{college.name}</td>
                      <td className="px-8 py-5 text-slate-400 dark:text-slate-500 text-xs font-mono">{college.career_id}</td>
                      <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-medium">{college.location}</td>
                      <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-bold">{college.fees}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingItem(college); setIsModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCollege(college.id!)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </main>

    {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-transparent dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  {editingItem ? 'Edit' : 'Add New'} {activeTab === 'careers' ? 'Career' : 'College'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={activeTab === 'careers' ? handleSaveCareer : handleSaveCollege} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {activeTab === 'careers' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Unique ID</label>
                      <input name="id" defaultValue={editingItem?.id} readOnly={!!editingItem} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Type</label>
                      <select name="type" defaultValue={editingItem?.type || 'leaf'} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
                        <option value="root">Root</option>
                        <option value="branch">Branch</option>
                        <option value="leaf">Leaf</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Parent ID</label>
                      <select name="parent_id" defaultValue={editingItem?.parent_id || ''} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
                        <option value="">None (Root)</option>
                        {careers.filter(c => c.type !== 'leaf' && c.id !== editingItem?.id).map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Duration</label>
                      <input name="duration" defaultValue={editingItem?.duration} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Job Roles (Comma separated)</label>
                      <textarea name="job_roles" defaultValue={editingItem?.job_roles} rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none" placeholder="e.g. Software Engineer, Data Scientist, Web Developer" />
                    </div>
                    <div className="flex items-center gap-3 pt-8">
                      <input type="checkbox" name="is_leaf" defaultChecked={editingItem?.is_leaf} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <label className="text-sm font-bold text-slate-700">Is Leaf Node?</label>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Career ID (Link)</label>
                      <select name="career_id" defaultValue={editingItem?.career_id || ''} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
                        <option value="" disabled>Select a Career Path</option>
                        {careers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.id}) - {c.type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">College Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Location</label>
                      <input name="location" defaultValue={editingItem?.location} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Fees</label>
                      <input name="fees" defaultValue={editingItem?.fees} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Duration</label>
                      <input name="duration" defaultValue={editingItem?.duration} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Ranking</label>
                      <input name="ranking" defaultValue={editingItem?.ranking} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Specialization</label>
                      <input name="specialization" defaultValue={editingItem?.specialization} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Official Website</label>
                      <input name="website" defaultValue={editingItem?.website} placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                )}

                <div className="pt-6 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={updateLoading}
                    className={`flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updateLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
