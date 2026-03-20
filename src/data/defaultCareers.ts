import { CareerNode } from '../types';

export const DEFAULT_CAREERS_FLAT = [
  { 
    id: 'root', 
    name: 'Careers', 
    type: 'root', 
    parent_id: null, 
    is_leaf: false,
    description: 'The starting point of your career journey after 10th Standard. Explore various streams and specialized paths.',
    job_roles: 'Student, Learner, Explorer'
  },
  
  // I. Biology
  { 
    id: 'biology', 
    name: 'Biology Stream', 
    type: 'branch', 
    parent_id: 'root', 
    is_leaf: false,
    description: 'Ideal for students interested in life sciences, medicine, and healthcare. This stream opens paths to becoming a doctor, nurse, or researcher.',
    job_roles: 'Medical Professional, Researcher, Healthcare Specialist'
  },
  
  // 1. Medical courses (5 years)
  { 
    id: 'medical-courses', 
    name: 'Medical Courses (5 Years)', 
    type: 'branch', 
    parent_id: 'biology', 
    is_leaf: false,
    description: 'Professional degree courses in various systems of medicine. These are typically 5 to 5.5 years long including internship.',
    job_roles: 'Doctor, Surgeon, Medical Consultant'
  },
  { 
    id: 'mbbs', 
    name: 'MBBS - Allopathy', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5.5 years', 
    is_leaf: true,
    description: 'Bachelor of Medicine and Bachelor of Surgery. The most sought-after medical degree in India for practicing modern medicine.',
    job_roles: 'General Physician, Surgeon, Medical Officer, Specialist Doctor'
  },
  { 
    id: 'bums', 
    name: 'BUMS - Unani', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5.5 years', 
    is_leaf: true,
    description: 'Bachelor of Unani Medicine and Surgery. Focuses on the Unani system of medicine based on the teachings of Greek physicians.',
    job_roles: 'Unani Doctor, Hakim, Medical Officer'
  },
  { 
    id: 'bhms', 
    name: 'BHMS - Homeopathy', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5.5 years', 
    is_leaf: true,
    description: 'Bachelor of Homeopathic Medicine and Surgery. A holistic system of medicine based on the principle of "like cures like".',
    job_roles: 'Homeopathic Doctor, Consultant, Medical Officer'
  },
  { 
    id: 'bams', 
    name: 'BAMS - Ayurveda', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5.5 years', 
    is_leaf: true,
    description: 'Bachelor of Ayurvedic Medicine and Surgery. An ancient Indian system of medicine focusing on balance in bodily systems.',
    job_roles: 'Ayurvedic Doctor, Vaidya, Medical Officer'
  },
  { 
    id: 'bsms', 
    name: 'BSMS - Siddha', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5.5 years', 
    is_leaf: true,
    description: 'Bachelor of Siddha Medicine and Surgery. One of the oldest systems of medicine, originating in South India.',
    job_roles: 'Siddha Practitioner, Medical Officer'
  },
  { 
    id: 'bnys', 
    name: 'BNYS - Naturopathy', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5.5 years', 
    is_leaf: true,
    description: 'Bachelor of Naturopathy and Yogic Sciences. Focuses on natural healing and yoga for health and wellness.',
    job_roles: 'Naturopath, Yoga Therapist, Wellness Consultant'
  },
  { 
    id: 'bds', 
    name: 'BDS - Dental', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5 years', 
    is_leaf: true,
    description: 'Bachelor of Dental Surgery. Focuses on oral health, diagnosis, and treatment of dental issues.',
    job_roles: 'Dentist, Orthodontist, Oral Surgeon'
  },
  { 
    id: 'bvsc', 
    name: 'BVSc - Veterinary', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '5 years', 
    is_leaf: true,
    description: 'Bachelor of Veterinary Science. Focuses on the health and well-being of animals and livestock.',
    job_roles: 'Veterinarian, Animal Surgeon, Veterinary Consultant'
  },
  { 
    id: 'bpt', 
    name: 'BPT - Physiotherapy', 
    type: 'leaf', 
    parent_id: 'medical-courses', 
    duration: '4.5 years', 
    is_leaf: true,
    description: 'Bachelor of Physiotherapy. Focuses on physical movement and rehabilitation through exercise and manual therapy.',
    job_roles: 'Physiotherapist, Sports Therapist, Rehabilitation Specialist'
  },

  // 2. Allied Health Paramedical (2/3/4 years)
  { 
    id: 'allied-health', 
    name: 'Allied Health Paramedical', 
    type: 'branch', 
    parent_id: 'biology', 
    is_leaf: false,
    description: 'Supportive healthcare roles that assist in diagnosis and treatment using specialized technology and techniques.',
    job_roles: 'Medical Technician, Lab Specialist, Healthcare Assistant'
  },
  { 
    id: 'b-pharma', 
    name: 'B. Pharma', 
    type: 'leaf', 
    parent_id: 'allied-health', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Bachelor of Pharmacy. Focuses on pharmaceutical sciences, drug manufacturing, and dispensing.',
    job_roles: 'Pharmacist, Drug Inspector, Pharmaceutical Researcher'
  },
  { 
    id: 'bsc-nursing', 
    name: 'B.Sc - Nursing', 
    type: 'leaf', 
    parent_id: 'allied-health', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Bachelor of Science in Nursing. Focuses on patient care, clinical practice, and healthcare management.',
    job_roles: 'Registered Nurse, Nurse Educator, Clinical Specialist'
  },

  // II. Maths
  { 
    id: 'maths', 
    name: 'Maths Stream', 
    type: 'branch', 
    parent_id: 'root', 
    is_leaf: false,
    description: 'For students with strong analytical and problem-solving skills. Opens doors to engineering, architecture, and pure sciences.',
    job_roles: 'Engineer, Architect, Data Scientist, Researcher'
  },
  { 
    id: 'b-arch', 
    name: 'B. Architecture', 
    type: 'leaf', 
    parent_id: 'maths', 
    duration: '5 years', 
    is_leaf: true,
    description: 'Bachelor of Architecture. Focuses on design, planning, and construction of buildings and structures.',
    job_roles: 'Architect, Urban Planner, Interior Designer'
  },
  
  // Engineering
  { 
    id: 'engineering', 
    name: 'Engineering (B.Tech/BE)', 
    type: 'branch', 
    parent_id: 'maths', 
    is_leaf: false,
    description: 'Technical degree focusing on the application of scientific and mathematical principles to solve real-world problems.',
    job_roles: 'Software Engineer, Civil Engineer, Mechanical Engineer'
  },
  { 
    id: 'cse', 
    name: 'Computer Science Engineering', 
    type: 'leaf', 
    parent_id: 'engineering', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Focuses on computer systems, software development, algorithms, and artificial intelligence.',
    job_roles: 'Software Developer, Systems Architect, AI Engineer, Data Scientist'
  },
  { 
    id: 'mech-eng', 
    name: 'Mechanical Engineering', 
    type: 'leaf', 
    parent_id: 'engineering', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Focuses on the design, analysis, and manufacturing of mechanical systems.',
    job_roles: 'Mechanical Engineer, Design Engineer, Production Manager'
  },
  { 
    id: 'civil-eng', 
    name: 'Civil Engineering', 
    type: 'leaf', 
    parent_id: 'engineering', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Focuses on the design and construction of infrastructure like buildings, roads, and bridges.',
    job_roles: 'Civil Engineer, Site Engineer, Structural Designer'
  },
  { 
    id: 'elec-eng', 
    name: 'Electrical Engineering', 
    type: 'leaf', 
    parent_id: 'engineering', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Focuses on electrical systems, power generation, and distribution.',
    job_roles: 'Electrical Engineer, Power Systems Engineer'
  },
  { 
    id: 'ece-eng', 
    name: 'Electronics & Comm Engineering', 
    type: 'leaf', 
    parent_id: 'engineering', 
    duration: '4 years', 
    is_leaf: true,
    description: 'Focuses on electronic circuits, communication systems, and signal processing.',
    job_roles: 'Electronics Engineer, Network Engineer'
  },

  // III. Humanities Courses (3 Years)
  { 
    id: 'humanities', 
    name: 'Humanities Stream', 
    type: 'branch', 
    parent_id: 'root', 
    is_leaf: false,
    description: 'Focuses on human society, culture, and creative expression. Ideal for those interested in social sciences, arts, and communication.',
    job_roles: 'Social Worker, Journalist, Psychologist, Educator'
  },
  { 
    id: 'psychology', 
    name: 'Psychology', 
    type: 'leaf', 
    parent_id: 'humanities', 
    duration: '3 years', 
    is_leaf: true,
    description: 'The scientific study of the human mind and behavior. Opens paths to counseling, clinical practice, and human resources.',
    job_roles: 'Counselor, Clinical Psychologist, HR Specialist'
  },
  { 
    id: 'economics', 
    name: 'Economics', 
    type: 'leaf', 
    parent_id: 'humanities', 
    duration: '3 years', 
    is_leaf: true,
    description: 'Study of production, distribution, and consumption of goods and services. Highly analytical and versatile.',
    job_roles: 'Economist, Data Analyst, Financial Consultant'
  },
  { 
    id: 'journalism', 
    name: 'Journalism & Mass Comm', 
    type: 'leaf', 
    parent_id: 'humanities', 
    duration: '3 years', 
    is_leaf: true,
    description: 'Focuses on news reporting, media production, and public communication.',
    job_roles: 'Journalist, News Anchor, PR Specialist, Content Creator'
  },
  { 
    id: 'ba-llb', 
    name: 'Integrated Law (BA LLB)', 
    type: 'leaf', 
    parent_id: 'humanities', 
    duration: '5 years', 
    is_leaf: true,
    description: 'A 5-year integrated law degree combining humanities subjects with legal studies.',
    job_roles: 'Lawyer, Legal Consultant, Corporate Counsel'
  },

  // Pure Sciences
  {
    id: 'pure-sciences',
    name: 'Pure Sciences (B.Sc)',
    type: 'branch',
    parent_id: 'root',
    is_leaf: false,
    description: 'Focuses on fundamental scientific research and theoretical knowledge in Physics, Chemistry, and Maths.',
    job_roles: 'Researcher, Scientist, Professor'
  },
  {
    id: 'bsc-physics',
    name: 'B.Sc Physics',
    type: 'leaf',
    parent_id: 'pure-sciences',
    duration: '3 years',
    is_leaf: true,
    description: 'Study of matter, energy, and the fundamental laws of the universe.',
    job_roles: 'Physicist, Research Assistant, Lab Technician'
  },
  {
    id: 'bsc-maths',
    name: 'B.Sc Mathematics',
    type: 'leaf',
    parent_id: 'pure-sciences',
    duration: '3 years',
    is_leaf: true,
    description: 'Advanced study of mathematical theories, logic, and computation.',
    job_roles: 'Mathematician, Statistician, Actuary'
  },

  // IV. Management Courses (1/2/3 years)
  { 
    id: 'management', 
    name: 'Management Stream', 
    type: 'branch', 
    parent_id: 'root', 
    is_leaf: false,
    description: 'Focuses on business operations, leadership, and organizational management. Ideal for future business leaders and entrepreneurs.',
    job_roles: 'Business Manager, Entrepreneur, Management Consultant'
  },
  { 
    id: 'bba', 
    name: 'BBA - Bachelors in Business Administration', 
    type: 'leaf', 
    parent_id: 'management', 
    duration: '3 years', 
    is_leaf: true,
    description: 'Foundational business degree covering marketing, finance, and human resources. Provides a broad understanding of how businesses operate.',
    job_roles: 'Business Analyst, Marketing Executive, Operations Manager'
  },
  { 
    id: 'bms', 
    name: 'BMS - Bachelor of Management Studies', 
    type: 'leaf', 
    parent_id: 'management', 
    duration: '3 years', 
    is_leaf: true,
    description: 'Focuses on management skills and business knowledge. Similar to BBA but often with a more theoretical approach.',
    job_roles: 'Management Trainee, Project Coordinator, HR Assistant'
  },

  // V. Commerce Courses (3 years)
  { 
    id: 'commerce', 
    name: 'Commerce Stream', 
    type: 'branch', 
    parent_id: 'root', 
    is_leaf: false,
    description: 'Focuses on trade, finance, accounting, and business laws. A versatile stream with many professional opportunities.',
    job_roles: 'Accountant, Financial Analyst, Tax Consultant'
  },
  { 
    id: 'bcom-regular', 
    name: 'B.Com (Regular)', 
    type: 'leaf', 
    parent_id: 'commerce', 
    duration: '3 years', 
    is_leaf: true,
    description: 'Traditional degree in commerce covering accounting, economics, and business law.',
    job_roles: 'Accountant, Bank Officer, Office Administrator'
  },
  { 
    id: 'bcom-honours', 
    name: 'B.Com (Honours)', 
    type: 'leaf', 
    parent_id: 'commerce', 
    duration: '3 years', 
    is_leaf: true,
    description: 'A more specialized and rigorous version of the B.Com degree, focusing on advanced accounting and finance.',
    job_roles: 'Financial Analyst, Auditor, Investment Banker'
  },
  { 
    id: 'ca-root', 
    name: 'Chartered Accountancy (CA)', 
    type: 'leaf', 
    parent_id: 'commerce', 
    duration: '4-5 years', 
    is_leaf: true,
    description: 'Professional course in accounting, auditing, and taxation. Highly prestigious and globally recognized.',
    job_roles: 'Chartered Accountant, Auditor, Tax Specialist'
  },
  { 
    id: 'cs-root', 
    name: 'Company Secretary (CS)', 
    type: 'leaf', 
    parent_id: 'commerce', 
    duration: '3-4 years', 
    is_leaf: true,
    description: 'Focuses on corporate law, governance, and compliance. Essential for large corporations.',
    job_roles: 'Company Secretary, Legal Advisor, Compliance Officer'
  },
  { 
    id: 'cma-root', 
    name: 'Cost & Management Accountancy', 
    type: 'leaf', 
    parent_id: 'commerce', 
    duration: '3-4 years', 
    is_leaf: true,
    description: 'Focuses on cost management, auditing, and financial planning.',
    job_roles: 'Cost Accountant, Financial Controller'
  },
  { 
    id: 'banking', 
    name: 'Banking & Insurance', 
    type: 'leaf', 
    parent_id: 'commerce', 
    duration: '3 years', 
    is_leaf: true,
    description: 'Focuses on financial services, banking operations, and risk management.',
    job_roles: 'Bank Manager, Insurance Underwriter'
  },
  
  // VI. Creative & Professional
  {
    id: 'creative-arts',
    name: 'Creative & Design',
    type: 'branch',
    parent_id: 'root',
    is_leaf: false,
    description: 'For students with a passion for art, design, and creative expression.',
    job_roles: 'Designer, Artist, Creative Director'
  },
  {
    id: 'b-design',
    name: 'B. Design (B.Des)',
    type: 'leaf',
    parent_id: 'creative-arts',
    duration: '4 years',
    is_leaf: true,
    description: 'Professional degree in various design fields like fashion, interior, product, or graphic design.',
    job_roles: 'Fashion Designer, UX Designer, Product Designer'
  },
  {
    id: 'fine-arts',
    name: 'Bachelor of Fine Arts (BFA)',
    type: 'leaf',
    parent_id: 'creative-arts',
    duration: '4 years',
    is_leaf: true,
    description: 'Focuses on visual arts like painting, sculpture, and photography.',
    job_roles: 'Visual Artist, Photographer, Art Teacher'
  },

  // VII. Hospitality & Services
  {
    id: 'hospitality',
    name: 'Hospitality & Travel',
    type: 'branch',
    parent_id: 'root',
    is_leaf: false,
    description: 'Focuses on the service industry, including hotels, tourism, and event management.',
    job_roles: 'Hotel Manager, Travel Consultant, Event Planner'
  },
  {
    id: 'hotel-mgmt',
    name: 'Hotel Management (BHM)',
    type: 'leaf',
    parent_id: 'hospitality',
    duration: '3-4 years',
    is_leaf: true,
    description: 'Professional degree in hospitality and hotel administration.',
    job_roles: 'Hotel Manager, Front Office Executive, F&B Manager'
  },
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism',
    type: 'leaf',
    parent_id: 'hospitality',
    duration: '3 years',
    is_leaf: true,
    description: 'Focuses on the tourism industry, travel planning, and destination management.',
    job_roles: 'Travel Agent, Tour Guide, Tourism Officer'
  },

  // VIII. Computer Applications
  {
    id: 'it-software',
    name: 'IT & Software',
    type: 'branch',
    parent_id: 'root',
    is_leaf: false,
    description: 'Focuses on computer applications, software development, and information technology.',
    job_roles: 'Software Developer, Web Designer, IT Consultant'
  },
  {
    id: 'bca',
    name: 'BCA - Computer Applications',
    type: 'leaf',
    parent_id: 'it-software',
    duration: '3 years',
    is_leaf: true,
    description: 'Bachelor of Computer Applications. Focuses on software development and computer fundamentals.',
    job_roles: 'Web Developer, Software Tester, System Admin'
  },

  // IX. Agriculture & Environment
  {
    id: 'agri-science',
    name: 'Agriculture Science',
    type: 'branch',
    parent_id: 'root',
    is_leaf: false,
    description: 'Focuses on farming, crop production, and agricultural technology.',
    job_roles: 'Agricultural Scientist, Farm Manager, Agronomist'
  },
  {
    id: 'bsc-agri',
    name: 'B.Sc Agriculture',
    type: 'leaf',
    parent_id: 'agri-science',
    duration: '4 years',
    is_leaf: true,
    description: 'Scientific study of agriculture and related fields.',
    job_roles: 'Agriculture Officer, Research Assistant'
  },

  // X. Media & Communication
  {
    id: 'media-comm',
    name: 'Media & Advertising',
    type: 'branch',
    parent_id: 'root',
    is_leaf: false,
    description: 'Focuses on mass communication, advertising, and public relations.',
    job_roles: 'Copywriter, Media Planner, PR Executive'
  },
  {
    id: 'advertising',
    name: 'Advertising & PR',
    type: 'leaf',
    parent_id: 'media-comm',
    duration: '3 years',
    is_leaf: true,
    description: 'Focuses on brand communication and public relations.',
    job_roles: 'Ad Executive, PR Consultant'
  }
];

export const DEFAULT_UNIVERSITIES: Record<string, any[]> = {
  'mbbs': [
    { name: 'AIIMS Delhi', location: 'New Delhi, India', fees: '₹5,856/year', duration: '5.5 years', ranking: 'Govt - NIRF #1', specialization: 'Medicine', website: 'https://www.aiims.edu' },
    { name: 'Maulana Azad Medical College', location: 'New Delhi, India', fees: '₹15,000/year', duration: '5.5 years', ranking: 'Govt - Top Tier', specialization: 'Medicine', website: 'https://www.mamc.ac.in' },
    { name: 'CMC Vellore', location: 'Vellore, India', fees: '₹50,000/year', duration: '5.5 years', ranking: 'Private - NIRF #3', specialization: 'Medicine', website: 'https://www.cmcvellore.ac.in' },
    { name: 'Kasturba Medical College', location: 'Manipal, India', fees: '₹17.8 Lakhs/year', duration: '5.5 years', ranking: 'Private - Top Tier', specialization: 'Medicine', website: 'https://manipal.edu' },
    { name: 'Harvard Medical School', location: 'Boston, USA', fees: '$65,000/year', duration: '4 years (MD)', ranking: 'Global #1', specialization: 'Medicine', website: 'https://hms.harvard.edu' },
    { name: 'University of Oxford', location: 'Oxford, UK', fees: '£40,000/year', duration: '6 years', ranking: 'Global #2', specialization: 'Medicine', website: 'https://www.ox.ac.uk' }
  ],
  'cse': [
    { name: 'IIT Bombay', location: 'Mumbai, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #1', specialization: 'Computer Science', website: 'https://www.iitb.ac.in' },
    { name: 'IIT Delhi', location: 'New Delhi, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #2', specialization: 'Computer Science', website: 'https://www.iitd.ac.in' },
    { name: 'BITS Pilani', location: 'Pilani, India', fees: '₹5,00,000/year', duration: '4 years', ranking: 'Private - Top Tier', specialization: 'Engineering', website: 'https://www.bits-pilani.ac.in' },
    { name: 'VIT Vellore', location: 'Vellore, India', fees: '₹1,98,000/year', duration: '4 years', ranking: 'Private - NIRF #11', specialization: 'Engineering', website: 'https://vit.ac.in' },
    { name: 'MIT', location: 'Cambridge, USA', fees: '$58,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Computer Science', website: 'https://www.mit.edu' },
    { name: 'Stanford University', location: 'Stanford, USA', fees: '$60,000/year', duration: '4 years', ranking: 'Global #2', specialization: 'Computer Science', website: 'https://www.stanford.edu' }
  ],
  'bcom-regular': [
    { name: 'SRCC', location: 'New Delhi, India', fees: '₹30,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Commerce', website: 'https://www.srcc.edu' },
    { name: 'Hindu College', location: 'New Delhi, India', fees: '₹20,000/year', duration: '3 years', ranking: 'Govt - NIRF #2', specialization: 'Commerce', website: 'https://hinducollege.ac.in' },
    { name: 'Christ University', location: 'Bangalore, India', fees: '₹85,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Commerce', website: 'https://christuniversity.in' },
    { name: 'Symbiosis College of Arts & Commerce', location: 'Pune, India', fees: '₹40,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Commerce', website: 'https://symbiosiscollege.edu.in' },
    { name: 'London School of Economics', location: 'London, UK', fees: '£25,000/year', duration: '3 years', ranking: 'Global #1', specialization: 'Finance/Economics', website: 'https://www.lse.ac.uk' }
  ],
  'bba': [
    { name: 'IIM Indore (IPM)', location: 'Indore, India', fees: '₹5,00,000/year', duration: '5 years (Integrated)', ranking: 'Govt - Top Tier', specialization: 'Management', website: 'https://www.iimidr.ac.in' },
    { name: 'Shaheed Sukhdev College of Business Studies', location: 'Delhi, India', fees: '₹25,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Management', website: 'https://sscbs.du.ac.in' },
    { name: 'NMIMS', location: 'Mumbai, India', fees: '₹3,00,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Management', website: 'https://www.nmims.edu' },
    { name: 'Wharton School (UPenn)', location: 'Philadelphia, USA', fees: '$62,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Business', website: 'https://www.wharton.upenn.edu' },
    { name: 'INSEAD', location: 'Fontainebleau, France', fees: '€90,000 (Total)', duration: '1 year (MBA)', ranking: 'Global #1', specialization: 'Management', website: 'https://www.insead.edu' },
    { name: 'HEC Paris', location: 'Jouy-en-Josas, France', fees: '€40,000/year', duration: '3 years (MiM)', ranking: 'Global #1', specialization: 'Business', website: 'https://www.hec.edu' }
  ],
  'ba-llb': [
    { name: 'NLSIU Bangalore', location: 'Bangalore, India', fees: '₹2,50,000/year', duration: '5 years', ranking: 'Govt - NIRF #1', specialization: 'Law', website: 'https://www.nls.ac.in' },
    { name: 'NALSAR', location: 'Hyderabad, India', fees: '₹2,40,000/year', duration: '5 years', ranking: 'Govt - NIRF #2', specialization: 'Law', website: 'https://www.nalsar.ac.in' },
    { name: 'Jindal Global Law School', location: 'Sonipat, India', fees: '₹6,00,000/year', duration: '5 years', ranking: 'Private - Top Tier', specialization: 'Law', website: 'https://jgu.edu.in' },
    { name: 'Yale Law School', location: 'New Haven, USA', fees: '$70,000/year', duration: '3 years (JD)', ranking: 'Global #1', specialization: 'Law', website: 'https://law.yale.edu' },
    { name: 'University of Sydney', location: 'Sydney, Australia', fees: 'A$45,000/year', duration: '5 years', ranking: 'Global Top 20', specialization: 'Law', website: 'https://www.sydney.edu.au' }
  ],
  'b-design': [
    { name: 'NID Ahmedabad', location: 'Ahmedabad, India', fees: '₹3,50,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Design', website: 'https://www.nid.edu' },
    { name: 'IIT Bombay (IDC)', location: 'Mumbai, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Design', website: 'http://www.idc.iitb.ac.in' },
    { name: 'Parsons School of Design', location: 'New York, USA', fees: '$55,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Design', website: 'https://www.newschool.edu/parsons' },
    { name: 'Royal College of Art', location: 'London, UK', fees: '£30,000/year', duration: '2 years (MA)', ranking: 'Global #1', specialization: 'Design', website: 'https://www.rca.ac.uk' }
  ],
  'ca-root': [
    { name: 'ICAI', location: 'Pan India', fees: '₹25,000 (Total)', duration: '4-5 years', ranking: 'Professional Body', specialization: 'Accounting', website: 'https://www.icai.org' },
    { name: 'ACCA', location: 'Global', fees: '£1,500 (Total)', duration: '3-4 years', ranking: 'Global Body', specialization: 'Accounting', website: 'https://www.accaglobal.com' }
  ],
  'economics': [
    { name: 'St. Stephens College', location: 'Delhi, India', fees: '₹40,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Economics', website: 'https://www.ststephens.edu' },
    { name: 'Delhi School of Economics', location: 'Delhi, India', fees: '₹10,000/year', duration: '2 years (MA)', ranking: 'Govt - Top Tier', specialization: 'Economics', website: 'http://econdse.org' },
    { name: 'University of Chicago', location: 'Chicago, USA', fees: '$60,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Economics', website: 'https://economics.uchicago.edu' }
  ],
  'psychology': [
    { name: 'TISS', location: 'Mumbai, India', fees: '₹60,000/year', duration: '2 years (MA)', ranking: 'Govt - Top Tier', specialization: 'Psychology', website: 'https://www.tiss.edu' },
    { name: 'LSR', location: 'Delhi, India', fees: '₹25,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Psychology', website: 'https://lsr.edu.in' },
    { name: 'Stanford University', location: 'Stanford, USA', fees: '$60,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Psychology', website: 'https://psychology.stanford.edu' }
  ],
  'b-arch': [
    { name: 'IIT Roorkee', location: 'Roorkee, India', fees: '₹2,00,000/year', duration: '5 years', ranking: 'Govt - NIRF #1', specialization: 'Architecture', website: 'https://www.iitr.ac.in' },
    { name: 'SPA Delhi', location: 'New Delhi, India', fees: '₹50,000/year', duration: '5 years', ranking: 'Govt - NIRF #2', specialization: 'Architecture', website: 'http://spa.ac.in' },
    { name: 'CEPT University', location: 'Ahmedabad, India', fees: '₹3,20,000/year', duration: '5 years', ranking: 'Private - Top Tier', specialization: 'Architecture', website: 'https://cept.ac.in' },
    { name: 'Architectural Association (AA)', location: 'London, UK', fees: '£22,000/year', duration: '5 years', ranking: 'Global #1', specialization: 'Architecture', website: 'https://www.aaschool.ac.uk' }
  ],
  'b-pharma': [
    { name: 'NIPER Mohali', location: 'Mohali, India', fees: '₹80,000/year', duration: '2 years (M.Pharm)', ranking: 'Govt - NIRF #1', specialization: 'Pharmacy', website: 'https://www.niper.gov.in' },
    { name: 'Jamia Hamdard', location: 'New Delhi, India', fees: '₹1,50,000/year', duration: '4 years', ranking: 'Govt - NIRF #2', specialization: 'Pharmacy', website: 'http://www.jamiahamdard.ac.in' },
    { name: 'ICT Mumbai', location: 'Mumbai, India', fees: '₹85,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Pharmacy', website: 'https://www.ictmumbai.edu.in' }
  ],
  'bsc-nursing': [
    { name: 'AIIMS Delhi', location: 'New Delhi, India', fees: '₹1,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Nursing', website: 'https://www.aiims.edu' },
    { name: 'RAK College of Nursing', location: 'Delhi, India', fees: '₹15,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Nursing', website: 'http://rakcon.com' }
  ],
  'fine-arts': [
    { name: 'Faculty of Fine Arts, MSU', location: 'Baroda, India', fees: '₹10,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Fine Arts', website: 'https://www.msubaroda.ac.in' },
    { name: 'College of Art', location: 'Delhi, India', fees: '₹15,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Fine Arts', website: 'http://colart.delhigovt.nic.in' }
  ],
  'hotel-mgmt': [
    { name: 'IHM Pusa', location: 'New Delhi, India', fees: '₹1,20,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Hotel Management', website: 'http://ihmpusa.net' },
    { name: 'Welcomgroup Graduate School (WGSHA)', location: 'Manipal, India', fees: '₹3,50,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Hotel Management', website: 'https://manipal.edu/wgsha.html' },
    { name: 'EHL Hospitality Business School', location: 'Lausanne, Switzerland', fees: 'CHF 35,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Hospitality', website: 'https://www.ehl.edu' }
  ],
  'journalism': [
    { name: 'IIMC Delhi', location: 'New Delhi, India', fees: '₹95,000/year', duration: '1 year (PGD)', ranking: 'Govt - Top Tier', specialization: 'Journalism', website: 'http://iimc.nic.in' },
    { name: 'AJK MCRC, Jamia', location: 'New Delhi, India', fees: '₹80,000/year', duration: '2 years (MA)', ranking: 'Govt - Top Tier', specialization: 'Mass Comm', website: 'https://www.jmi.ac.in' },
    { name: 'Asian College of Journalism (ACJ)', location: 'Chennai, India', fees: '₹4,60,000/year', duration: '1 year', ranking: 'Private - Top Tier', specialization: 'Journalism', website: 'https://www.asianmedia.org' },
    { name: 'Columbia Journalism School', location: 'New York, USA', fees: '$70,000/year', duration: '1 year (MS)', ranking: 'Global #1', specialization: 'Journalism', website: 'https://journalism.columbia.edu' }
  ],
  'mech-eng': [
    { name: 'IIT Madras', location: 'Chennai, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #1', specialization: 'Mechanical', website: 'https://www.iitm.ac.in' },
    { name: 'IIT Kanpur', location: 'Kanpur, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #4', specialization: 'Mechanical', website: 'https://www.iitk.ac.in' },
    { name: 'ETH Zurich', location: 'Zurich, Switzerland', fees: 'CHF 1,500/year', duration: '3 years', ranking: 'Global #1', specialization: 'Mechanical', website: 'https://ethz.ch' }
  ],
  'civil-eng': [
    { name: 'IIT Roorkee', location: 'Roorkee, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #1', specialization: 'Civil', website: 'https://www.iitr.ac.in' },
    { name: 'IIT Delhi', location: 'New Delhi, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #2', specialization: 'Civil', website: 'https://www.iitd.ac.in' },
    { name: 'Delft University of Technology', location: 'Delft, Netherlands', fees: '€15,000/year', duration: '3 years', ranking: 'Global #2', specialization: 'Civil', website: 'https://www.tudelft.nl' }
  ],
  'bsc-agri': [
    { name: 'IARI Delhi', location: 'New Delhi, India', fees: '₹10,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Agriculture', website: 'https://www.iari.res.in' },
    { name: 'GBPUAT Pantnagar', location: 'Pantnagar, India', fees: '₹40,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Agriculture', website: 'https://www.gbpuat.ac.in' },
    { name: 'Cornell CALS', location: 'Ithaca, USA', fees: '$40,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Agriculture', website: 'https://cals.cornell.edu' }
  ],
  'bca': [
    { name: 'Christ University', location: 'Bangalore, India', fees: '₹1,20,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Computer Applications', website: 'https://christuniversity.in' },
    { name: 'Symbiosis Institute of Computer Studies', location: 'Pune, India', fees: '₹1,50,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Computer Applications', website: 'https://www.sicsr.ac.in' },
    { name: 'Loyola College', location: 'Chennai, India', fees: '₹50,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Computer Applications', website: 'https://www.loyolacollege.edu' }
  ],
  'advertising': [
    { name: 'MICA Ahmedabad', location: 'Ahmedabad, India', fees: '₹21 Lakhs (Total)', duration: '2 years (PGDM)', ranking: 'Private - Top Tier', specialization: 'Advertising/Marketing', website: 'https://www.mica.ac.in' },
    { name: 'XIC Mumbai', location: 'Mumbai, India', fees: '₹2,50,000/year', duration: '1 year', ranking: 'Private - Top Tier', specialization: 'Advertising', website: 'https://www.xaviercomm.org' }
  ]
};

export const buildTree = (flatData: any[]): CareerNode | null => {
  if (!flatData || flatData.length === 0) return null;
  
  const map: Record<string, any> = {};
  flatData.forEach((item: any) => {
    map[item.id] = { ...item, children: [] };
  });
  
  let root: CareerNode | null = null;
  flatData.forEach((item: any) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else if (item.type === 'root') {
      root = map[item.id];
    }
  });
  
  return root;
};
