import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDyV_dudj0upTO7lzU2DmnIPaTqq_jsu2I',
  authDomain: 'underground-lp.firebaseapp.com',
  projectId: 'underground-lp',
  storageBucket: 'underground-lp.firebasestorage.app',
  messagingSenderId: '936563611668',
  appId: '1:936563611668:web:3958527f0580d699266f01',
  measurementId: 'G-3SGQY44VVY',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
