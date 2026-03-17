export interface College {
  id: string;
  career_id: string;
  name: string;
  location: string;
  fees: string;
  duration: string;
  ranking: string;
  specialization: string;
  website?: string;
}

export const COLLEGES: College[] = [
  {
    id: '1',
    career_id: 'cse',
    name: 'IIT Bombay',
    location: 'Mumbai, India',
    fees: '₹2,00,000/year',
    duration: '4 Years',
    ranking: '#1 in Engineering',
    specialization: 'Computer Science and Engineering',
    website: 'https://www.iitb.ac.in'
  },
  {
    id: '2',
    career_id: 'cse',
    name: 'Stanford University',
    location: 'California, USA',
    fees: '$50,000/year',
    duration: '4 Years',
    ranking: '#2 Global',
    specialization: 'Computer Science',
    website: 'https://www.stanford.edu'
  },
  {
    id: '3',
    career_id: 'mbbs',
    name: 'AIIMS Delhi',
    location: 'New Delhi, India',
    fees: '₹1,500/year',
    duration: '5.5 Years',
    ranking: '#1 in Medicine',
    specialization: 'Medicine and Surgery',
    website: 'https://www.aiims.edu'
  },
  {
    id: '4',
    career_id: 'ca',
    name: 'ICAI',
    location: 'New Delhi, India',
    fees: '₹50,000 total',
    duration: '5 Years',
    ranking: 'Premier Body',
    specialization: 'Chartered Accountancy',
    website: 'https://www.icai.org'
  },
  {
    id: '5',
    career_id: 'cse',
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA, USA',
    fees: '$45,000/year',
    duration: '4 years',
    ranking: '#3 Global',
    specialization: 'Data Science and Analytics',
    website: 'https://www.berkeley.edu'
  }
];
