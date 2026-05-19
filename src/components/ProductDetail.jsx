import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "../data/products";
import { useProducts } from "../hooks/useProducts";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, isLoading } = useProducts();
  const product = products.find((item) => item.id === id);

  useEffect(() => {
    document.title = product ? `${product.name} | Eva Store` : "Producto no encontrado | Eva Store";
  }, [product]);

  if (isLoading) {
    return (
      <main className="container py-5">
        <p>Cargando producto...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-5">
        <h1 className="h3">Producto no encontrado</h1>
        <Link className="btn btn-primary mt-3" to="/">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <Link className="btn btn-outline-secondary btn-sm mb-4" to="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Volver
      </Link>
      <div className="row g-4 align-items-center">
        <div className="col-lg-6">
          <img className="detail-image" src={product.image} alt={product.name} />
        </div>
        <div className="col-lg-6">
          <span className="badge text-bg-light border mb-3">{product.category}</span>
          <h1 className="display-6 fw-bold">{product.name}</h1>
          <p className="lead text-secondary">{product.description}</p>
          <dl className="row">
            <dt className="col-sm-3">Precio</dt>
            <dd className="col-sm-9">{formatPrice(product.price)}</dd>
            <dt className="col-sm-3">Stock</dt>
            <dd className="col-sm-9">{product.stock} unidades</dd>
          </dl>
        </div>
      </div>
    </main>
  );
}
