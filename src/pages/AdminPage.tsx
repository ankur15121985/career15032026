import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../services/dataService';
import { 
  Users, 
  Network, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Calendar,
  Mail,
  Phone,
  Clock,
  GraduationCap,
  Map as MapIcon,
  RefreshCw,
  Download,
  Globe
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'careers' | 'appointments' | 'visitors'>('careers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Careers State
  const [careers, setCareers] = useState<any[]>([]);
  const [editingCareer, setEditingCareer] = useState<any | null>(null);
  const [isAddingCareer, setIsAddingCareer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Appointments State
  const [appointments, setAppointments] = useState<any[]>([]);

  // Visitors State
  const [visitors, setVisitors] = useState<any[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid password');
    }
  };

  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("[Admin] Fetching data from service...");
      const [careersData, apptsData, visitorsData] = await Promise.all([
        dataService.getCareers(),
        dataService.getAppointments(),
        dataService.getVisitors()
      ]);
      
      console.log("[Admin] Data received:", { 
        careers: careersData?.length, 
        appointments: apptsData?.length,
        visitors: visitorsData?.length 
      });
      
      setCareers(Array.isArray(careersData) ? careersData : []);
      setAppointments(Array.isArray(apptsData) ? apptsData : []);
      setVisitors(Array.isArray(visitorsData) ? visitorsData : []);
    } catch (err: any) {
      console.error("[AdminPage] Fetch error:", err);
      setError(err.message || 'Failed to fetch data. Please ensure your browser supports local storage.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const { CAREERS } = await import('../data/careers');
      const success = await dataService.saveCareers(CAREERS);
      if (success) {
        await fetchData();
        alert('Data seeded successfully! (Stored in your browser)');
      } else {
        throw new Error('Failed to seed data');
      }
    } catch (err: any) {
      alert('Error seeding data: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAuthenticated) {
      fetchData();
      // Auto-refresh data every 30 seconds
      interval = setInterval(fetchData, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  const saveCareers = async (updatedCareers: any[]) => {
    console.log("[AdminPage] Saving careers to service, count:", updatedCareers.length);
    try {
      const success = await dataService.saveCareers(updatedCareers);
      if (success) {
        setCareers(updatedCareers);
        setSuccess('Careers updated successfully (Stored in your browser)');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to save careers to local storage');
      }
    } catch (err) {
      console.error("[AdminPage] Save error:", err);
      setError('Failed to save careers');
    }
  };

  const handleDeleteCareer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this career option?')) {
      const updated = careers.filter(c => c.id !== id);
      saveCareers(updated);
    }
  };

  const handleSaveCareer = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const careerData: any = Object.fromEntries(formData.entries());
    console.log("[AdminPage] Form data:", careerData);
    
    const newCareer = {
      ...careerData,
      is_leaf: careerData.type === 'leaf',
      parent_id: careerData.parent_id || null
    };
    console.log("[AdminPage] New career object:", newCareer);

    let updated;
    if (editingCareer) {
      updated = careers.map(c => c.id === editingCareer.id ? { ...c, ...newCareer } : c);
    } else {
      // Check for duplicate ID
      const newId = careerData.id || `career-${Date.now()}`;
      if (careers.some(c => c.id === newId)) {
        setError(`A career with ID "${newId}" already exists.`);
        return;
      }
      updated = [...careers, { ...newCareer, id: newId }];
    }
    console.log("[AdminPage] Updated careers array length:", updated.length);

    saveCareers(updated);
    setEditingCareer(null);
    setIsAddingCareer(false);
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const success = await dataService.deleteAppointment(id);
        if (success) {
          setAppointments(appointments.filter(a => a.id !== id));
          setSuccess('Appointment deleted');
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError('Failed to delete appointment');
        }
      } catch (err) {
        console.error("[AdminPage] Delete error:", err);
        setError('Failed to delete appointment');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20 overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Admin Access</h1>
            <p className="text-slate-400 text-sm mt-2">Enter your credentials to manage CareerSirji</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredCareers = careers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white">Admin Panel</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('careers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'careers' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Network className="w-4 h-4" /> Career Options
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Users className="w-4 h-4" /> Appointments
            </button>
            <button 
              onClick={() => setActiveTab('visitors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'visitors' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Globe className="w-4 h-4" /> Visitor Logs
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white capitalize">
            {activeTab} Management
          </h2>

          <div className="flex items-center gap-4">
            {success && (
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> {success}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchData}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {careers.length === 0 && (
                <button 
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Download className={`w-3 h-3 ${isSeeding ? 'animate-bounce' : ''}`} />
                  {isSeeding ? 'Seeding...' : 'Seed Careers'}
                </button>
              )}
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {loading ? 'Syncing...' : 'System Online'}
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'careers' ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search career options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setIsAddingCareer(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Career Option
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID / Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Parent</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCareers.length > 0 ? (
                      filteredCareers.map(career => (
                        <tr key={career.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{career.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{career.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              career.type === 'root' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                              career.type === 'branch' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            }`}>
                              {career.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {career.parent_id || '-'}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                            {career.duration || '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setEditingCareer(career)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCareer(career.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white">No careers found</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search or add a new career.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'appointments' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Appointments</div>
                  <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{appointments.length}</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">User Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Consultant / Time</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Recommendation</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">IP Address</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Scores (IQ/AQ)</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {appointments.length > 0 ? (
                      [...appointments].sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                      }).map(appt => (
                        <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{appt.user_name}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <Mail className="w-3 h-3" /> {appt.user_email}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <Phone className="w-3 h-3" /> {appt.user_phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{appt.consultant_name}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <Calendar className="w-3 h-3" /> {appt.appointment_time ? new Date(appt.appointment_time).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <Clock className="w-3 h-3" /> {appt.appointment_time ? new Date(appt.appointment_time).toLocaleTimeString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              <GraduationCap className="w-3 h-3" /> {appt.top_recommendation || 'General'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{appt.ip || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">IQ: {appt.iq_score ?? 'N/A'}%</div>
                              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">AQ: {appt.aq_score ?? 'N/A'}%</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-6 h-6 text-slate-400" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white">No appointments found</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">New bookings will appear here.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unique Visitors (IP)</div>
                  <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{visitors.length}</div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Page Views</div>
                  <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                    {visitors.reduce((sum, v) => sum + (v.visits || 1), 0)}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">IP Address</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">First Visit</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Visit</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Visits</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Device Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visitors.length > 0 ? (
                      [...visitors].sort((a, b) => {
                        const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : new Date(a.timestamp).getTime();
                        const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : new Date(b.timestamp).getTime();
                        return dateB - dateA;
                      }).map((visitor, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{visitor.ip}</div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(visitor.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                            {visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleString() : new Date(visitor.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                              {visitor.visits || 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] text-slate-400 max-w-[200px] truncate" title={visitor.userAgent}>
                            {visitor.userAgent || 'Unknown'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Globe className="w-6 h-6 text-slate-400" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white">No visitor data yet</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Visitor logs will appear here.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Career Modal */}
      <AnimatePresence>
        {(isAddingCareer || editingCareer) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  {editingCareer ? 'Edit Career Option' : 'Add New Career Option'}
                </h3>
                <button 
                  onClick={() => {
                    setIsAddingCareer(false);
                    setEditingCareer(null);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveCareer} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Unique ID</label>
                    <input 
                      name="id"
                      defaultValue={editingCareer?.id}
                      required
                      readOnly={!!editingCareer}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. mbbs-special"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
                    <input 
                      name="name"
                      defaultValue={editingCareer?.name}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. MBBS Specialization"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Type</label>
                    <select 
                      name="type"
                      defaultValue={editingCareer?.type || 'leaf'}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="branch">Branch (Has children)</option>
                      <option value="leaf">Leaf (Final path)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Parent ID</label>
                    <select 
                      name="parent_id"
                      defaultValue={editingCareer?.parent_id || ''}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="">None (Root)</option>
                      {careers.filter(c => c.type !== 'leaf').map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Duration</label>
                    <input 
                      name="duration"
                      defaultValue={editingCareer?.duration}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. 4 years"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Job Roles (Comma separated)</label>
                    <input 
                      name="job_roles"
                      defaultValue={editingCareer?.job_roles}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. Doctor, Surgeon"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAddingCareer(false);
                      setEditingCareer(null);
                    }}
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Save className="w-4 h-4" /> {editingCareer ? 'Update Option' : 'Create Option'}
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
