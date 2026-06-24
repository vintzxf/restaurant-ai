import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/">
          Counter<span>AI</span>
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/Restaurants">Restaurants</Link>
        <Link to="/Orders">Orders</Link>
        <Link to="/Favourites">Favourites</Link>
      </nav>

      <div className="nav-right">
        <span className="pill">Lagos, Nigeria</span>
        <ThemeToggle />

        <Link to="/Cart" className="cart">Cart</Link>

        <Link to="/signin" className="btn btn-outline">
          Sign In
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
