import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";
export default function SignIn() {
  const navigate = useNavigate();


  const [role, setRole] = useState("customer");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }

      // save logged in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // redirect based on role stored in database
      if (data.user.role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to server");
    }
  }

  return (
    <>
      <Navbar />
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


            {errorMessage && (
              <p className="error-text">{errorMessage}</p>
            )}
            <button type="submit" className="btn btn-primary full-width">
              Sign In as {role === "vendor" ? "Vendor" : "Customer"}
            </button>
          </form>

          <p className="switch-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
