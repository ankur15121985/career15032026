import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Phone, 
  Key, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  ChevronRight, 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase,
  X,
  Save,
  Loader2,
  User,
  Clock,
  Globe,
  Settings,
  Mail,
  ArrowRight
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { useFirebase } from '../context/FirebaseContext';

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

interface Submission {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  answers: any[];
  created_at: any;
}

const AdminPage: React.FC = () => {
  const { db, auth, user, loading: authLoading } = useFirebase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'careers' | 'colleges' | 'submissions' | 'appointments' | 'ip-logs' | 'settings'>('careers');

  // Data states
  const [careers, setCareers] = useState<Career[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [ipLogs, setIpLogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingAnswers, setViewingAnswers] = useState<any>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        // Check if user is the default admin or in the users collection with admin role
        if (user.email === 'ankur15121985@gmail.com') {
          setIsAdmin(true);
        } else {
          // You could also check a 'users' collection in Firestore here
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchTabData(activeTab);
    }
  }, [isAdmin, activeTab]);

  const fetchTabData = async (tab: string) => {
    console.log(`Fetching data for tab: ${tab} from Firestore...`);
    setLoading(true);
    try {
      let q;
      switch (tab) {
        case 'careers':
          q = query(collection(db, 'careers'), orderBy('name'));
          const careersSnap = await getDocs(q);
          setCareers(careersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) })) as any);
          break;
        case 'colleges':
          q = query(collection(db, 'colleges'), orderBy('name'));
          const collegesSnap = await getDocs(q);
          setColleges(collegesSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) })) as any);
          break;
        case 'submissions':
          q = query(collection(db, 'quiz_submissions'), orderBy('created_at', 'desc'));
          const submissionsSnap = await getDocs(q);
          setSubmissions(submissionsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) })) as any);
          break;
        case 'appointments':
          q = query(collection(db, 'appointments'), orderBy('appointment_time', 'desc'));
          const appointmentsSnap = await getDocs(q);
          setAppointments(appointmentsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) })) as any);
          break;
        case 'ip-logs':
          q = query(collection(db, 'ip_logs'), orderBy('visited_at', 'desc'), limit(100));
          const logsSnap = await getDocs(q);
          setIpLogs(logsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) })) as any);
          break;
      }
    } catch (err) {
      console.error(`Failed to fetch data for ${tab}`, err);
      setError(`Failed to load ${tab} data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login Error:', err);
      setError(`Login failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the career path.')) return;
    try {
      await deleteDoc(doc(db, 'careers', id));
      fetchTabData(activeTab);
    } catch (err) {
      console.error("Delete career error:", err);
    }
  };

  const handleDeleteCollege = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'colleges', id));
      fetchTabData(activeTab);
    } catch (err) {
      console.error("Delete college error:", err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await deleteDoc(doc(db, 'quiz_submissions', id));
      fetchTabData(activeTab);
    } catch (err) {
      console.error("Delete submission error:", err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      fetchTabData(activeTab);
    } catch (err) {
      console.error("Delete appointment error:", err);
    }
  };

  const handleDeleteIpLog = async (id: string) => {
    if (!window.confirm('Delete this log entry?')) return;
    try {
      await deleteDoc(doc(db, 'ip_logs', id));
      fetchTabData(activeTab);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleClearIpLogs = async () => {
    if (!window.confirm('Are you sure you want to CLEAR ALL IP logs? This cannot be undone.')) return;
    try {
      // Firestore doesn't have a clear all, we have to delete each
      const q = query(collection(db, 'ip_logs'));
      const snap = await getDocs(q);
      const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      fetchTabData(activeTab);
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const careerData = {
      name: data.name as string,
      type: data.type as string,
      parent_id: data.parent_id as string || null,
      duration: data.duration as string || null,
      job_roles: data.job_roles as string || null,
      is_leaf: data.is_leaf === 'on'
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'careers', editingItem.id), careerData);
      } else {
        // Use name as ID if possible or let Firestore generate
        const id = (data.name as string).toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'careers', id), careerData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchTabData(activeTab);
    } catch (err) {
      console.error("Save career error:", err);
    }
  };

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'colleges', editingItem.id), data as any);
      } else {
        await addDoc(collection(db, 'colleges'), data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchTabData(activeTab);
    } catch (err) {
      console.error("Save college error:", err);
    }
  };

  const handleUpdateAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      // In Firebase, we'd add this email to an 'admins' collection
      await setDoc(doc(db, 'users', newAdminEmail.replace(/\./g, '_')), {
        email: newAdminEmail,
        role: 'admin'
      });
      window.alert('Admin email added successfully.');
      setNewAdminEmail('');
    } catch (err) {
      window.alert('Error updating admin: ' + (err as Error).message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const [testEmail, setTestEmail] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  const handleTestEmail = async () => {
    if (!testEmail) return;
    setTestLoading(true);
    try {
      const res = await fetch(`/api/debug/email-test?email=${encodeURIComponent(testEmail)}`);
      const data = await res.json();
      if (data.success) {
        window.alert('Test email sent successfully! Check your inbox.');
      } else {
        window.alert('Failed to send test email: ' + data.error);
      }
    } catch (err) {
      window.alert('Error sending test email: ' + (err as Error).message);
    } finally {
      setTestLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
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
              {user ? "You do not have administrative access." : "Sign in with your admin account to access the dashboard."}
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-xs font-medium text-center bg-rose-400/10 py-2 rounded-lg border border-rose-400/20"
              >
                {error}
              </motion.p>
            )}

            {!user ? (
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-5 bg-white text-slate-950 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Sign in with Google
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleLogout}
                className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-3"
              >
                Sign Out
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
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
              { id: 'submissions', icon: User, label: 'Submissions' },
              { id: 'appointments', icon: Clock, label: 'Appointments' },
              { id: 'ip-logs', icon: Globe, label: 'IP Logs' },
              { id: 'settings', icon: Settings, label: 'Settings' },
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
            <RefreshCw className="w-5 h-5" />
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
                {activeTab === 'submissions' && 'Review student quiz submissions and results.'}
                {activeTab === 'appointments' && 'Track scheduled career counseling sessions.'}
                {activeTab === 'ip-logs' && 'Monitor visitor traffic and access logs.'}
                {activeTab === 'settings' && 'Configure administrative credentials.'}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => fetchTabData(activeTab)}
                disabled={loading}
                className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {activeTab === 'ip-logs' && (
                <button 
                  onClick={handleClearIpLogs}
                  className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg shadow-rose-100 dark:shadow-none"
                >
                  <Trash2 className="w-5 h-5" /> Clear All
                </button>
              )}
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
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Submissions</p>
                <p className="text-3xl font-display font-bold text-violet-600">{submissions.length}</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {activeTab === 'careers' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">ID</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Type</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Duration</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {careers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No careers found.
                      </td>
                    </tr>
                  ) : careers.map((career) => (
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
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">College Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Career Link</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Location</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Fees</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {colleges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No colleges found.
                      </td>
                    </tr>
                  ) : colleges.map((college) => (
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
          ) : activeTab === 'submissions' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Student Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Contact Info</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Results</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No quiz submissions found.
                      </td>
                    </tr>
                  ) : submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{sub.name}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium">{sub.email || 'No Email'}</span>
                          <span>{sub.phone || 'No Phone'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        {formatDateTime(sub.created_at)}
                      </td>
                      <td className="px-8 py-5">
                        <button 
                          onClick={() => {
                            setViewingAnswers(sub.answers);
                          }}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          View Answers <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'appointments' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Student</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Time</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Consultant</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Scores</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No appointments found.
                      </td>
                    </tr>
                  ) : appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{app.user_name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{app.user_email}</span>
                          <span className="text-xs text-indigo-500 dark:text-indigo-400 font-mono">{app.user_phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {formatDateTime(app.appointment_time)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-900 dark:text-white font-medium">{app.consultant_name}</td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold uppercase tracking-wider">AQ: {app.aq_score}%</span>
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold uppercase tracking-wider">IQ: {app.iq_score}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px] italic">{app.top_recommendation}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteAppointment(app.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'ip-logs' ? (
            <div className="overflow-x-auto">
              <div className="p-6 flex justify-end border-b border-slate-50 dark:border-slate-800">
                <button 
                  onClick={() => fetchTabData(activeTab)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Logs
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">IP Address</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Visited At</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {ipLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                        No IP logs found.
                      </td>
                    </tr>
                  ) : ipLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5 font-mono text-sm text-slate-900 dark:text-white">{log.ip_address}</td>
                      <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        {formatDateTime(log.visited_at)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteIpLog(log.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 max-w-2xl mx-auto">
              <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                  <Settings className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Admin Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-3 max-w-sm leading-relaxed">
                  Securely add new administrative email addresses for dashboard access.
                </p>
              </div>

              <form onSubmit={handleUpdateAdminEmail} className="space-y-8 bg-slate-50/50 dark:bg-slate-800/30 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">New Admin Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="email" 
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none text-slate-900 dark:text-white shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={updateLoading}
                  className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-indigo-500/10"
                >
                  {updateLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      Add Admin
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Email Configuration Test */}
              <div className="mt-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Email Configuration Test</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Enter an email address to send a test message and verify your SMTP settings.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleTestEmail}
                    disabled={testLoading || !testEmail}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {testLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    Send Test Email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>

      {/* Answers Detail Modal */}
      <AnimatePresence>
        {viewingAnswers && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingAnswers(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 flex flex-col max-h-[90vh] border border-transparent dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Quiz Answers</h3>
                <button onClick={() => setViewingAnswers(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {viewingAnswers.map((ans: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Question {i + 1} ({ans.type})</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ans.isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                        {ans.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium mb-2">{ans.text}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-400 dark:text-slate-500 uppercase font-bold text-[9px]">Selected</p>
                        <p className={ans.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>{ans.selected}</p>
                      </div>
                      {!ans.isCorrect && (
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 uppercase font-bold text-[9px]">Correct Answer</p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold">{ans.correct}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                      <input name="parent_id" defaultValue={editingItem?.parent_id} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
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
                      <input type="checkbox" name="is_leaf" defaultChecked={editingItem?.is_leaf === 1} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <label className="text-sm font-bold text-slate-700">Is Leaf Node?</label>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Career ID (Link)</label>
                      <select name="career_id" defaultValue={editingItem?.career_id} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
                        {careers.filter(c => c.type === 'leaf').map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
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
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" /> Save Changes
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
