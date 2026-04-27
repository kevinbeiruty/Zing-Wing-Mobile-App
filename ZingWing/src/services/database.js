import app from "../firebase/firebaseConfig";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(app);

// CREATE
export const addItem = async (item) => {
  await addDoc(collection(db, "items"), item);
};

// READ
export const getItems = async () => {
  const querySnapshot = await getDocs(collection(db, "items"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// UPDATE
export const updateItem = async (id, updatedData) => {
  const itemRef = doc(db, "items", id);
  await updateDoc(itemRef, updatedData);
};

// DELETE
export const deleteItem = async (id) => {
  const itemRef = doc(db, "items", id);
  await deleteDoc(itemRef);
};