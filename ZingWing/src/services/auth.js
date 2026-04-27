import { auth } from "../firebase/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth(app);

// register
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// login
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// logout
export const logoutUser = () => {
  return signOut(auth);
};