import { Component } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../hooks/useProducts";
import {
  addProductToCart,
  changeCartItemQuantity,
  clearCartItems,
  removeProductFromCart,
  getCartQuantity,
} from "../services/cartLogic";
import { saveUserCart, subscribeToUserCart } from "../services/cartService";
import CartSummary from "./CartSummary";
import ProductCard from "./ProductCard";

const totalCartUnits = (cart) =>
  cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

const formatCartUnits = (units) => `${units} ${units === 1 ? "producto" : "productos"}`;

class ProductCatalog extends Component {
  state = {
    cart: [],
    isCartLoading: false,
    isSavingCart: false,
    actionMessage: null,
    cartError: null,
  };

  componentDidMount() {
    document.title = "Productos | Eva Store";
    this.syncCartWithUser(this.props.user);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user?.uid !== this.props.user?.uid) {
      this.syncCartWithUser(this.props.user);
    }

    if (totalCartUnits(prevState.cart) !== totalCartUnits(this.state.cart)) {
      document.title = `${formatCartUnits(totalCartUnits(this.state.cart))} | Eva Store`;
    }
  }

  componentWillUnmount() {
    this.unsubscribeCart?.();
  }

  syncCartWithUser = (user) => {
    this.unsubscribeCart?.();

    if (!user) {
      this.setState({
        cart: [],
        isCartLoading: false,
        cartError: null,
      });
      return;
    }

    this.setState({ isCartLoading: true, cartError: null });

    this.unsubscribeCart = subscribeToUserCart(
      user.uid,
      (cart) => {
        this.setState({
          cart,
          isCartLoading: false,
          cartError: null,
        });
      },
      (error) => {
        this.setState({
          isCartLoading: false,
          cartError: `No se pudo cargar el carrito: ${error.message}`,
        });
      },
    );
  };

  persistCart = async (nextCart, actionMessage) => {
    const { user } = this.props;

    if (!user) {
      this.setState({
        actionMessage: "Inicia sesión para guardar tu carrito.",
      });
      return;
    }

    this.setState({
      cart: nextCart,
      actionMessage,
      cartError: null,
      isSavingCart: true,
    });

    try {
      await saveUserCart(user.uid, nextCart);
    } catch (error) {
      this.setState({
        cartError: `No se pudo guardar el carrito: ${error.message}`,
      });
    } finally {
      this.setState({ isSavingCart: false });
    }
  };

  handleAddProduct = (product) => {
    if (!this.props.user) {
      this.setState({
        actionMessage: "Inicia sesión para agregar productos al carrito.",
      });
      return;
    }

    const result = addProductToCart(this.state.cart, product);
    const actionMessage =
      result.status === "stock-limit"
        ? `No puedes agregar más unidades de ${product.name}; stock disponible: ${product.stock}.`
        : `${product.name} agregado al carrito.`;

    this.persistCart(result.items, actionMessage);
  };

  handleChangeProductQuantity = (product, nextQuantity) => {
    const result = changeCartItemQuantity(this.state.cart, product, nextQuantity);
    const actionMessage =
      result.status === "stock-limit"
        ? `Cantidad ajustada al stock disponible de ${product.stock}.`
        : "Carrito actualizado.";

    this.persistCart(result.items, actionMessage);
  };

  handleRemoveProduct = (productId) => {
    this.persistCart(removeProductFromCart(this.state.cart, productId), "Producto eliminado.");
  };

  handleClearCart = () => {
    this.persistCart(clearCartItems(), "Carrito vaciado.");
  };

  render() {
    const { products, isProductsLoading, productSource, productError, user, isAuthReady } =
      this.props;
    const { cart, isCartLoading, isSavingCart, actionMessage, cartError } = this.state;

    return (
      <section className="catalog-section">
        <div className="container py-5">
          <div className="row align-items-end g-4 mb-4">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold mb-2">Productos destacados</h1>
              <p className="lead text-secondary mb-0">
                Explora el catálogo, agrega lo que necesites y mantén tu carrito
                guardado al iniciar sesión.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <span className="badge text-bg-primary fs-6">
                {products.length} productos disponibles
              </span>
              <div className="small text-secondary mt-2">
                Inventario: {productSource === "firebase" ? "actualizado" : "de muestra"}
              </div>
            </div>
          </div>

          {actionMessage && (
            <div className="alert alert-info" role="status">
              {actionMessage}
            </div>
          )}

          {productError && (
            <div className="alert alert-warning" role="alert">
              No pudimos cargar el inventario actualizado. Mostrando catálogo de muestra.
            </div>
          )}

          {cartError && (
            <div className="alert alert-danger" role="alert">
              {cartError}
            </div>
          )}

          <div className="row g-4">
            <div className="col-lg-8">
              {isProductsLoading ? (
                <p>Cargando productos...</p>
              ) : (
                <div className="row g-4">
                  {products.map((product) => (
                    <div className="col-md-6" key={product.id}>
                      <ProductCard
                        product={product}
                        cartQuantity={getCartQuantity(cart, product.id)}
                        isAuthenticated={Boolean(user)}
                        onAddProduct={this.handleAddProduct}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-lg-4">
              <CartSummary
                cart={cart}
                products={products}
                user={user}
                isAuthReady={isAuthReady}
                isCartLoading={isCartLoading}
                isSavingCart={isSavingCart}
                onChangeQuantity={this.handleChangeProductQuantity}
                onRemoveProduct={this.handleRemoveProduct}
                onClearCart={this.handleClearCart}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default function ProductCatalogRoute() {
  const { user, isAuthReady } = useAuth();
  const { products, source, error, isLoading } = useProducts();

  return (
    <ProductCatalog
      user={user}
      isAuthReady={isAuthReady}
      products={products}
      productSource={source}
      productError={error}
      isProductsLoading={isLoading}
    />
  );
}
