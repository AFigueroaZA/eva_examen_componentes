import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../data/products";

const findProduct = (products, item) =>
  products.find((product) => product.id === item.productId) || {
    id: item.productId,
    name: item.nameSnapshot,
    price: item.priceSnapshot,
    stock: item.quantity,
  };

export default function CartSummary({
  cart,
  products,
  user,
  isAuthReady,
  isCartLoading,
  isSavingCart,
  onChangeQuantity,
  onRemoveProduct,
  onClearCart,
}) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const rows = cart.map((item) => {
    const product = findProduct(products, item);
    return { item, product };
  });
  const total = rows.reduce(
    (sum, row) => sum + row.item.quantity * Number(row.product.price || row.item.priceSnapshot),
    0,
  );

  return (
    <aside className="cart-panel bg-white border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 mb-1">Carrito</h2>
          <p className="small text-secondary mb-0">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </p>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          type="button"
          onClick={onClearCart}
          disabled={!user || cart.length === 0 || isSavingCart}
        >
          Vaciar
        </button>
      </div>

      {!isAuthReady ? (
        <p className="empty-state mb-0">Cargando sesión...</p>
      ) : !user ? (
        <div className="empty-state">
          <p className="mb-3">Inicia sesión para guardar tu carrito y retomarlo después.</p>
          <Link className="btn btn-primary btn-sm" to="/login">
            Iniciar sesión
          </Link>
        </div>
      ) : isCartLoading ? (
        <p className="empty-state mb-0">Cargando carrito...</p>
      ) : cart.length === 0 ? (
        <p className="empty-state mb-0">
          Tu carrito está vacío por ahora. Agrega un producto del catálogo para comenzar.
        </p>
      ) : (
        <>
          <ul className="list-group list-group-flush">
            {rows.map(({ item, product }) => (
              <li
                className="list-group-item px-0 d-flex justify-content-between align-items-center gap-3"
                key={item.productId}
              >
                <div className="flex-grow-1">
                  <strong className="d-block">{product.name}</strong>
                  <span className="small text-secondary">
                    {formatPrice(Number(product.price || item.priceSnapshot))} - Stock {product.stock}
                  </span>
                  <div className="quantity-control mt-2" aria-label={`Cantidad de ${product.name}`}>
                    <button
                      className="btn btn-outline-secondary btn-sm icon-button"
                      type="button"
                      onClick={() => onChangeQuantity(product, item.quantity - 1)}
                      disabled={isSavingCart}
                      aria-label={`Restar ${product.name}`}
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm icon-button"
                      type="button"
                      onClick={() => onChangeQuantity(product, item.quantity + 1)}
                      disabled={isSavingCart || item.quantity >= Number(product.stock || 0)}
                      aria-label={`Sumar ${product.name}`}
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm icon-button"
                  type="button"
                  onClick={() => onRemoveProduct(item.productId)}
                  disabled={isSavingCart}
                  aria-label={`Quitar ${product.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span className="text-secondary">Total</span>
            <strong className="fs-5">{formatPrice(total)}</strong>
          </div>
          {isSavingCart && <p className="small text-secondary mt-2 mb-0">Guardando carrito...</p>}
        </>
      )}
    </aside>
  );
}
