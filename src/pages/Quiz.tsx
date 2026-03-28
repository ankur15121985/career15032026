import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { QUESTIONS, Question } from '../data/questions';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'contact' | 'quiz'>('contact');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Pick 10 IQ and 10 AQ questions
      const iqQuestions = QUESTIONS.filter(q => q.type === 'IQ').sort(() => 0.5 - Math.random()).slice(0, 10);
      const aqQuestions = QUESTIONS.filter(q => q.type === 'AQ').sort(() => 0.5 - Math.random()).slice(0, 10);
      
      const selected = [...iqQuestions, ...aqQuestions].sort(() => 0.5 - Math.random());
      setQuestions(selected);
      setStep('quiz');
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setQuestions(QUESTIONS.slice(0, 20));
      setStep('quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactInfo.name && (contactInfo.email || contactInfo.phone)) {
      fetchQuestions();
    }
  };

  const handleAnswer = async (value: string) => {
    const question = questions[currentQuestion];
    const isCorrect = value === question.correct_answer;
    
    const answerData = {
      questionId: question.id,
      text: question.text,
      type: question.type,
      selected: value,
      correct: question.correct_answer,
      isCorrect
    };

    const newAnswers = [...answers, answerData];
    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Navigate to results with answers
      navigate('/result', { state: { answers: newAnswers, contactInfo } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Generating your personalized quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <Helmet>
        <title>Career Assessment Quiz: Discover Your IQ and AQ with CareerSirji</title>
        <meta name="description" content="Take our scientific career assessment quiz to measure your IQ and AQ. Get personalized career suggestions based on your strengths and situational adaptability." />
      </Helmet>
      <AnimatePresence mode="wait">
        {step === 'contact' ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Get Started</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Please provide your details to begin the career quiz.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
              >
                Start Quiz <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Question {currentQuestion + 1} of {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 w-4 rounded-full transition-all ${idx <= currentQuestion ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${questions[currentQuestion].type === 'IQ' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                  {questions[currentQuestion].type} Test
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{questions[currentQuestion].category}</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{questions[currentQuestion].text}</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="p-5 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 rounded-2xl transition-all group flex items-center justify-between"
                >
                  <span className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-900 dark:group-hover:text-white">{option}</span>
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
