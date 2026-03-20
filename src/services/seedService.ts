import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { DEFAULT_CAREERS_FLAT, DEFAULT_UNIVERSITIES } from '../data/defaultCareers';

export const seedDatabase = async () => {
  try {
    const careersRef = collection(db, 'careers');
    const collegesRef = collection(db, 'colleges');

    // 1. Seed careers
    const careersSnapshot = await getDocs(careersRef);
    const existingCareerIds = new Set(careersSnapshot.docs.map(doc => doc.id));
    
    const careersToSeed = DEFAULT_CAREERS_FLAT.filter(c => !existingCareerIds.has(c.id));
    
    if (careersToSeed.length > 0) {
      console.log(`Seeding ${careersToSeed.length} missing careers...`);
      const batch = writeBatch(db);
      careersToSeed.forEach((career) => {
        const careerDoc = doc(careersRef, career.id);
        batch.set(careerDoc, career, { merge: true });
      });
      await batch.commit();
      console.log('Careers data updated.');
    }

    // 2. Seed colleges
    const collegesSnapshot = await getDocs(collegesRef);
    const existingCollegeIds = new Set(collegesSnapshot.docs.map(doc => doc.id));
    
    const collegesToSeed: any[] = [];
    Object.entries(DEFAULT_UNIVERSITIES).forEach(([careerId, universities]) => {
      universities.forEach((uni, index) => {
        const collegeId = `${careerId}_college_${index}`;
        if (!existingCollegeIds.has(collegeId)) {
          collegesToSeed.push({ id: collegeId, data: { ...uni, career_id: careerId } });
        }
      });
    });

    if (collegesToSeed.length > 0) {
      console.log(`Seeding ${collegesToSeed.length} missing colleges...`);
      // Firestore batch limit is 500. If we have more, we need multiple batches.
      for (let i = 0; i < collegesToSeed.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = collegesToSeed.slice(i, i + 500);
        chunk.forEach((item) => {
          const collegeDoc = doc(collegesRef, item.id);
          batch.set(collegeDoc, item.data, { merge: true });
        });
        await batch.commit();
      }
      console.log('Colleges data updated.');
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};
