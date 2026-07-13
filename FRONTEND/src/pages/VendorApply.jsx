import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";
import "./VendorApply.css";

const FOOD_CATEGORIES = [
  "Nigerian Cuisine",
  "Fast Food",
  "Grills & Suya",
  "Rice & Swallow",
  "Snacks & Pastries",
  "Drinks & Smoothies",
  "Chinese / Continental",
  "Shawarma & Wraps",
  "Pizza & Burgers",
  "Other",
];

export default function VendorApply() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [category, setCategory] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!category) {
      setErrorMessage("Please select a food category.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 11) {
      setErrorMessage("Enter a valid Nigerian phone number (e.g. 08012345678).");
      return;
    }

    if (!email) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://counterai-backend.onrender.com/api/vendor/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          location,
          phone,
          email,
          password,
          category,
          menuDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("pendingEmail", email);
      sessionStorage.setItem("pendingVendorId", data.vendorId);
      if (data.devOtp) {
        sessionStorage.setItem("pendingDevOtp", data.devOtp);
      } else {
        sessionStorage.removeItem("pendingDevOtp");
      }

      navigate("/verify-phone");
    } catch (error) {
      setErrorMessage("Failed to connect to server.");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-page apply-page">
        <div className="auth-card apply-card card">
          <div className="apply-header">
            <span className="apply-badge">Vendor Application</span>
            <h1>Set up your store</h1>
            <p className="subtitle">
              Tell us about your business. Our team reviews every application
              before granting access.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Spice Paradise"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g. Wuse 2, Abuja"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Food Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {FOOD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Brief Menu Description</label>
              <textarea
                placeholder="Describe what you sell — your signature dishes, price range, and what makes your food special."
                value={menuDescription}
                onChange={(e) => setMenuDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <div className="apply-info-box">
              <span className="info-icon">ℹ</span>
              <p>
                After submitting, you'll verify your email with a
                one-time code. Your application then goes to our admin team for
                review — usually within 24 hours.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}