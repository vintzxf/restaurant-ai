import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { menuItems as initialMenuItems } from "../data.js";
import "./VendorDashboard.css";
import "./VendorMenu.css";

const EMPTY_FORM = {
  name: "",
  tagline: "",
  price: "",
  category: "",
  available: true,
};

export default function VendorMenu() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAvailability(id) {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  }

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrorMessage("");
    setShowForm(true);
  }

  function openEditForm(item) {
    setForm({
      name: item.name,
      tagline: item.tagline,
      price: item.price,
      category: item.category || "",
      available: item.available,
    });
    setEditingId(item.id);
    setErrorMessage("");
    setShowForm(true);
  }

  function handleSave(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      setErrorMessage("Name and price are required.");
      return;
    }

    if (editingId !== null) {
      // Edit existing
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
    } else {
      // Add new — generate a simple id
      const newItem = {
        ...form,
        id: Date.now(),
      };
      setMenuItems((prev) => [...prev, newItem]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id) {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setErrorMessage("");
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
          <Link to="/vendor/menu" className="active">Menu Builder</Link>
          <Link to="/vendor/customers">Customers</Link>
          <Link to="/vendor/settings">Settings</Link>
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
            <h1>Menu Builder</h1>
            <p>Add, edit, and toggle items on your menu.</p>
          </div>
          <div className="dash-actions">
            <ThemeToggle />
            <button className="btn btn-primary" onClick={openAddForm}>
              + Add Item
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card menu-form-card">
            <h3>{editingId !== null ? "Edit Item" : "Add New Item"}</h3>
            <form onSubmit={handleSave}>
              <div className="menu-form-row">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jollof Rice"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₦2,500"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Smoky party jollof with fried plantain"
                  value={form.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Rice Dishes"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </div>

              <div className="form-check">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => handleChange("available", e.target.checked)}
                  />
                  Available for ordering
                </label>
              </div>

              {errorMessage && <p className="error-text">{errorMessage}</p>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId !== null ? "Save Changes" : "Add to Menu"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="menu-grid">
          {menuItems.length === 0 ? (
            <div className="card empty-menu">
              <p>No items yet. Click <strong>+ Add Item</strong> to get started.</p>
            </div>
          ) : (
            menuItems.map((item) => (
              <div
                key={item.id}
                className={"card menu-item-card" + (item.available ? "" : " unavailable")}
              >
                <div className="menu-item-top">
                  <div>
                    <p className="menu-name">{item.name}</p>
                    <p className="menu-tagline">{item.tagline}</p>
                  </div>
                  <p className="menu-price">{item.price}</p>
                </div>

                {item.category && (
                  <span className="category-pill">{item.category}</span>
                )}

                <div className="menu-item-actions">
                  <button
                    className={"switch" + (item.available ? " on" : "")}
                    onClick={() => toggleAvailability(item.id)}
                    title={item.available ? "Mark unavailable" : "Mark available"}
                  />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => openEditForm(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
