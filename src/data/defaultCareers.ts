import { CareerNode } from '../types';

export const DEFAULT_CAREERS_FLAT = [
  { id: 'root', name: 'Careers', type: 'root', parent_id: null, is_leaf: 0 },
  
  // I. Biology
  { id: 'biology', name: 'Biology Stream', type: 'branch', parent_id: 'root', is_leaf: 0 },
  
  // 1. Medical courses (5 years)
  { id: 'medical-courses', name: 'Medical Courses (5 Years)', type: 'branch', parent_id: 'biology', is_leaf: 0 },
  { id: 'mbbs', name: 'MBBS - Allopathy', type: 'leaf', parent_id: 'medical-courses', duration: '5.5 years', is_leaf: 1 },
  { id: 'bums', name: 'BUMS - Unani', type: 'leaf', parent_id: 'medical-courses', duration: '5.5 years', is_leaf: 1 },
  { id: 'bhms', name: 'BHMS - Homeopathy', type: 'leaf', parent_id: 'medical-courses', duration: '5.5 years', is_leaf: 1 },
  { id: 'bams', name: 'BAMS - Ayurveda', type: 'leaf', parent_id: 'medical-courses', duration: '5.5 years', is_leaf: 1 },
  { id: 'bsms', name: 'BSMS - Siddha', type: 'leaf', parent_id: 'medical-courses', duration: '5.5 years', is_leaf: 1 },
  { id: 'bnys', name: 'BNYS - Naturopathy', type: 'leaf', parent_id: 'medical-courses', duration: '5.5 years', is_leaf: 1 },
  { id: 'bds', name: 'BDS - Dental', type: 'leaf', parent_id: 'medical-courses', duration: '5 years', is_leaf: 1 },
  { id: 'bvsc', name: 'BVSc - Veterinary', type: 'leaf', parent_id: 'medical-courses', duration: '5 years', is_leaf: 1 },
  { id: 'bpt', name: 'BPT - Physiotherapy', type: 'leaf', parent_id: 'medical-courses', duration: '4.5 years', is_leaf: 1 },

  // 2. Allied Health Paramedical (2/3/4 years)
  { id: 'allied-health', name: 'Allied Health Paramedical', type: 'branch', parent_id: 'biology', is_leaf: 0 },
  { id: 'b-pharma', name: 'B. Pharma', type: 'leaf', parent_id: 'allied-health', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-nursing', name: 'B.Sc - Nursing', type: 'leaf', parent_id: 'allied-health', duration: '4 years', is_leaf: 1 },
  { id: 'bot', name: 'BOT - Occupational Therapy', type: 'leaf', parent_id: 'allied-health', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-anesthesia', name: 'B.Sc - Anesthesia Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-cath-lab', name: 'B.Sc - Cath Lab Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-cardiac', name: 'B.Sc - Cardiac Care Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-optometry', name: 'B.Sc - Clinical Optometry', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-imaging', name: 'B.Sc - Imaging Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-med-lab', name: 'B.Sc - Medical Lab Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-nuclear', name: 'B.Sc - Nuclear Medicine', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-ot', name: 'B.Sc - Operation Theatre', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-perfusion', name: 'B.Sc - Perfusion Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-physician-asst', name: 'B.Sc - Physician Assistant', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-radiotherapy', name: 'B.Sc - Radiotherapy Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-renal', name: 'B.Sc - Renal Dialysis Tech', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-respiratory', name: 'B.Sc - Respiratory Care', type: 'leaf', parent_id: 'allied-health', duration: '3 years', is_leaf: 1 },

  // 3. Paramedical Courses
  { id: 'paramedical-courses', name: 'Paramedical Courses', type: 'branch', parent_id: 'biology', is_leaf: 0 },
  { id: 'dialysis-tech', name: 'Dialysis Technician', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },
  { id: 'med-lab-ecg', name: 'Med Lab & ECG Technician', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },
  { id: 'dental-tech', name: 'Dental Technician', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },
  { id: 'med-records-tech', name: 'Medical Records Tech', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },
  { id: 'xray-tech', name: 'X-Ray Technician', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },
  { id: 'ophthalmic-asst', name: 'Ophthalmic Assistant', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },
  { id: 'ot-tech', name: 'Operation Theatre Technician', type: 'leaf', parent_id: 'paramedical-courses', duration: '2 years', is_leaf: 1 },

  // II. Maths
  { id: 'maths', name: 'Maths Stream', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'b-arch', name: 'B. Architecture', type: 'leaf', parent_id: 'maths', duration: '5 years', is_leaf: 1 },
  
  // Engineering
  { id: 'engineering', name: 'Engineering (B.Tech/BE)', type: 'branch', parent_id: 'maths', is_leaf: 0 },
  { id: 'aeronautical', name: 'Aeronautical Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'aerospace', name: 'Aerospace Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'agricultural-eng', name: 'Agricultural Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'automobile', name: 'Automobile Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'automation-robotics', name: 'Automation & Robotics Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'avionics-eng', name: 'Avionics Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'biomedical-eng', name: 'Bio Medical Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'biotech-eng', name: 'Bio Technology Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'civil-eng', name: 'Civil Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'chemical-eng', name: 'Chemical Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'ceramic-eng', name: 'Ceramic Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'cse', name: 'Computer Science Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'construction-tech', name: 'Construction Tech Mngt', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'ece', name: 'Electronics & Comm Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'eee', name: 'Electrical & Electronics Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'info-science', name: 'Information Science Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'industrial-eng', name: 'Industrial Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'industrial-prod', name: 'Industrial Production Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'instrumentation', name: 'Instrumentation Technology', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'marine-eng', name: 'Marine Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'med-electronics', name: 'Medical Electronics Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'mech', name: 'Mechanical Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'mining-eng', name: 'Mining Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'mfg-science', name: 'Manufacturing Science Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'naval-arch', name: 'Naval Architecture', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'polymer-tech', name: 'Polymer Technology', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'silk-tech', name: 'Silk Technology Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'carpet-tech', name: 'Carpet Technology Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },
  { id: 'textile-eng', name: 'Textile Engineering', type: 'leaf', parent_id: 'engineering', duration: '4 years', is_leaf: 1 },

  // Other Maths Paths
  { id: 'maths-special', name: 'Specialized Programs', type: 'branch', parent_id: 'maths', is_leaf: 0 },
  { id: 'bs-ms-dual', name: 'BS + MS Dual Degree Program', type: 'leaf', parent_id: 'maths-special', duration: '5 years', is_leaf: 1 },
  { id: 'ipgdm-iim', name: 'IPGDM – IIM, Indore', type: 'leaf', parent_id: 'maths-special', duration: '5 years', is_leaf: 1 },
  { id: 'ma-iit', name: 'Master of Arts (MA)-IIT, Madras', type: 'leaf', parent_id: 'maths-special', duration: '5 years', is_leaf: 1 },
  { id: 'ms-astronomy', name: 'MS – Astronomy & Astrophysics', type: 'leaf', parent_id: 'maths-special', duration: '2 years', is_leaf: 1 },
  { id: 'msc-applied', name: 'M.Sc. – Applied Physics/Maths', type: 'leaf', parent_id: 'maths-special', duration: '2 years', is_leaf: 1 },
  { id: 'mtech-cs', name: 'M.Tech – Computer Science', type: 'leaf', parent_id: 'maths-special', duration: '2 years', is_leaf: 1 },
  { id: 'pharma-ba-bed', name: 'Pharma Course – BA + B.Ed', type: 'leaf', parent_id: 'maths-special', duration: '4 years', is_leaf: 1 },
  { id: 'teaching-bsc-bed', name: 'Teaching Course – B.Sc + B.Ed', type: 'leaf', parent_id: 'maths-special', duration: '4 years', is_leaf: 1 },

  // III. Humanities Courses (3 Years)
  { id: 'humanities', name: 'Humanities Stream', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'advertising', name: 'Advertising', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'criminology', name: 'Criminology', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'economics', name: 'Economics', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'fine-arts', name: 'Fine Arts', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'foreign-langs', name: 'Foreign Languages', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'home-science', name: 'Home Science', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'interior-design', name: 'Interior Design', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'journalism', name: 'Journalism', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'library-science', name: 'Library Science', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'literature', name: 'Literature', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'physical-ed', name: 'Physical Education', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'pol-science', name: 'Political Science', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'psychology', name: 'Psychology', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'social-work', name: 'Social Work', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'sociology', name: 'Sociology', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },
  { id: 'travel-tourism', name: 'Travel and Tourism', type: 'leaf', parent_id: 'humanities', duration: '3 years', is_leaf: 1 },

  // IV. Management Courses (1/2/3 years)
  { id: 'management', name: 'Management Stream', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'aviation-mgmt', name: 'Aviation Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'business-mgmt', name: 'Business Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'event-mgmt', name: 'Event Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'export-mgmt', name: 'Export Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'finance-mgmt', name: 'Finance Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'hospital-mgmt', name: 'Hospital Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'hotel-mgmt', name: 'Hotel Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'hr-mgmt', name: 'Human Resource Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'logistics-mgmt', name: 'Logistics Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'marketing-mgmt', name: 'Marketing Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'operations-mgmt', name: 'Operations Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'retail-mgmt', name: 'Retail Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'sales-mgmt', name: 'Sales Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },
  { id: 'tech-mgmt', name: 'Technology Management', type: 'leaf', parent_id: 'management', duration: '1-3 years', is_leaf: 1 },

  // V. Commerce Courses (3 years)
  { id: 'commerce', name: 'Commerce Stream', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'cma', name: 'CMA - Cost Management Accountant', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'cs', name: 'CS - Company Secretary', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bcom-regular', name: 'B.Com. – Regular', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bcom-tax', name: 'B.Com. – Taxation and Tax Procedure', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bcom-tourism', name: 'B.Com. – Travel & Tourism', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bcom-bank', name: 'B.Com. – Bank Management', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bcom-prof', name: 'B.Com. – Professional', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bba', name: 'BBA - Bachelors in Business Administration', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bbm', name: 'BBM - Bachelors in Business Management', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bfm', name: 'BFM - Bachelors in Financial Markets', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bms', name: 'BMS - Bachelors in Management Studies', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'baf', name: 'BAF - Bachelors in Accounting and Finance', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bms-sci', name: 'BMS - Bachelors in Management Science', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bht', name: 'BHT - Bachelors in Hotel and Tourism', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },
  { id: 'bca', name: 'BCA - Bachelors in Computer Applications', type: 'leaf', parent_id: 'commerce', duration: '3 years', is_leaf: 1 },

  // VI. UG Courses (3/4 years)
  { id: 'ug-courses', name: 'UG Courses (B.Sc)', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'bsc-aircraft', name: 'B.Sc - Aircraft Maintenance', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-agri', name: 'B.Sc - Agriculture', type: 'leaf', parent_id: 'ug-courses', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-anthro', name: 'B.Sc - Anthropology', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-avionics', name: 'B.Sc - Avionics', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-botany', name: 'B.Sc - Botany', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-chem', name: 'B.Sc - Chemistry', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-comp', name: 'B.Sc - Computer', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-dairy', name: 'B.Sc - Dairy Technology', type: 'leaf', parent_id: 'ug-courses', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-diet', name: 'B.Sc - Dietician and Nutrition', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-econ', name: 'B.Sc - Economics', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-media', name: 'B.Sc - Electronic Media', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-fishery', name: 'B.Sc - Fishery Science', type: 'leaf', parent_id: 'ug-courses', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-food', name: 'B.Sc - Food Technology', type: 'leaf', parent_id: 'ug-courses', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-forensic', name: 'B.Sc - Forensic', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-forestry', name: 'B.Sc - Forestry', type: 'leaf', parent_id: 'ug-courses', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-home-sci', name: 'B.Sc - Home Science', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-horti', name: 'B.Sc - Horticulture', type: 'leaf', parent_id: 'ug-courses', duration: '4 years', is_leaf: 1 },
  { id: 'bsc-hospitality', name: 'B.Sc - Hospitality', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-hotel', name: 'B.Sc - Hotel Management', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-mass-comm', name: 'B.Sc - Mass Communication', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-maths', name: 'B.Sc – Mathematics', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-maritime', name: 'B.Sc – Maritime Science', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-meteo', name: 'B.Sc - Meteorology', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-multi', name: 'B.Sc - Multimedia', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-nautical', name: 'B.Sc - Nautical Science', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-ocean', name: 'B.Sc - Oceanography', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-phys', name: 'B.Sc - Physics', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-stats', name: 'B.Sc - Statistics', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },
  { id: 'bsc-zoo', name: 'B.Sc - Zoology', type: 'leaf', parent_id: 'ug-courses', duration: '3 years', is_leaf: 1 },

  // Less Travelled Path
  { id: 'less-travelled', name: 'Less Travelled Paths', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'b-design', name: 'Bachelors in Design', type: 'leaf', parent_id: 'less-travelled', duration: '4 years', is_leaf: 1 },
  { id: 'b-maths', name: 'Bachelors in Maths', type: 'leaf', parent_id: 'less-travelled', duration: '3 years', is_leaf: 1 },
  { id: 'b-stats', name: 'Bachelors in Stats', type: 'leaf', parent_id: 'less-travelled', duration: '3 years', is_leaf: 1 },
  { id: 'b-social-work', name: 'Bachelors in Social Work', type: 'leaf', parent_id: 'less-travelled', duration: '3 years', is_leaf: 1 },
  { id: 'b-ped', name: 'Bachelors in P.Ed', type: 'leaf', parent_id: 'less-travelled', duration: '3 years', is_leaf: 1 },
  { id: 'b-fine-arts', name: 'Bachelors in Fine Arts', type: 'leaf', parent_id: 'less-travelled', duration: '4 years', is_leaf: 1 },

  // VII. Law Courses (3/5 years)
  { id: 'law', name: 'Law Stream', type: 'branch', parent_id: 'root', is_leaf: 0 },
  { id: 'ba-llb', name: 'BA + LLB', type: 'leaf', parent_id: 'law', duration: '5 years', is_leaf: 1 },
  { id: 'bcom-llb', name: 'B.Com. + LLB', type: 'leaf', parent_id: 'law', duration: '5 years', is_leaf: 1 },
  { id: 'bbm-llb', name: 'BBM + LLB', type: 'leaf', parent_id: 'law', duration: '5 years', is_leaf: 1 },
  { id: 'bba-llb', name: 'BBA + LLB', type: 'leaf', parent_id: 'law', duration: '5 years', is_leaf: 1 },

  // VIII. C.A.
  { id: 'ca-root', name: 'Chartered Accountancy (CA)', type: 'leaf', parent_id: 'root', duration: '4-5 years', is_leaf: 1 },
];

export const DEFAULT_UNIVERSITIES: Record<string, any[]> = {
  'mbbs': [
    { name: 'AIIMS Delhi', location: 'New Delhi', fees: '₹5,856/year', duration: '5.5 years', ranking: 'NIRF #1', specialization: 'Medicine', website: 'https://www.aiims.edu' },
    { name: 'CMC Vellore', location: 'Vellore', fees: '₹50,000/year', duration: '5.5 years', ranking: 'NIRF #2', specialization: 'Medicine', website: 'https://www.cmcvellore.ac.in' }
  ],
  'cse': [
    { name: 'IIT Bombay', location: 'Mumbai', fees: '₹2,00,000/year', duration: '4 years', ranking: 'NIRF #1', specialization: 'Computer Science', website: 'https://www.iitb.ac.in' },
    { name: 'IIT Delhi', location: 'New Delhi', fees: '₹2,00,000/year', duration: '4 years', ranking: 'NIRF #2', specialization: 'Computer Science', website: 'https://www.iitd.ac.in' }
  ],
  'ca-root': [
    { name: 'ICAI', location: 'Pan India', fees: '₹25,000 (Total)', duration: '4-5 years', ranking: 'Professional Body', specialization: 'Accounting', website: 'https://www.icai.org' }
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
