import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (role === "vendor") {
      navigate("/vendor-apply");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }

      navigate("/signin");
    } catch (error) {
      setErrorMessage("Failed to connect to server.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card card">
          <h1>Create Account</h1>
          <p className="subtitle">Join CounterAI as a customer or a vendor.</p>

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

          {role === "vendor" && (
            <div className="vendor-hint">
              <p>
                Vendor accounts go through a short application and phone
                verification before approval. Tap below to get started.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {role === "customer" && (
              <>
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

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

                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button type="submit" className="btn btn-primary full-width">
              {role === "vendor"
                ? "Start Vendor Application →"
                : "Create Customer Account"}
            </button>
          </form>

          <p className="switch-text">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
