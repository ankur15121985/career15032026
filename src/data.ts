import { CareerNode, University } from './types';

export const collegeData: Record<string, University[]> = {
  "MBBS - Allopathy": [
    { name: "All India Institute of Medical Sciences (AIIMS)", location: "New Delhi, India", fees: "₹5,856/year", duration: "5.5 years MBBS", ranking: "NIRF Medical #1", specialization: "Medicine & Surgery" },
    { name: "Christian Medical College (CMC)", location: "Vellore, Tamil Nadu, India", fees: "₹58,000/year", duration: "5.5 years MBBS", ranking: "NIRF Medical #2", specialization: "General Medicine" },
    { name: "Kasturba Medical College (KMC)", location: "Manipal, Karnataka, India", fees: "₹20,00,000/year", duration: "5.5 years MBBS", ranking: "Top 10 Medical", specialization: "Medicine" },
    { name: "Johns Hopkins University", location: "Baltimore, MD, USA", fees: "$54,900/year", duration: "4 years MD", ranking: "US News #1 Medical", specialization: "Medicine" }
  ],
  "Computer Science Engineering": [
    { name: "Massachusetts Institute of Technology (MIT)", location: "Cambridge, MA, USA", fees: "$53,790/year", duration: "4 years B.Tech", ranking: "QS World #1", specialization: "Computer Science & Engineering" },
    { name: "Stanford University", location: "Stanford, CA, USA", fees: "$56,169/year", duration: "4 years B.S", ranking: "QS World #2", specialization: "Computer Science" },
    { name: "Indian Institute of Technology Bombay", location: "Mumbai, Maharashtra, India", fees: "₹2,00,000/year", duration: "4 years B.Tech", ranking: "NIRF India #1", specialization: "Computer Science & Engineering" },
    { name: "Indian Institute of Technology Delhi", location: "New Delhi, India", fees: "₹2,00,000/year", duration: "4 years B.Tech", ranking: "NIRF India #2", specialization: "Computer Science" },
    { name: "BITS Pilani", location: "Pilani, Rajasthan, India", fees: "₹4,50,000/year", duration: "4 years B.E", ranking: "NIRF India #30", specialization: "Computer Science" }
  ],
  "Civil Engineering": [
    { name: "IIT Madras", location: "Chennai, Tamil Nadu, India", fees: "₹2,00,000/year", duration: "4 years B.Tech", ranking: "NIRF India #1", specialization: "Civil Engineering" },
    { name: "IIT Kharagpur", location: "Kharagpur, West Bengal, India", fees: "₹2,00,000/year", duration: "4 years B.Tech", ranking: "NIRF India #4", specialization: "Civil Engineering" },
    { name: "UC Berkeley", location: "Berkeley, CA, USA", fees: "$44,115/year", duration: "4 years B.S", ranking: "Top 3 Engineering", specialization: "Civil & Environmental Engineering" }
  ],
  "BBA - Business Administration": [
    { name: "Shaheed Sukhdev College of Business Studies", location: "Delhi University, India", fees: "₹30,000/year", duration: "3 years BBA", ranking: "Top DU College", specialization: "Business Administration" },
    { name: "Christ University", location: "Bangalore, Karnataka, India", fees: "₹2,75,000/year", duration: "3 years BBA", ranking: "A+ NAAC", specialization: "Business Management" },
    { name: "Symbiosis Centre", location: "Pune, Maharashtra, India", fees: "₹3,00,000/year", duration: "3 years BBA", ranking: "Top Private", specialization: "Business Administration" }
  ],
  "BA + LLB": [
    { name: "National Law School of India University", location: "Bangalore, Karnataka, India", fees: "₹2,20,000/year", duration: "5 years BA LLB", ranking: "NIRF Law #1", specialization: "Corporate & Business Law" },
    { name: "NALSAR University of Law", location: "Hyderabad, Telangana, India", fees: "₹2,28,000/year", duration: "5 years BA LLB", ranking: "NIRF Law #2", specialization: "Business Law" },
    { name: "National Law University Delhi", location: "New Delhi, India", fees: "₹2,10,000/year", duration: "5 years BA LLB", ranking: "NIRF Law #3", specialization: "Law" }
  ],
  "B.Architecture": [
    { name: "School of Planning & Architecture", location: "New Delhi, India", fees: "₹75,000/year", duration: "5 years B.Arch", ranking: "Premier Architecture", specialization: "Architecture & Planning" },
    { name: "IIT Roorkee", location: "Roorkee, Uttarakhand, India", fees: "₹2,00,000/year", duration: "5 years B.Arch", ranking: "NIRF Arch #1", specialization: "Architecture" },
    { name: "IIT Kharagpur", location: "Kharagpur, West Bengal, India", fees: "₹2,00,000/year", duration: "5 years B.Arch", ranking: "Top IIT", specialization: "Architecture" }
  ],
  "B.Pharma": [
    { name: "Jamia Hamdard", location: "New Delhi, India", fees: "₹1,50,000/year", duration: "4 years B.Pharma", ranking: "NIRF Pharmacy #1", specialization: "Pharmacy" },
    { name: "Manipal College of Pharmaceutical Sciences", location: "Manipal, Karnataka, India", fees: "₹3,50,000/year", duration: "4 years B.Pharma", ranking: "Top 5 Pharmacy", specialization: "Pharmaceutical Sciences" },
    { name: "BITS Pilani", location: "Pilani, Rajasthan, India", fees: "₹4,50,000/year", duration: "4 years B.Pharma", ranking: "Premier Institute", specialization: "Pharmacy" }
  ],
  "B.Sc Nursing": [
    { name: "AIIMS Nursing College", location: "New Delhi, India", fees: "₹20,000/year", duration: "4 years B.Sc", ranking: "Top Nursing", specialization: "Nursing" },
    { name: "CMC Vellore", location: "Vellore, Tamil Nadu, India", fees: "₹50,000/year", duration: "4 years B.Sc", ranking: "Premier Medical", specialization: "Nursing & Healthcare" },
    { name: "Kasturba Medical College", location: "Manipal, Karnataka, India", fees: "₹1,50,000/year", duration: "4 years B.Sc", ranking: "Top Private", specialization: "Nursing" }
  ],
  "Aeronautical Engineering": [
    { name: "Indian Institute of Technology (IIT) Bombay", location: "Mumbai, Maharashtra, India", fees: "₹2,00,000/year", duration: "4 years B.Tech", ranking: "NIRF India #1", specialization: "Aerospace Engineering" },
    { name: "Indian Institute of Space Science and Technology (IIST)", location: "Thiruvananthapuram, Kerala, India", fees: "₹1,50,000/year", duration: "4 years B.Tech", ranking: "Premier Space Tech", specialization: "Avionics & Aerospace" },
    { name: "Madras Institute of Technology (MIT)", location: "Chennai, Tamil Nadu, India", fees: "₹50,000/year", duration: "4 years B.E", ranking: "Top State Govt", specialization: "Aeronautical Engineering" }
  ],
  "CA - Chartered Accountant": [
    { name: "The Institute of Chartered Accountants of India (ICAI)", location: "New Delhi, India", fees: "₹25,000 (Total Exam Fees)", duration: "4-5 years", ranking: "National Statutory Body", specialization: "Accountancy & Audit" },
    { name: "Shri Ram College of Commerce (SRCC)", location: "New Delhi, India", fees: "₹30,000/year", duration: "3 years B.Com (H)", ranking: "#1 Commerce in India", specialization: "Accounting & Finance" }
  ],
  "BCA - Computer Applications": [
    { name: "Christ University", location: "Bangalore, Karnataka, India", fees: "₹1,50,000/year", duration: "3 years BCA", ranking: "Top Private BCA", specialization: "Computer Applications" },
    { name: "Symbiosis Institute of Computer Studies and Research (SICSR)", location: "Pune, Maharashtra, India", fees: "₹1,80,000/year", duration: "3 years BCA", ranking: "Premier IT Institute", specialization: "Information Technology" },
    { name: "Loyola College", location: "Chennai, Tamil Nadu, India", fees: "₹60,000/year", duration: "3 years BCA", ranking: "Top Arts & Science", specialization: "Computer Science" }
  ],
  "Psychology": [
    { name: "Lady Shri Ram College (LSR)", location: "New Delhi, India", fees: "₹20,000/year", duration: "3 years BA (H)", ranking: "#1 Psychology in India", specialization: "Psychology" },
    { name: "Tata Institute of Social Sciences (TISS)", location: "Mumbai, Maharashtra, India", fees: "₹50,000/year", duration: "3 years BA", ranking: "Premier Social Sciences", specialization: "Social Sciences" },
    { name: "Jesus and Mary College (JMC)", location: "New Delhi, India", fees: "₹15,000/year", duration: "3 years BA (H)", ranking: "Top DU College", specialization: "Psychology" }
  ],
  "Economics": [
    { name: "St. Stephen's College", location: "New Delhi, India", fees: "₹40,000/year", duration: "3 years BA (H)", ranking: "#1 Economics in India", specialization: "Economics" },
    { name: "Shri Ram College of Commerce (SRCC)", location: "New Delhi, India", fees: "₹30,000/year", duration: "3 years BA (H)", ranking: "Top Commerce/Eco", specialization: "Economics" },
    { name: "London School of Economics (LSE)", location: "London, UK", fees: "£23,000/year", duration: "3 years B.Sc", ranking: "World #1 for Economics", specialization: "Economics & Political Science" }
  ]
};

export const careerData: CareerNode = {
  id: 'root',
  name: "Careers",
  type: "root",
  children: [
    {
      id: 'biology',
      name: "Biology Stream",
      type: "branch",
      children: [
        {
          id: 'medical',
          name: "Medical Courses (5 years)",
          type: "branch",
          children: [
            { id: 'mbbs', name: "MBBS - Allopathy", type: "leaf", isLeaf: true, duration: "5.5 years" },
            { id: 'bums', name: "BUMS - Unani", type: "leaf", isLeaf: true, duration: "5.5 years" },
            { id: 'bhms', name: "BHMS - Homeopathy", type: "leaf", isLeaf: true, duration: "5.5 years" },
            { id: 'bams', name: "BAMS - Ayurveda", type: "leaf", isLeaf: true, duration: "5.5 years" },
            { id: 'bsms', name: "BSMS - Siddha", type: "leaf", isLeaf: true, duration: "5.5 years" },
            { id: 'bnys', name: "BNYS - Naturopathy", type: "leaf", isLeaf: true, duration: "5.5 years" },
            { id: 'bds', name: "BDS - Dental", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'bvsc', name: "BVSc - Veterinary", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'bpt', name: "BPT - Physiotherapy", type: "leaf", isLeaf: true, duration: "4.5 years" }
          ]
        },
        {
          id: 'allied-health',
          name: "Allied Health (2-4 years)",
          type: "branch",
          children: [
            { id: 'bpharma', name: "B.Pharma", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'nursing', name: "B.Sc Nursing", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'bot', name: "BOT - Occupational Therapy", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'anesthesia', name: "B.Sc Anesthesia Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'cath-lab', name: "B.Sc Cath Lab Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'cardiac-care', name: "B.Sc Cardiac Care Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'optometry', name: "B.Sc Clinical Optometry", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'imaging', name: "B.Sc Imaging Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'mlt', name: "B.Sc Medical Lab Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'nuclear-med', name: "B.Sc Nuclear Medicine", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'ot-tech', name: "B.Sc Operation Theatre", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'perfusion', name: "B.Sc Perfusion Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'physician-asst', name: "B.Sc Physician Assistant", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'radiotherapy', name: "B.Sc Radiotherapy Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'renal-dialysis', name: "B.Sc Renal Dialysis Tech", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'respiratory-care', name: "B.Sc Respiratory Care", type: "leaf", isLeaf: true, duration: "3 years" }
          ]
        },
        {
          id: 'paramedical',
          name: "Paramedical Courses",
          type: "branch",
          children: [
            { id: 'dialysis-tech', name: "Dialysis Technician", type: "leaf", isLeaf: true, duration: "1-2 years" },
            { id: 'med-lab-ecg', name: "Med Lab & ECG Technician", type: "leaf", isLeaf: true, duration: "1-2 years" },
            { id: 'dental-tech', name: "Dental Technician", type: "leaf", isLeaf: true, duration: "1-2 years" },
            { id: 'med-records', name: "Medical Records Tech", type: "leaf", isLeaf: true, duration: "1-2 years" },
            { id: 'xray-tech', name: "X-Ray Technician", type: "leaf", isLeaf: true, duration: "1-2 years" },
            { id: 'ophthalmic-asst', name: "Ophthalmic Assistant", type: "leaf", isLeaf: true, duration: "1-2 years" },
            { id: 'ot-technician', name: "Operation Theatre Technician", type: "leaf", isLeaf: true, duration: "1-2 years" }
          ]
        }
      ]
    },
    {
      id: 'maths',
      name: "Maths Stream",
      type: "branch",
      children: [
        {
          id: 'engineering-branch',
          name: "Engineering",
          type: "branch",
          children: [
            { id: 'aeronautical', name: "Aeronautical Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'aerospace', name: "Aerospace Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'agricultural', name: "Agricultural Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'automobile', name: "Automobile Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'robotics-eng', name: "Automation & Robotics", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'avionics', name: "Avionics Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'biomedical', name: "Bio Medical Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'biotech-eng', name: "Bio Technology Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'civil-eng', name: "Civil Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'chemical-eng', name: "Chemical Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'ceramic', name: "Ceramic Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'cse', name: "Computer Science Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'construction-mgmt', name: "Construction Tech Management", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'ece', name: "Electronics & Communication", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'eee', name: "Electrical & Electronics", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'ise', name: "Information Science Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'industrial-eng', name: "Industrial Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'industrial-prod', name: "Industrial Production", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'instrumentation', name: "Instrumentation Technology", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'marine-eng', name: "Marine Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'medical-electronics', name: "Medical Electronics", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'mechanical-eng', name: "Mechanical Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'mining-eng', name: "Mining Engineering", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'manufacturing-sci', name: "Manufacturing Science", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'naval-arch', name: "Naval Architecture", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'polymer-tech', name: "Polymer Technology", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'silk-tech', name: "Silk Technology", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'carpet-tech', name: "Carpet Technology", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'textile-eng', name: "Textile Engineering", type: "leaf", isLeaf: true, duration: "4 years" }
          ]
        },
        {
          id: 'architecture-branch',
          name: "Architecture",
          type: "branch",
          children: [
            { id: 'barch', name: "B.Architecture", type: "leaf", isLeaf: true, duration: "5 years" }
          ]
        },
        {
          id: 'dual-degree',
          name: "Dual Degree Programs",
          type: "branch",
          children: [
            { id: 'bs-ms', name: "BS + MS Program", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'ipgdm', name: "IPGDM - IIM Indore", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'ma-iit', name: "MA - IIT Madras", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'ms-astronomy', name: "MS - Astronomy & Astrophysics", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'msc-applied', name: "M.Sc Applied Physics/Maths", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'mtech-cs', name: "M.Tech Computer Science", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'bpharma-bed', name: "B.Pharma + B.Ed", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'bsc-bed', name: "B.Sc + B.Ed", type: "leaf", isLeaf: true, duration: "4 years" }
          ]
        }
      ]
    },
    {
      id: 'humanities',
      name: "Humanities",
      type: "branch",
      children: [
        {
          id: 'arts-courses',
          name: "Arts Courses (3 years)",
          type: "branch",
          children: [
            { id: 'advertising', name: "Advertising", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'criminology', name: "Criminology", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'economics', name: "Economics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'fine-arts-leaf', name: "Fine Arts", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'foreign-languages', name: "Foreign Languages", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'home-science', name: "Home Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'interior-design', name: "Interior Design", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'journalism-leaf', name: "Journalism", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'library-science', name: "Library Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'literature', name: "Literature", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'physical-ed', name: "Physical Education", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'political-sci', name: "Political Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'psychology-leaf', name: "Psychology", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'social-work-leaf', name: "Social Work", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'sociology-leaf', name: "Sociology", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'travel-tourism', name: "Travel and Tourism", type: "leaf", isLeaf: true, duration: "3 years" }
          ]
        }
      ]
    },
    {
      id: 'management',
      name: "Management",
      type: "branch",
      children: [
        {
          id: 'mgmt-courses',
          name: "Management Courses (1-3 years)",
          type: "branch",
          children: [
            { id: 'aviation-mgmt', name: "Aviation Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'business-mgmt', name: "Business Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'event-mgmt', name: "Event Management", type: "leaf", isLeaf: true, duration: "1 year" },
            { id: 'export-mgmt', name: "Export Management", type: "leaf", isLeaf: true, duration: "1 year" },
            { id: 'finance-mgmt', name: "Finance Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'hospital-mgmt', name: "Hospital Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'hotel-mgmt', name: "Hotel Management", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'hr-mgmt', name: "Human Resource Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'logistics-mgmt', name: "Logistics Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'marketing-mgmt', name: "Marketing Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'ops-mgmt', name: "Operations Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'retail-mgmt', name: "Retail Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'sales-mgmt', name: "Sales Management", type: "leaf", isLeaf: true, duration: "2 years" },
            { id: 'tech-mgmt', name: "Technology Management", type: "leaf", isLeaf: true, duration: "2 years" }
          ]
        }
      ]
    },
    {
      id: 'commerce-branch',
      name: "Commerce",
      type: "branch",
      children: [
        {
          id: 'commerce-courses',
          name: "Commerce Courses (3 years)",
          type: "branch",
          children: [
            { id: 'cma', name: "CMA - Cost Management Accountant", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'cs-leaf', name: "CS - Company Secretary", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bcom-reg', name: "B.Com Regular", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bcom-tax', name: "B.Com Taxation", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bcom-tt', name: "B.Com Travel & Tourism", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bcom-bank', name: "B.Com Bank Management", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bcom-prof', name: "B.Com Professional", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bba-leaf', name: "BBA - Business Administration", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bbm-leaf', name: "BBM - Business Management", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bfm', name: "BFM - Financial Markets", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bms', name: "BMS - Management Studies", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'baf', name: "BAF - Accounting & Finance", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bht', name: "BHT - Hotel & Tourism", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bca', name: "BCA - Computer Applications", type: "leaf", isLeaf: true, duration: "3 years" }
          ]
        }
      ]
    },
    {
      id: 'science-courses-branch',
      name: "Science Courses",
      type: "branch",
      children: [
        {
          id: 'bsc-programs',
          name: "B.Sc Programs (3-4 years)",
          type: "branch",
          children: [
            { id: 'bsc-aircraft', name: "B.Sc Aircraft Maintenance", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-agri', name: "B.Sc Agriculture", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'bsc-anthro', name: "B.Sc Anthropology", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-avionics', name: "B.Sc Avionics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-botany', name: "B.Sc Botany", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-chem', name: "B.Sc Chemistry", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-cs-leaf', name: "B.Sc Computer Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-dairy', name: "B.Sc Dairy Technology", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'bsc-diet', name: "B.Sc Dietician & Nutrition", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-econ', name: "B.Sc Economics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-media', name: "B.Sc Electronic Media", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-fishery', name: "B.Sc Fishery Science", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'bsc-food', name: "B.Sc Food Technology", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-forensic', name: "B.Sc Forensic Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-forestry', name: "B.Sc Forestry", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'bsc-home-sci', name: "B.Sc Home Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-horti', name: "B.Sc Horticulture", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'bsc-hosp', name: "B.Sc Hospitality", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-hotel', name: "B.Sc Hotel Management", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-mass-comm', name: "B.Sc Mass Communication", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-maths', name: "B.Sc Mathematics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-maritime', name: "B.Sc Maritime Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-meteo', name: "B.Sc Meteorology", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-multi', name: "B.Sc Multimedia", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-nautical', name: "B.Sc Nautical Science", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-ocean', name: "B.Sc Oceanography", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-physics', name: "B.Sc Physics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-stats', name: "B.Sc Statistics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'bsc-zoology', name: "B.Sc Zoology", type: "leaf", isLeaf: true, duration: "3 years" }
          ]
        }
      ]
    },
    {
      id: 'law-courses-branch',
      name: "Law Courses",
      type: "branch",
      children: [
        {
          id: 'legal-edu',
          name: "Legal Education (3-5 years)",
          type: "branch",
          children: [
            { id: 'ba-llb', name: "BA + LLB", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'bcom-llb', name: "B.Com + LLB", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'bbm-llb', name: "BBM + LLB", type: "leaf", isLeaf: true, duration: "5 years" },
            { id: 'bba-llb-leaf', name: "BBA + LLB", type: "leaf", isLeaf: true, duration: "5 years" }
          ]
        }
      ]
    },
    {
      id: 'prof-courses',
      name: "Professional Courses",
      type: "branch",
      children: [
        {
          id: 'ca-branch',
          name: "Chartered Accountancy",
          type: "branch",
          children: [
            { id: 'ca-leaf', name: "CA - Chartered Accountant", type: "leaf", isLeaf: true, duration: "4-5 years" }
          ]
        },
        {
          id: 'less-travelled',
          name: "Less Travelled Paths",
          type: "branch",
          children: [
            { id: 'b-design', name: "Bachelor in Design", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'b-maths', name: "Bachelor in Maths", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'b-stats', name: "Bachelor in Statistics", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'b-social-work', name: "Bachelor in Social Work", type: "leaf", isLeaf: true, duration: "3 years" },
            { id: 'b-ped', name: "Bachelor in P.Ed", type: "leaf", isLeaf: true, duration: "4 years" },
            { id: 'b-fine-arts', name: "Bachelor in Fine Arts", type: "leaf", isLeaf: true, duration: "4 years" }
          ]
        }
      ]
    }
  ]
};
