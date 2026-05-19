import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, isFirebaseConfigured, storage } from "../firebase";

const STORAGE_KEY = "eva_componentes_registros";

const publicProfile = (formData) => ({
  firstName: formData.firstName.trim(),
  lastName: formData.lastName.trim(),
  email: formData.email.trim().toLowerCase(),
  phone: formData.phone.trim(),
  address: formData.address.trim(),
  comments: formData.comments.trim(),
});

const storeLocally = (formData, avatarFile) => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const profile = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ...publicProfile(formData),
    avatarName: avatarFile?.name || null,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([profile, ...saved]));
  return { mode: "local", id: profile.id };
};

const authenticate = async ({ email, password, firstName, lastName }) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error.code !== "auth/email-already-in-use") {
      throw error;
    }

    return signInWithEmailAndPassword(auth, email, password);
  }
};

const uploadAvatar = async (userId, avatarFile) => {
  if (!avatarFile) {
    return null;
  }

  const safeFileName = avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const avatarRef = ref(storage, `clientes/${userId}/${Date.now()}-${safeFileName}`);
  await uploadBytes(avatarRef, avatarFile);
  return getDownloadURL(avatarRef);
};

export const registerCustomer = async (formData, avatarFile) => {
  if (!isFirebaseConfigured) {
    return storeLocally(formData, avatarFile);
  }

  const email = formData.email.trim().toLowerCase();
  const userCredential = await authenticate({
    email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
  });

  const user = userCredential.user;
  const displayName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
  await updateProfile(user, { displayName });

  const avatarUrl = await uploadAvatar(user.uid, avatarFile);
  const docRef = await addDoc(collection(db, "clientes"), {
    ...publicProfile({ ...formData, email }),
    uid: user.uid,
    avatarUrl,
    createdAt: serverTimestamp(),
  });

  return { mode: "firebase", id: docRef.id };
};
