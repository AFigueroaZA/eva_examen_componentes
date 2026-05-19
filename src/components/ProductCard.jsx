import { Link } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import { formatPrice } from "../data/products";

export default function ProductCard({ product, cartQuantity, isAuthenticated, onAddProduct }) {
  const stock = Number(product.stock) || 0;
  const isOutOfStock = stock <= 0;
  const reachedStock = cartQuantity >= stock && stock > 0;
  const isDisabled = !isAuthenticated || isOutOfStock || reachedStock;
  const buttonLabel = !isAuthenticated
    ? "Inicia sesión"
    : isOutOfStock
      ? "Sin stock"
      : reachedStock
        ? "Límite alcanzado"
        : "Agregar";

  return (
    <article className="product-card h-100 bg-white border">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="p-3 d-flex flex-column gap-3 flex-grow-1">
        <div>
          <div className="d-flex justify-content-between align-items-start gap-2">
            <span className="badge text-bg-light border">{product.category}</span>
            <span className="small text-secondary">
              Stock: {stock} - En carrito: {cartQuantity}
            </span>
          </div>
          <h2 className="h5 mt-3 mb-1">{product.name}</h2>
          <p className="text-secondary small mb-0">{product.description}</p>
        </div>
        <div className="mt-auto d-flex align-items-center justify-content-between gap-2">
          <strong>{formatPrice(product.price)}</strong>
          <div className="btn-group">
            <Link className="btn btn-outline-secondary btn-sm" to={`/producto/${product.id}`}>
              <Eye size={16} aria-hidden="true" />
              <span className="visually-hidden">Ver detalle</span>
            </Link>
            <button
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
              type="button"
              onClick={() => onAddProduct(product)}
              disabled={isDisabled}
            >
              <ShoppingCart size={16} aria-hidden="true" />
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
