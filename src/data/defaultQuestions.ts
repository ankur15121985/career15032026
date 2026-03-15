export interface Question {
  id: number;
  text: string;
  type: 'AQ' | 'IQ';
  category: string;
  options: string[];
  correct_answer: string;
}

export const DEFAULT_QUESTIONS: Question[] = [
  // AQ Questions (10)
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
  
  // IQ Questions (10)
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
