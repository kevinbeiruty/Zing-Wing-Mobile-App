// firebaseConfig.js

import { initializeApp } from "firebase/app";

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

export default app;