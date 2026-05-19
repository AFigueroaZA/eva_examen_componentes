const clampQuantity = (quantity, stock) => {
  const numericQuantity = Number(quantity) || 0;
  const numericStock = Math.max(Number(stock) || 0, 0);
  return Math.min(Math.max(numericQuantity, 0), numericStock);
};

const createSnapshot = (product, quantity) => ({
  productId: product.id,
  quantity,
  nameSnapshot: product.name,
  priceSnapshot: product.price,
});

export const getCartQuantity = (items, productId) => {
  const item = items.find((cartItem) => cartItem.productId === productId);
  return item?.quantity || 0;
};

export const changeCartItemQuantity = (items, product, nextQuantity) => {
  const quantity = clampQuantity(nextQuantity, product.stock);
  const status = quantity < nextQuantity ? "stock-limit" : "updated";
  const withoutProduct = items.filter((item) => item.productId !== product.id);

  if (quantity === 0) {
    return {
      items: withoutProduct,
      status: status === "stock-limit" ? "stock-limit" : "removed",
    };
  }

  return {
    items: [...withoutProduct, createSnapshot(product, quantity)],
    status,
  };
};

export const addProductToCart = (items, product) => {
  const currentQuantity = getCartQuantity(items, product.id);
  const result = changeCartItemQuantity(items, product, currentQuantity + 1);
  return {
    ...result,
    status: result.status === "stock-limit" ? "stock-limit" : "added",
  };
};

export const removeProductFromCart = (items, productId) =>
  items.filter((item) => item.productId !== productId);

export const clearCartItems = () => [];
