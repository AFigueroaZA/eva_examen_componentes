import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn, user, isAuthReady } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!form.email.trim() || !form.password.trim()) {
      setStatus({ type: "danger", message: "Ingresa correo y clave." });
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      setForm(initialForm);
      navigate("/");
    } catch (error) {
      setStatus({
        type: "danger",
        message: `No se pudo iniciar sesión: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="form-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <form className="form-card bg-white border" onSubmit={handleSubmit}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <LogIn size={32} aria-hidden="true" />
                <div>
                  <h1 className="h2 mb-1">Iniciar sesión</h1>
                  <p className="text-secondary mb-0">
                    Entra a tu cuenta para continuar con tu carrito donde lo dejaste.
                  </p>
                </div>
              </div>

              {user && isAuthReady && (
                <div className="alert alert-success" role="alert">
                  Ya tienes sesión iniciada como {user.email}.
                </div>
              )}

              {status && (
                <div className={`alert alert-${status.type}`} role="alert">
                  {status.message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label" htmlFor="loginEmail">
                  Correo
                </label>
                <input
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="loginPassword">
                  Clave
                </label>
                <input
                  className="form-control"
                  id="loginPassword"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                <Link className="btn btn-outline-secondary" to="/registro">
                  Crear cuenta
                </Link>
                <button
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <LogIn size={18} aria-hidden="true" />
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
