import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/signin");
  }

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
          <Link to="/vendor-dashboard">
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