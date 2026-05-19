import { collection, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { products as seedProducts } from "../data/products";

const normalizeProduct = (docSnapshot) => {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    name: data.name || data.nameSnapshot || "Producto sin nombre",
    category: data.category || "General",
    price: Number(data.price) || 0,
    stock: Number(data.stock) || 0,
    image: data.image || "",
    description: data.description || "",
  };
};

const sortProducts = (products) =>
  [...products].sort((left, right) => left.name.localeCompare(right.name, "es"));

export const subscribeToProducts = (onProducts, onError) => {
  if (!isFirebaseConfigured || !db) {
    onProducts(seedProducts, "local");
    return () => {};
  }

  return onSnapshot(
    collection(db, "productos"),
    (snapshot) => {
      const firebaseProducts = sortProducts(snapshot.docs.map(normalizeProduct));
      const hasFirebaseProducts = firebaseProducts.length > 0;
      onProducts(
        hasFirebaseProducts ? firebaseProducts : seedProducts,
        hasFirebaseProducts ? "firebase" : "local",
      );
    },
    (error) => {
      onError?.(error);
      onProducts(seedProducts, "local");
    },
  );
};
