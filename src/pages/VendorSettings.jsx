import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import "./VendorDashboard.css";
import "./VendorSettings.css";

export default function VendorSettings() {
  // Store profile section
  const [storeName, setStoreName] = useState("Spice Paradise");
  const [location, setLocation] = useState("Wuse 2, Abuja");
  const [phone, setPhone] = useState("08012345678");
  const [category, setCategory] = useState("Nigerian Cuisine");
  const [bio, setBio] = useState(
    "Authentic Nigerian flavors made fresh daily. Known for our smoky party jollof and pepper soup."
  );
  const [storeSuccess, setStoreSuccess] = useState("");

  // Notifications section
  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(false);
  const [notifyPromo, setNotifyPromo] = useState(true);

  // Password section
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  function handleStoreSave(e) {
    e.preventDefault();
    // In production, POST to /api/vendor/profile
    setStoreSuccess("Store details saved.");
    setTimeout(() => setStoreSuccess(""), 3000);
  }

  function handlePasswordSave(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    // In production, POST to /api/auth/change-password
    setPasswordSuccess("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(""), 3000);
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/" className="brand">
          Counter<span>AI</span>
        </Link>
        <p className="sidebar-label">Vendor Dashboard</p>
        <nav className="sidebar-nav">
          <Link to="/vendor">Dashboard</Link>
          <Link to="/vendor/orders">Orders</Link>
          <Link to="/vendor/menu">Menu Builder</Link>
          <Link to="/vendor/customers">Customers</Link>
          <Link to="/vendor/settings" className="active">Settings</Link>
        </nav>
        <div className="profile-box card">
          <div className="avatar-circle">SP</div>
          <div>
            <p className="profile-name">Spice Paradise</p>
            <p className="profile-location">Wuse 2, Abuja</p>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your store profile and account preferences.</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="settings-grid">
          {/* Store Profile */}
          <div className="card settings-card">
            <h3 className="settings-section-title">Store Profile</h3>
            <form onSubmit={handleStoreSave}>
              <div className="settings-form-row">
                <div className="form-group">
                  <label>Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Store Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {storeSuccess && <p className="success-text">{storeSuccess}</p>}

              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </form>
          </div>

          {/* Notifications */}
          <div className="card settings-card">
            <h3 className="settings-section-title">Notifications</h3>
            <div className="notif-list">
              <div className="notif-row">
                <div>
                  <p className="notif-title">New Order Alerts</p>
                  <p className="notif-desc">Get notified when a customer places an order.</p>
                </div>
                <button
                  className={"switch" + (notifyNewOrder ? " on" : "")}
                  onClick={() => setNotifyNewOrder((v) => !v)}
                />
              </div>
              <div className="notif-row">
                <div>
                  <p className="notif-title">Low Stock Warnings</p>
                  <p className="notif-desc">Alert when an item is marked unavailable for 3+ days.</p>
                </div>
                <button
                  className={"switch" + (notifyLowStock ? " on" : "")}
                  onClick={() => setNotifyLowStock((v) => !v)}
                />
              </div>
              <div className="notif-row">
                <div>
                  <p className="notif-title">Promotions & Updates</p>
                  <p className="notif-desc">Platform news and feature announcements.</p>
                </div>
                <button
                  className={"switch" + (notifyPromo ? " on" : "")}
                  onClick={() => setNotifyPromo((v) => !v)}
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card settings-card">
            <h3 className="settings-section-title">Change Password</h3>
            <form onSubmit={handlePasswordSave}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {passwordError && <p className="error-text">{passwordError}</p>}
              {passwordSuccess && <p className="success-text">{passwordSuccess}</p>}

              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="card settings-card danger-card">
            <h3 className="settings-section-title danger-title">Danger Zone</h3>
            <p className="danger-desc">
              Deactivating your account will hide your store from customers. You
              can reactivate by contacting support.
            </p>
            <button className="btn btn-danger">Deactivate Store</button>
          </div>
        </div>
      </main>
    </div>
  );
}
