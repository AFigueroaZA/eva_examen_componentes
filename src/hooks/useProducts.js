import { useEffect, useState } from "react";
import { products as seedProducts } from "../data/products";
import { subscribeToProducts } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState(seedProducts);
  const [source, setSource] = useState("local");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (nextProducts, nextSource) => {
        setProducts(nextProducts);
        setSource(nextSource);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { products, source, error, isLoading };
}
