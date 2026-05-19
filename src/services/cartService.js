import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";

const normalizeCartItems = (items) =>
  Array.isArray(items)
    ? items
        .filter((item) => item.productId && Number(item.quantity) > 0)
        .map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          nameSnapshot: item.nameSnapshot || "Producto",
          priceSnapshot: Number(item.priceSnapshot) || 0,
        }))
    : [];

export const subscribeToUserCart = (uid, onCart, onError) => {
  if (!uid || !isFirebaseConfigured || !db) {
    onCart([], "local");
    return () => {};
  }

  return onSnapshot(
    doc(db, "carritos", uid),
    (snapshot) => {
      onCart(normalizeCartItems(snapshot.data()?.items), "firebase");
    },
    (error) => {
      onError?.(error);
      onCart([], "local");
    },
  );
};

export const saveUserCart = (uid, items) => {
  if (!uid || !isFirebaseConfigured || !db) {
    return Promise.resolve();
  }

  return setDoc(
    doc(db, "carritos", uid),
    {
      items: normalizeCartItems(items),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
