import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC17NBKH13hV2Y8g22bkEdoKI-9FPVxXY0',
  authDomain: 'privateproject01.firebaseapp.com',
  projectId: 'privateproject01',
  storageBucket: 'privateproject01.appspot.com',
  messagingSenderId: '263502847078',
  appId: '1:263502847078:web:81167da54a82ba13e5a1a7',
  measurementId: 'G-DQJ30GRXT6',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
