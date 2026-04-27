// firebaseConfig.js

import { initializeApp } from "firebase/app";

// ✅ ADD THESE IMPORTS
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// paste YOUR config here
const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "XXXX",
  projectId: "XXXX",
  storageBucket: "XXXX",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (VERY IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;