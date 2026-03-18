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
  // MBBS
  { id: 'mbbs-1', career_id: 'mbbs', name: 'AIIMS Delhi', location: 'New Delhi, India', fees: '₹5,856/year', duration: '5.5 years', ranking: 'Govt - NIRF #1', specialization: 'Medicine', website: 'https://www.aiims.edu' },
  { id: 'mbbs-2', career_id: 'mbbs', name: 'Maulana Azad Medical College', location: 'New Delhi, India', fees: '₹15,000/year', duration: '5.5 years', ranking: 'Govt - Top Tier', specialization: 'Medicine', website: 'https://www.mamc.ac.in' },
  { id: 'mbbs-3', career_id: 'mbbs', name: 'CMC Vellore', location: 'Vellore, India', fees: '₹50,000/year', duration: '5.5 years', ranking: 'Private - NIRF #3', specialization: 'Medicine', website: 'https://www.cmcvellore.ac.in' },
  { id: 'mbbs-4', career_id: 'mbbs', name: 'Kasturba Medical College', location: 'Manipal, India', fees: '₹17.8 Lakhs/year', duration: '5.5 years', ranking: 'Private - Top Tier', specialization: 'Medicine', website: 'https://manipal.edu' },
  { id: 'mbbs-5', career_id: 'mbbs', name: 'Harvard Medical School', location: 'Boston, USA', fees: '$65,000/year', duration: '4 years (MD)', ranking: 'Global #1', specialization: 'Medicine', website: 'https://hms.harvard.edu' },
  { id: 'mbbs-6', career_id: 'mbbs', name: 'University of Oxford', location: 'Oxford, UK', fees: '£40,000/year', duration: '6 years', ranking: 'Global #2', specialization: 'Medicine', website: 'https://www.ox.ac.uk' },

  // CSE
  { id: 'cse-1', career_id: 'cse', name: 'IIT Bombay', location: 'Mumbai, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #1', specialization: 'Computer Science', website: 'https://www.iitb.ac.in' },
  { id: 'cse-2', career_id: 'cse', name: 'IIT Delhi', location: 'New Delhi, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - NIRF #2', specialization: 'Computer Science', website: 'https://www.iitd.ac.in' },
  { id: 'cse-3', career_id: 'cse', name: 'BITS Pilani', location: 'Pilani, India', fees: '₹5,00,000/year', duration: '4 years', ranking: 'Private - Top Tier', specialization: 'Engineering', website: 'https://www.bits-pilani.ac.in' },
  { id: 'cse-4', career_id: 'cse', name: 'VIT Vellore', location: 'Vellore, India', fees: '₹1,98,000/year', duration: '4 years', ranking: 'Private - NIRF #11', specialization: 'Engineering', website: 'https://vit.ac.in' },
  { id: 'cse-5', career_id: 'cse', name: 'MIT', location: 'Cambridge, USA', fees: '$58,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Computer Science', website: 'https://www.mit.edu' },
  { id: 'cse-6', career_id: 'cse', name: 'Stanford University', location: 'Stanford, USA', fees: '$60,000/year', duration: '4 years', ranking: 'Global #2', specialization: 'Computer Science', website: 'https://www.stanford.edu' },

  // B.Com Regular
  { id: 'bcom-1', career_id: 'bcom-regular', name: 'SRCC', location: 'New Delhi, India', fees: '₹30,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Commerce', website: 'https://www.srcc.edu' },
  { id: 'bcom-2', career_id: 'bcom-regular', name: 'Hindu College', location: 'New Delhi, India', fees: '₹20,000/year', duration: '3 years', ranking: 'Govt - NIRF #2', specialization: 'Commerce', website: 'https://hinducollege.ac.in' },
  { id: 'bcom-3', career_id: 'bcom-regular', name: 'Christ University', location: 'Bangalore, India', fees: '₹85,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Commerce', website: 'https://christuniversity.in' },
  { id: 'bcom-4', career_id: 'bcom-regular', name: 'Symbiosis College of Arts & Commerce', location: 'Pune, India', fees: '₹40,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Commerce', website: 'https://symbiosiscollege.edu.in' },
  { id: 'bcom-5', career_id: 'bcom-regular', name: 'London School of Economics', location: 'London, UK', fees: '£25,000/year', duration: '3 years', ranking: 'Global #1', specialization: 'Finance/Economics', website: 'https://www.lse.ac.uk' },

  // BBA
  { id: 'bba-1', career_id: 'bba', name: 'IIM Indore (IPM)', location: 'Indore, India', fees: '₹5,00,000/year', duration: '5 years (Integrated)', ranking: 'Govt - Top Tier', specialization: 'Management', website: 'https://www.iimidr.ac.in' },
  { id: 'bba-2', career_id: 'bba', name: 'Shaheed Sukhdev College of Business Studies', location: 'Delhi, India', fees: '₹25,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Management', website: 'https://sscbs.du.ac.in' },
  { id: 'bba-3', career_id: 'bba', name: 'NMIMS', location: 'Mumbai, India', fees: '₹3,00,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Management', website: 'https://www.nmims.edu' },
  { id: 'bba-4', career_id: 'bba', name: 'Wharton School (UPenn)', location: 'Philadelphia, USA', fees: '$62,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Business', website: 'https://www.wharton.upenn.edu' },
  { id: 'bba-5', career_id: 'bba', name: 'INSEAD', location: 'Fontainebleau, France', fees: '€90,000 (Total)', duration: '1 year (MBA)', ranking: 'Global #1', specialization: 'Management', website: 'https://www.insead.edu' },
  { id: 'bba-6', career_id: 'bba', name: 'HEC Paris', location: 'Jouy-en-Josas, France', fees: '€40,000/year', duration: '3 years (MiM)', ranking: 'Global #1', specialization: 'Business', website: 'https://www.hec.edu' },

  // BA LLB
  { id: 'law-1', career_id: 'ba-llb', name: 'NLSIU Bangalore', location: 'Bangalore, India', fees: '₹2,50,000/year', duration: '5 years', ranking: 'Govt - NIRF #1', specialization: 'Law', website: 'https://www.nls.ac.in' },
  { id: 'law-2', career_id: 'ba-llb', name: 'NALSAR', location: 'Hyderabad, India', fees: '₹2,40,000/year', duration: '5 years', ranking: 'Govt - NIRF #2', specialization: 'Law', website: 'https://www.nalsar.ac.in' },
  { id: 'law-3', career_id: 'ba-llb', name: 'Jindal Global Law School', location: 'Sonipat, India', fees: '₹6,00,000/year', duration: '5 years', ranking: 'Private - Top Tier', specialization: 'Law', website: 'https://jgu.edu.in' },
  { id: 'law-4', career_id: 'ba-llb', name: 'Yale Law School', location: 'New Haven, USA', fees: '$70,000/year', duration: '3 years (JD)', ranking: 'Global #1', specialization: 'Law', website: 'https://law.yale.edu' },
  { id: 'law-5', career_id: 'ba-llb', name: 'University of Sydney', location: 'Sydney, Australia', fees: 'A$45,000/year', duration: '5 years', ranking: 'Global Top 20', specialization: 'Law', website: 'https://www.sydney.edu.au' },

  // B.Design
  { id: 'design-1', career_id: 'b-design', name: 'NID Ahmedabad', location: 'Ahmedabad, India', fees: '₹3,50,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Design', website: 'https://www.nid.edu' },
  { id: 'design-2', career_id: 'b-design', name: 'IIT Bombay (IDC)', location: 'Mumbai, India', fees: '₹2,00,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Design', website: 'http://www.idc.iitb.ac.in' },
  { id: 'design-3', career_id: 'b-design', name: 'Parsons School of Design', location: 'New York, USA', fees: '$55,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Design', website: 'https://www.newschool.edu/parsons' },
  { id: 'design-4', career_id: 'b-design', name: 'Royal College of Art', location: 'London, UK', fees: '£30,000/year', duration: '2 years (MA)', ranking: 'Global #1', specialization: 'Design', website: 'https://www.rca.ac.uk' },

  // CA
  { id: 'ca-1', career_id: 'ca-root', name: 'ICAI', location: 'Pan India', fees: '₹25,000 (Total)', duration: '4-5 years', ranking: 'Professional Body', specialization: 'Accounting', website: 'https://www.icai.org' },
  { id: 'ca-2', career_id: 'ca-root', name: 'ACCA', location: 'Global', fees: '£1,500 (Total)', duration: '3-4 years', ranking: 'Global Body', specialization: 'Accounting', website: 'https://www.accaglobal.com' },

  // Economics
  { id: 'econ-1', career_id: 'economics', name: 'St. Stephens College', location: 'Delhi, India', fees: '₹40,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Economics', website: 'https://www.ststephens.edu' },
  { id: 'econ-2', career_id: 'economics', name: 'Delhi School of Economics', location: 'Delhi, India', fees: '₹10,000/year', duration: '2 years (MA)', ranking: 'Govt - Top Tier', specialization: 'Economics', website: 'http://econdse.org' },
  { id: 'econ-3', career_id: 'economics', name: 'University of Chicago', location: 'Chicago, USA', fees: '$60,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Economics', website: 'https://economics.uchicago.edu' },

  // Psychology
  { id: 'psych-1', career_id: 'psychology', name: 'TISS', location: 'Mumbai, India', fees: '₹60,000/year', duration: '2 years (MA)', ranking: 'Govt - Top Tier', specialization: 'Psychology', website: 'https://www.tiss.edu' },
  { id: 'psych-2', career_id: 'psychology', name: 'LSR', location: 'Delhi, India', fees: '₹25,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Psychology', website: 'https://lsr.edu.in' },
  { id: 'psych-3', career_id: 'psychology', name: 'Stanford University', location: 'Stanford, USA', fees: '$60,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Psychology', website: 'https://psychology.stanford.edu' },

  // B.Arch
  { id: 'arch-1', career_id: 'b-arch', name: 'IIT Roorkee', location: 'Roorkee, India', fees: '₹2,00,000/year', duration: '5 years', ranking: 'Govt - NIRF #1', specialization: 'Architecture', website: 'https://www.iitr.ac.in' },
  { id: 'arch-2', career_id: 'b-arch', name: 'SPA Delhi', location: 'New Delhi, India', fees: '₹50,000/year', duration: '5 years', ranking: 'Govt - NIRF #2', specialization: 'Architecture', website: 'http://spa.ac.in' },
  { id: 'arch-3', career_id: 'b-arch', name: 'CEPT University', location: 'Ahmedabad, India', fees: '₹3,20,000/year', duration: '5 years', ranking: 'Private - Top Tier', specialization: 'Architecture', website: 'https://cept.ac.in' },
  { id: 'arch-4', career_id: 'b-arch', name: 'Architectural Association (AA)', location: 'London, UK', fees: '£22,000/year', duration: '5 years', ranking: 'Global #1', specialization: 'Architecture', website: 'https://www.aaschool.ac.uk' },

  // B.Pharma
  { id: 'pharma-1', career_id: 'b-pharma', name: 'NIPER Mohali', location: 'Mohali, India', fees: '₹80,000/year', duration: '2 years (M.Pharm)', ranking: 'Govt - NIRF #1', specialization: 'Pharmacy', website: 'https://www.niper.gov.in' },
  { id: 'pharma-2', career_id: 'b-pharma', name: 'Jamia Hamdard', location: 'New Delhi, India', fees: '₹1,50,000/year', duration: '4 years', ranking: 'Govt - NIRF #2', specialization: 'Pharmacy', website: 'http://www.jamiahamdard.ac.in' },
  { id: 'pharma-3', career_id: 'b-pharma', name: 'ICT Mumbai', location: 'Mumbai, India', fees: '₹85,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Pharmacy', website: 'https://www.ictmumbai.edu.in' },

  // B.Sc Nursing
  { id: 'nursing-1', career_id: 'bsc-nursing', name: 'AIIMS Delhi', location: 'New Delhi, India', fees: '₹1,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Nursing', website: 'https://www.aiims.edu' },
  { id: 'nursing-2', career_id: 'bsc-nursing', name: 'RAK College of Nursing', location: 'Delhi, India', fees: '₹15,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Nursing', website: 'http://rakcon.com' },

  // Fine Arts
  { id: 'finearts-1', career_id: 'fine-arts', name: 'Faculty of Fine Arts, MSU', location: 'Baroda, India', fees: '₹10,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Fine Arts', website: 'https://www.msubaroda.ac.in' },
  { id: 'finearts-2', career_id: 'fine-arts', name: 'College of Art', location: 'Delhi, India', fees: '₹15,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Fine Arts', website: 'http://colart.delhigovt.nic.in' },

  // Hotel Mgmt
  { id: 'hotel-1', career_id: 'hotel-mgmt', name: 'IHM Pusa', location: 'New Delhi, India', fees: '₹1,20,000/year', duration: '3 years', ranking: 'Govt - Top Tier', specialization: 'Hotel Management', website: 'http://ihmpusa.net' },
  { id: 'hotel-2', career_id: 'hotel-mgmt', name: 'Welcomgroup Graduate School (WGSHA)', location: 'Manipal, India', fees: '₹3,50,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Hotel Management', website: 'https://manipal.edu/wgsha.html' },
  { id: 'hotel-3', career_id: 'hotel-mgmt', name: 'EHL Hospitality Business School', location: 'Lausanne, Switzerland', fees: 'CHF 35,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Hospitality', website: 'https://www.ehl.edu' },

  // Journalism
  { id: 'journ-1', career_id: 'journalism', name: 'IIMC Delhi', location: 'New Delhi, India', fees: '₹95,000/year', duration: '1 year (PGD)', ranking: 'Govt - Top Tier', specialization: 'Journalism', website: 'http://iimc.nic.in' },
  { id: 'journ-2', career_id: 'journalism', name: 'AJK MCRC, Jamia', location: 'New Delhi, India', fees: '₹80,000/year', duration: '2 years (MA)', ranking: 'Govt - Top Tier', specialization: 'Mass Comm', website: 'https://www.jmi.ac.in' },
  { id: 'journ-3', career_id: 'journalism', name: 'Asian College of Journalism (ACJ)', location: 'Chennai, India', fees: '₹4,60,000/year', duration: '1 year', ranking: 'Private - Top Tier', specialization: 'Journalism', website: 'https://www.asianmedia.org' },
  { id: 'journ-4', career_id: 'journalism', name: 'Columbia Journalism School', location: 'New York, USA', fees: '$70,000/year', duration: '1 year (MS)', ranking: 'Global #1', specialization: 'Journalism', website: 'https://journalism.columbia.edu' },

  // B.Sc Agri
  { id: 'agri-1', career_id: 'bsc-agri', name: 'IARI Delhi', location: 'New Delhi, India', fees: '₹10,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Agriculture', website: 'https://www.iari.res.in' },
  { id: 'agri-2', career_id: 'bsc-agri', name: 'GBPUAT Pantnagar', location: 'Pantnagar, India', fees: '₹40,000/year', duration: '4 years', ranking: 'Govt - Top Tier', specialization: 'Agriculture', website: 'https://www.gbpuat.ac.in' },
  { id: 'agri-3', career_id: 'bsc-agri', name: 'Cornell CALS', location: 'Ithaca, USA', fees: '$40,000/year', duration: '4 years', ranking: 'Global #1', specialization: 'Agriculture', website: 'https://cals.cornell.edu' },

  // BCA
  { id: 'bca-1', career_id: 'bca', name: 'Christ University', location: 'Bangalore, India', fees: '₹1,20,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Computer Applications', website: 'https://christuniversity.in' },
  { id: 'bca-2', career_id: 'bca', name: 'Symbiosis Institute of Computer Studies', location: 'Pune, India', fees: '₹1,50,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Computer Applications', website: 'https://www.sicsr.ac.in' },
  { id: 'bca-3', career_id: 'bca', name: 'Loyola College', location: 'Chennai, India', fees: '₹50,000/year', duration: '3 years', ranking: 'Private - Top Tier', specialization: 'Computer Applications', website: 'https://www.loyolacollege.edu' },

  // Advertising
  { id: 'adv-1', career_id: 'advertising', name: 'MICA Ahmedabad', location: 'Ahmedabad, India', fees: '₹21 Lakhs (Total)', duration: '2 years (PGDM)', ranking: 'Private - Top Tier', specialization: 'Advertising/Marketing', website: 'https://www.mica.ac.in' },
  { id: 'adv-2', career_id: 'advertising', name: 'XIC Mumbai', location: 'Mumbai, India', fees: '₹2,50,000/year', duration: '1 year', ranking: 'Private - Top Tier', specialization: 'Advertising', website: 'https://www.xaviercomm.org' }
];
