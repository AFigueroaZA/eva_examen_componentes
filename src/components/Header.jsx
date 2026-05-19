import { NavLink } from "react-router-dom";
import { Database, LogOut, Package, ShoppingBag, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../firebaseConfig";

const navClassName = ({ isActive }) =>
  `nav-link px-3 ${isActive ? "active fw-semibold" : ""}`;

export default function Header() {
  const { displayName, isAuthReady, signOut, user } = useAuth();

  return (
    <header className="app-header border-bottom bg-white">
      <nav className="navbar navbar-expand-lg">
        <div className="container py-2">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <ShoppingBag size={24} aria-hidden="true" />
            Eva Store
          </NavLink>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="navbar-nav flex-row gap-1">
              <NavLink className={navClassName} to="/" end>
                Productos
              </NavLink>
              <NavLink className={navClassName} to="/registro">
                Registro
              </NavLink>
              {!user && isAuthReady && (
                <NavLink className={navClassName} to="/login">
                  Login
                </NavLink>
              )}
            </div>
            {user && (
              <div className="user-chip">
                <UserCircle size={16} aria-hidden="true" />
                <span className="text-truncate">{displayName}</span>
                <button
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                  type="button"
                  onClick={signOut}
                >
                  <LogOut size={14} aria-hidden="true" />
                  Salir
                </button>
              </div>
            )}
            <span
              className={`d-none d-md-inline-flex align-items-center gap-2 badge rounded-pill ${
                isFirebaseConfigured ? "text-bg-success" : "text-bg-secondary"
              }`}
            >
              {isFirebaseConfigured ? (
                <Database size={14} aria-hidden="true" />
              ) : (
                <Package size={14} aria-hidden="true" />
              )}
              {isFirebaseConfigured ? "Firebase activo" : "Modo demo"}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
