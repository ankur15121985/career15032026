export interface Question {
  id: number;
  text: string;
  type: 'AQ' | 'IQ';
  category: string;
  options: string[];
  correct_answer: string;
}

// Helper to generate more questions if needed
const generateNumericalQuestions = (count: number, startId: number): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    const result = op === '+' ? a + b : a - b;
    
    questions.push({
      id: startId + i,
      text: `What is ${a} ${op} ${b}?`,
      type: 'IQ',
      category: 'Numerical',
      options: [
        result.toString(),
        (result + 5).toString(),
        (result - 3).toString(),
        (result * 2).toString()
      ].sort(() => Math.random() - 0.5),
      correct_answer: result.toString()
    });
  }
  return questions;
};

const baseQuestions: Question[] = [
  // AQ Questions
  {
    id: 1,
    text: "How do you prefer to solve problems?",
    type: 'AQ',
    category: "Situational",
    options: ["Logical analysis", "Creative brainstorming", "Practical hands-on approach", "Collaborative discussion"],
    correct_answer: "Logical analysis"
  },
  {
    id: 2,
    text: "Which subject interested you most in school?",
    type: 'AQ',
    category: "Verbal",
    options: ["Mathematics/Science", "Literature/Arts", "Social Studies/History", "Physical Education"],
    correct_answer: "Mathematics/Science"
  },
  {
    id: 3,
    text: "In a professional setting, I value:",
    type: 'AQ',
    category: "Situational",
    options: ["Innovation and change", "Stability and routine", "Helping others", "Leading and managing"],
    correct_answer: "Innovation and change"
  },
  {
    id: 4,
    text: "If a project is delayed, you should:",
    type: 'AQ',
    category: "Situational",
    options: ["Inform the manager and propose a new timeline", "Ignore it", "Blame others", "Work 24/7 without telling anyone"],
    correct_answer: "Inform the manager and propose a new timeline"
  },
  {
    id: 5,
    text: "What is the synonym of 'Abundant'?",
    type: 'AQ',
    category: "Verbal",
    options: ["Plentiful", "Scarce", "Rare", "Small"],
    correct_answer: "Plentiful"
  },
  {
    id: 6,
    text: "In a team conflict, the best approach is:",
    type: 'AQ',
    category: "Situational",
    options: ["Listen to all sides and find a middle ground", "Pick a side", "Avoid the conflict", "Report everyone"],
    correct_answer: "Listen to all sides and find a middle ground"
  },
  {
    id: 7,
    text: "What is the synonym of 'Benevolent'?",
    type: 'AQ',
    category: "Verbal",
    options: ["Kind", "Cruel", "Mean", "Selfish"],
    correct_answer: "Kind"
  },
  {
    id: 8,
    text: "When faced with a difficult task, you:",
    type: 'AQ',
    category: "Situational",
    options: ["Break it down into smaller steps", "Give up", "Ask someone else to do it", "Postpone it indefinitely"],
    correct_answer: "Break it down into smaller steps"
  },
  {
    id: 9,
    text: "What is the synonym of 'Candid'?",
    type: 'AQ',
    category: "Verbal",
    options: ["Honest", "Deceptive", "Shy", "Quiet"],
    correct_answer: "Honest"
  },
  {
    id: 10,
    text: "Effective communication involves:",
    type: 'AQ',
    category: "Situational",
    options: ["Active listening and clarity", "Talking fast", "Using complex words", "Sending long emails"],
    correct_answer: "Active listening and clarity"
  },
  // Adding more AQ questions to reach a good number
  {
    id: 21,
    text: "How do you handle tight deadlines?",
    type: 'AQ',
    category: "Situational",
    options: ["Prioritize tasks and stay focused", "Panic and rush", "Ask for an extension immediately", "Work on the easiest tasks first"],
    correct_answer: "Prioritize tasks and stay focused"
  },
  {
    id: 22,
    text: "What is the antonym of 'Optimistic'?",
    type: 'AQ',
    category: "Verbal",
    options: ["Pessimistic", "Cheerful", "Hopeful", "Positive"],
    correct_answer: "Pessimistic"
  },
  {
    id: 23,
    text: "In a group project, you prefer to:",
    type: 'AQ',
    category: "Situational",
    options: ["Take the lead", "Follow instructions", "Mediate between members", "Handle technical details"],
    correct_answer: "Take the lead"
  },
  {
    id: 24,
    text: "What is the synonym of 'Diligent'?",
    type: 'AQ',
    category: "Verbal",
    options: ["Hardworking", "Lazy", "Careless", "Fast"],
    correct_answer: "Hardworking"
  },
  {
    id: 25,
    text: "When learning a new skill, you prefer:",
    type: 'AQ',
    category: "Situational",
    options: ["Watching a tutorial", "Reading a manual", "Trying it out directly", "Attending a workshop"],
    correct_answer: "Trying it out directly"
  },

  // IQ Questions
  {
    id: 11,
    text: "What is the next number in the sequence: 2, 6, 12, 20, ...?",
    type: 'IQ',
    category: "Numerical",
    options: ["24", "28", "30", "32"],
    correct_answer: "30"
  },
  {
    id: 12,
    text: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
    type: 'IQ',
    category: "Logical",
    options: ["True", "False"],
    correct_answer: "True"
  },
  {
    id: 13,
    text: "What is 15 * 4?",
    type: 'IQ',
    category: "Numerical",
    options: ["50", "60", "70", "80"],
    correct_answer: "60"
  },
  {
    id: 14,
    text: "Complete the sequence: 1, 4, 9, 16, ...",
    type: 'IQ',
    category: "Logical",
    options: ["20", "24", "25", "30"],
    correct_answer: "25"
  },
  {
    id: 15,
    text: "If you rearrange the letters 'CIFAIPC', you get the name of an:",
    type: 'IQ',
    category: "Logical",
    options: ["City", "Animal", "Ocean", "River"],
    correct_answer: "Ocean"
  },
  {
    id: 16,
    text: "What is 125 / 5?",
    type: 'IQ',
    category: "Numerical",
    options: ["20", "25", "30", "35"],
    correct_answer: "25"
  },
  {
    id: 17,
    text: "Which number should come next in the series: 1, 1, 2, 3, 5, 8, 13, ...?",
    type: 'IQ',
    category: "Logical",
    options: ["18", "21", "24", "27"],
    correct_answer: "21"
  },
  {
    id: 18,
    text: "What is 7 * 8?",
    type: 'IQ',
    category: "Numerical",
    options: ["54", "56", "58", "60"],
    correct_answer: "56"
  },
  {
    id: 19,
    text: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
    type: 'IQ',
    category: "Logical",
    options: ["100 minutes", "50 minutes", "5 minutes", "1 minute"],
    correct_answer: "5 minutes"
  },
  {
    id: 20,
    text: "What is 100 - 37?",
    type: 'IQ',
    category: "Numerical",
    options: ["53", "63", "73", "83"],
    correct_answer: "63"
  }
];

// Generate 900 more numerical/logical questions to reach ~1000
const extraQuestions = generateNumericalQuestions(975, 26);

export const QUESTIONS: Question[] = [...baseQuestions, ...extraQuestions];
