import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Uncomment the next line if you use analytics
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAsl3Au0w2kttz_fDu4Ik3n9FALRRlYZQI",
  authDomain: "project-cost-tracker-f05f8.firebaseapp.com",
  projectId: "project-cost-tracker-f05f8",
  storageBucket: "project-cost-tracker-f05f8.appspot.com",
  messagingSenderId: "340730997595",
  appId: "1:340730997595:web:b621be71c0ab77bd6d087e",
  measurementId: "G-W8LFXR47D0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Uncomment the next line if you use analytics
// export const analytics = getAnalytics(app);

export default app;