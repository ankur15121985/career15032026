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
  {
    id: 'science',
    name: 'Science',
    type: 'root',
    parent_id: null,
    duration: null,
    job_roles: null,
    is_leaf: false
  },
  {
    id: 'engineering',
    name: 'Engineering',
    type: 'branch',
    parent_id: 'science',
    duration: '4 Years',
    job_roles: null,
    is_leaf: false
  },
  {
    id: 'cse',
    name: 'Computer Science',
    type: 'leaf',
    parent_id: 'engineering',
    duration: '4 Years',
    job_roles: 'Software Engineer, Data Scientist, AI Researcher',
    is_leaf: true
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    type: 'leaf',
    parent_id: 'engineering',
    duration: '4 Years',
    job_roles: 'Embedded Systems Engineer, Network Engineer',
    is_leaf: true
  },
  {
    id: 'medicine',
    name: 'Medicine',
    type: 'branch',
    parent_id: 'science',
    duration: '5.5 Years',
    job_roles: null,
    is_leaf: false
  },
  {
    id: 'mbbs',
    name: 'MBBS',
    type: 'leaf',
    parent_id: 'medicine',
    duration: '5.5 Years',
    job_roles: 'Doctor, Surgeon, Physician',
    is_leaf: true
  },
  {
    id: 'commerce',
    name: 'Commerce',
    type: 'root',
    parent_id: null,
    duration: null,
    job_roles: null,
    is_leaf: false
  },
  {
    id: 'finance',
    name: 'Finance',
    type: 'branch',
    parent_id: 'commerce',
    duration: '3 Years',
    job_roles: null,
    is_leaf: false
  },
  {
    id: 'ca',
    name: 'Chartered Accountancy',
    type: 'leaf',
    parent_id: 'finance',
    duration: '5 Years',
    job_roles: 'Auditor, Tax Consultant, Financial Analyst',
    is_leaf: true
  }
];
