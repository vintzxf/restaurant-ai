import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
export default function SignIn() {
  const navigate = useNavigate();

  // which kind of account is signing in
  const [role, setRole] = useState("customer");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); 

    // send vendors to the dashboard, customers to the home page
    if (role === "vendor") {
      navigate("/vendor-dashboard");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to continue to CounterAI.</p>

        {/* toggle between customer and vendor */}
        <div className="role-toggle">
          <button
            type="button"
            className={role === "customer" ? "active" : ""}
            onClick={() => setRole("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={role === "vendor" ? "active" : ""}
            onClick={() => setRole("vendor")}
          >
            Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary full-width">
            Sign In as {role === "vendor" ? "Vendor" : "Customer"}
          </button>
        </form>

        <p className="switch-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
