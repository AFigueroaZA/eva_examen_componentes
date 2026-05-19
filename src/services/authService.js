import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

export const signInUser = (email, password) => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase no está configurado.");
  }

  return signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
};

export const signOutUser = () => {
  if (!isFirebaseConfigured || !auth) {
    return Promise.resolve();
  }

  return signOut(auth);
};
