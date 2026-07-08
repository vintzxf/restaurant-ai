import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { getSession, clearSession } from "../utils/auth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // getSession() returns null if there's no session OR if it has expired —
  // so this line also enforces "log out automatically once the session expires."
  const user = getSession();

  function handleLogout() {
    clearSession();
    navigate("/signin");
  }

  const greetingLabel = user?.role === "vendor" ? "vendor" : "user";
  const displayName = user?.businessName || user?.name || greetingLabel;

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/">
          Counter<span>AI</span>
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>

        {user && <Link to="/orders">Orders</Link>}

        {user && <Link to="/favourites">Favourites</Link>}

        {user?.role === "vendor" && (
          <Link to="/vendor">
            Dashboard
          </Link>
        )}
      </nav>

      <div className="nav-right">
        <span className="pill">Lagos, Nigeria</span>

        <ThemeToggle />

        {user && (
          <Link to="/cart" className="cart">
            Cart
          </Link>
        )}

        {user && (
          <span className="pill greeting">
            Hello, {displayName}
          </span>
        )}

        {!user ? (
          <>
            <Link to="/signin" className="btn btn-outline">
              Sign In
            </Link>

            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="btn btn-outline"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;