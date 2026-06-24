import { Link } from "react-router-dom";
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
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>

      <div className="nav-right">
        <span className="pill">Lagos, Nigeria</span>

        <span className="cart">Cart</span>

        <Link to="/signin" className="btn btn-outline">
          Sign In
        </Link>
      </div>
    </header>
  );
}

export default Navbar;