import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Calendar, Users, CheckCircle2, ArrowRight, Mail, User, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    consultant_name: 'Dr. Sharma',
    appointment_time: '',
    top_recommendation: 'Software Engineering'
  });

  useEffect(() => {
    fetch('/api/visitor-count')
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(err => console.error('Failed to fetch visitor count:', err));
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setBookingStatus('success');
      } else {
        setBookingStatus('error');
      }
    } catch (err) {
      setBookingStatus('error');
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight text-stone-900 italic serif">CareerSirji</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-stone-500">
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>{visitorCount.toLocaleString()} Visitors</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl font-bold tracking-tight text-stone-900 leading-[0.9] mb-6">
              NAVIGATE YOUR <br />
              <span className="text-indigo-600">FUTURE PATH</span>
            </h1>
            <p className="text-xl text-stone-600 mb-8 max-w-xl">
              Personalized career counseling to help you discover your true potential and land your dream role.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#book" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                Book Consultation <ArrowRight className="w-4 h-4" />
              </a>
              <div className="px-8 py-4 bg-white border border-stone-200 text-stone-900 rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Success Rate
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 skew-x-[-12deg] translate-x-1/4 -z-0" />
      </section>

      {/* Booking Section */}
      <section id="book" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-stone-900 mb-6 italic serif">Schedule Your Session</h2>
              <p className="text-stone-600 mb-12">
                Fill out the form below to book a 1-on-1 session with our expert consultants. We'll help you map out your career journey.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: User, title: "Expert Guidance", desc: "Sessions with industry veterans." },
                  { icon: Briefcase, title: "Career Mapping", desc: "Detailed roadmap for your goals." },
                  { icon: Calendar, title: "Flexible Timing", desc: "Choose a slot that works for you." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900">{item.title}</h3>
                      <p className="text-stone-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-stone-50 p-8 rounded-3xl border border-stone-200 shadow-sm"
            >
              {bookingStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-stone-600 mb-8">Check your email for the appointment details.</p>
                  <button 
                    onClick={() => setBookingStatus('idle')}
                    className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={formData.user_name}
                          onChange={e => setFormData({...formData, user_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={formData.user_email}
                          onChange={e => setFormData({...formData, user_email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Consultant</label>
                    <select 
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                      value={formData.consultant_name}
                      onChange={e => setFormData({...formData, consultant_name: e.target.value})}
                    >
                      <option>Dr. Sharma</option>
                      <option>Prof. Gupta</option>
                      <option>Ms. Iyer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Preferred Time</label>
                    <input 
                      required
                      type="datetime-local" 
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.appointment_time}
                      onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                    />
                  </div>

                  <button 
                    disabled={bookingStatus === 'loading'}
                    type="submit"
                    className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    {bookingStatus === 'loading' ? 'Processing...' : 'Confirm Appointment'}
                  </button>
                  
                  {bookingStatus === 'error' && (
                    <p className="text-sm text-red-600 text-center">Failed to book. Please try again.</p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Compass className="w-6 h-6" />
            <span className="text-lg font-bold tracking-tight italic serif">CareerSirji</span>
          </div>
          <p className="text-stone-400 text-sm">© 2026 CareerSirji. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
