export interface Career {
  id: string;
  name: string;
  type: 'root' | 'branch' | 'leaf';
  parent_id: string | null;
  duration: string | null;
  job_roles: string | null;
  is_leaf: boolean;
}

export const CAREERS: Career[] = [
  { id: 'root', name: 'Career', type: 'root', parent_id: null, duration: null, job_roles: null, is_leaf: false },
  
  // 1. Biology
  { id: 'biology', name: 'Biology', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'mbbs', name: 'MBBS', type: 'leaf', parent_id: 'biology', duration: '5.5 years', job_roles: 'Doctor, Surgeon', is_leaf: true },
  { id: 'bds', name: 'BDS', type: 'leaf', parent_id: 'biology', duration: '5 years', job_roles: 'Dentist', is_leaf: true },
  { id: 'bams', name: 'BAMS', type: 'leaf', parent_id: 'biology', duration: '5.5 years', job_roles: 'Ayurvedic Doctor', is_leaf: true },
  { id: 'bhms', name: 'BHMS', type: 'leaf', parent_id: 'biology', duration: '5.5 years', job_roles: 'Homeopathic Doctor', is_leaf: true },
  { id: 'bsc-nursing', name: 'B.Sc Nursing', type: 'leaf', parent_id: 'biology', duration: '4 years', job_roles: 'Nurse', is_leaf: true },
  { id: 'b-pharma', name: 'B. Pharma', type: 'leaf', parent_id: 'biology', duration: '4 years', job_roles: 'Pharmacist', is_leaf: true },
  { id: 'biotech', name: 'Biotechnology', type: 'leaf', parent_id: 'biology', duration: '3-4 years', job_roles: 'Biotechnologist', is_leaf: true },

  // 2. Maths
  { id: 'maths', name: 'Maths', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'engineering', name: 'Engineering (B.Tech)', type: 'branch', parent_id: 'maths', duration: '4 years', job_roles: null, is_leaf: false },
  { id: 'cse', name: 'Computer Science', type: 'leaf', parent_id: 'engineering', duration: '4 years', job_roles: 'Software Engineer', is_leaf: true },
  { id: 'mechanical', name: 'Mechanical', type: 'leaf', parent_id: 'engineering', duration: '4 years', job_roles: 'Mechanical Engineer', is_leaf: true },
  { id: 'civil', name: 'Civil', type: 'leaf', parent_id: 'engineering', duration: '4 years', job_roles: 'Civil Engineer', is_leaf: true },
  { id: 'ece', name: 'Electronics', type: 'leaf', parent_id: 'engineering', duration: '4 years', job_roles: 'Electronics Engineer', is_leaf: true },
  { id: 'b-arch', name: 'Architecture (B.Arch)', type: 'leaf', parent_id: 'maths', duration: '5 years', job_roles: 'Architect', is_leaf: true },
  { id: 'bsc-maths', name: 'B.Sc Mathematics', type: 'leaf', parent_id: 'maths', duration: '3 years', job_roles: 'Mathematician', is_leaf: true },
  { id: 'data-science', name: 'Data Science', type: 'leaf', parent_id: 'maths', duration: '3-4 years', job_roles: 'Data Scientist', is_leaf: true },

  // 3. Humanities
  { id: 'humanities', name: 'Humanities', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'psychology', name: 'Psychology', type: 'leaf', parent_id: 'humanities', duration: '3 years', job_roles: 'Psychologist', is_leaf: true },
  { id: 'sociology', name: 'Sociology', type: 'leaf', parent_id: 'humanities', duration: '3 years', job_roles: 'Sociologist', is_leaf: true },
  { id: 'history', name: 'History', type: 'leaf', parent_id: 'humanities', duration: '3 years', job_roles: 'Historian', is_leaf: true },
  { id: 'pol-science', name: 'Political Science', type: 'leaf', parent_id: 'humanities', duration: '3 years', job_roles: 'Political Analyst', is_leaf: true },
  { id: 'economics-h', name: 'Economics', type: 'leaf', parent_id: 'humanities', duration: '3 years', job_roles: 'Economist', is_leaf: true },

  // 4. Management
  { id: 'management', name: 'Management', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'bba', name: 'BBA', type: 'leaf', parent_id: 'management', duration: '3 years', job_roles: 'Business Analyst', is_leaf: true },
  { id: 'bms', name: 'BMS', type: 'leaf', parent_id: 'management', duration: '3 years', job_roles: 'Management Trainee', is_leaf: true },
  { id: 'hotel-mgmt', name: 'Hotel Management', type: 'leaf', parent_id: 'management', duration: '3-4 years', job_roles: 'Hotel Manager', is_leaf: true },
  { id: 'event-mgmt', name: 'Event Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', job_roles: 'Event Planner', is_leaf: true },

  // 5. Commerce
  { id: 'commerce', name: 'Commerce', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'bcom', name: 'B.Com', type: 'leaf', parent_id: 'commerce', duration: '3 years', job_roles: 'Accountant', is_leaf: true },
  { id: 'bcom-h', name: 'B.Com (Hons)', type: 'leaf', parent_id: 'commerce', duration: '3 years', job_roles: 'Financial Analyst', is_leaf: true },
  { id: 'cs', name: 'Company Secretary (CS)', type: 'leaf', parent_id: 'commerce', duration: '3 years', job_roles: 'Company Secretary', is_leaf: true },
  { id: 'cma', name: 'CMA', type: 'leaf', parent_id: 'commerce', duration: '3 years', job_roles: 'Cost Accountant', is_leaf: true },

  // 6. UG Courses
  { id: 'ug-courses', name: 'UG Courses', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'ba-prog', name: 'BA Programme', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', job_roles: 'Generalist', is_leaf: true },
  { id: 'bsc-prog', name: 'B.Sc Programme', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', job_roles: 'Science Assistant', is_leaf: true },
  { id: 'bca', name: 'BCA', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', job_roles: 'Web Developer', is_leaf: true },

  // 7. Less Travelled Paths
  { id: 'less-travelled', name: 'Less Travelled Paths', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'wildlife-photo', name: 'Wildlife Photography', type: 'leaf', parent_id: 'less-travelled', duration: '1-2 years', job_roles: 'Photographer', is_leaf: true },
  { id: 'ethical-hacking', name: 'Ethical Hacking', type: 'leaf', parent_id: 'less-travelled', duration: '1 year', job_roles: 'Security Analyst', is_leaf: true },
  { id: 'oceanography', name: 'Oceanography', type: 'leaf', parent_id: 'less-travelled', duration: '3 years', job_roles: 'Oceanographer', is_leaf: true },
  { id: 'astrophysics', name: 'Astrophysics', type: 'leaf', parent_id: 'less-travelled', duration: '3-4 years', job_roles: 'Astrophysicist', is_leaf: true },

  // 8. Law
  { id: 'law', name: 'Law', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'llb-5yr', name: 'Integrated LLB (5 Years)', type: 'leaf', parent_id: 'law', duration: '5 years', job_roles: 'Lawyer, Advocate', is_leaf: true },
  { id: 'llb-3yr', name: 'LLB (3 Years)', type: 'leaf', parent_id: 'law', duration: '3 years', job_roles: 'Legal Advisor', is_leaf: true },

  // 9. CA
  { id: 'ca', name: 'CA', type: 'leaf', parent_id: 'root', duration: '5 years', job_roles: 'Chartered Accountant', is_leaf: true },

  // 10. Vocational
  { id: 'vocational', name: 'Vocational', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'fashion-design', name: 'Fashion Design', type: 'leaf', parent_id: 'vocational', duration: '3 years', job_roles: 'Fashion Designer', is_leaf: true },
  { id: 'interior-design', name: 'Interior Design', type: 'leaf', parent_id: 'vocational', duration: '3 years', job_roles: 'Interior Designer', is_leaf: true },
  { id: 'animation', name: 'Animation & VFX', type: 'leaf', parent_id: 'vocational', duration: '3 years', job_roles: 'Animator', is_leaf: true },

  // 11. Diploma
  { id: 'diploma', name: 'Diploma', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'dip-eng', name: 'Diploma in Engineering', type: 'leaf', parent_id: 'diploma', duration: '3 years', job_roles: 'Junior Engineer', is_leaf: true },
  { id: 'dip-pharm', name: 'Diploma in Pharmacy', type: 'leaf', parent_id: 'diploma', duration: '2 years', job_roles: 'Pharmacist Assistant', is_leaf: true },

  // 12. Defense
  { id: 'defense', name: 'Defense', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'nda', name: 'NDA', type: 'leaf', parent_id: 'defense', duration: '3 years', job_roles: 'Military Officer', is_leaf: true },
  { id: 'cds', name: 'CDS', type: 'leaf', parent_id: 'defense', duration: '1.5 years', job_roles: 'Army Officer', is_leaf: true },
  { id: 'afcat', name: 'AFCAT', type: 'leaf', parent_id: 'defense', duration: '1 year', job_roles: 'Air Force Officer', is_leaf: true },

  // 13. Media & Communication
  { id: 'media-comm', name: 'Media & Communication', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'journalism', name: 'Journalism', type: 'leaf', parent_id: 'media-comm', duration: '3 years', job_roles: 'Journalist', is_leaf: true },
  { id: 'mass-comm', name: 'Mass Communication', type: 'leaf', parent_id: 'media-comm', duration: '3 years', job_roles: 'Media Professional', is_leaf: true },
  { id: 'pr', name: 'Public Relations', type: 'leaf', parent_id: 'media-comm', duration: '3 years', job_roles: 'PR Specialist', is_leaf: true },

  // 14. Sports & Fitness
  { id: 'sports-fitness', name: 'Sports & Fitness', type: 'branch', parent_id: 'root', duration: null, job_roles: null, is_leaf: false },
  { id: 'bped', name: 'B.P.Ed', type: 'leaf', parent_id: 'sports-fitness', duration: '3 years', job_roles: 'Physical Education Teacher', is_leaf: true },
  { id: 'sports-mgmt', name: 'Sports Management', type: 'leaf', parent_id: 'sports-fitness', duration: '3 years', job_roles: 'Sports Manager', is_leaf: true },
  { id: 'fitness-trainer', name: 'Fitness Training', type: 'leaf', parent_id: 'sports-fitness', duration: '1 year', job_roles: 'Fitness Trainer', is_leaf: true },
];
