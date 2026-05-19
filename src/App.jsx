import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProductCatalog from "./components/ProductCatalog";
import StaticFooter from "./components/StaticFooter";

const ProductDetail = lazy(() => import("./components/ProductDetail"));
const RegistrationForm = lazy(() => import("./components/RegistrationForm"));
const LoginForm = lazy(() => import("./components/LoginForm"));

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Suspense
        fallback={
          <main className="container py-5">
            <p className="mb-0">Cargando vista...</p>
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/registro" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Suspense>
      <StaticFooter />
    </div>
  );
}
