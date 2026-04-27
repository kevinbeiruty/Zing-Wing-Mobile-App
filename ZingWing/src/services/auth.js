import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
