import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addProductToCart,
  changeCartItemQuantity,
  getCartQuantity,
  removeProductFromCart,
} from "../src/services/cartLogic.js";

const product = {
  id: "notebook-pro",
  name: "Notebook Pro 14",
  price: 899990,
  stock: 2,
};

describe("cart stock logic", () => {
  it("adds a product with a Firebase-ready snapshot", () => {
    const result = addProductToCart([], product);

    assert.equal(result.status, "added");
    assert.deepEqual(result.items, [
      {
        productId: "notebook-pro",
        quantity: 1,
        nameSnapshot: "Notebook Pro 14",
        priceSnapshot: 899990,
      },
    ]);
  });

  it("prevents adding more units than available stock", () => {
    const first = addProductToCart([], product);
    const second = addProductToCart(first.items, product);
    const third = addProductToCart(second.items, product);

    assert.equal(second.status, "added");
    assert.equal(third.status, "stock-limit");
    assert.equal(getCartQuantity(third.items, "notebook-pro"), 2);
  });

  it("does not add products without stock", () => {
    const result = addProductToCart([], { ...product, stock: 0 });

    assert.equal(result.status, "stock-limit");
    assert.deepEqual(result.items, []);
  });

  it("clamps manual quantity changes and removes items at zero", () => {
    const overStock = changeCartItemQuantity([], product, 5);
    const removed = removeProductFromCart(overStock.items, "notebook-pro");

    assert.equal(overStock.status, "stock-limit");
    assert.equal(getCartQuantity(overStock.items, "notebook-pro"), 2);
    assert.deepEqual(removed, []);
  });
});
