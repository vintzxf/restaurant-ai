import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { getSession } from "../utils/auth.js";
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
  const user = getSession();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/api/restaurants/mine", {
      headers: { "x-user-id": user._id },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data._id) return [];
        setRestaurant(data);
        return fetch(`http://localhost:3000/api/foods/restaurant/${data._id}`).then((r) =>
          r.json()
        );
      })
      .then((foods) => setMenuItems(Array.isArray(foods) ? foods : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?._id]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function toggleAvailability(item) {
    try {
      const response = await fetch(`http://localhost:3000/api/foods/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      });
      const updated = await response.json();
      setMenuItems((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
    } catch {
      setErrorMessage("Could not update item. Please try again.");
    }
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
      tagline: item.tagline || "",
      price: item.price,
      category: item.category || "",
      available: item.available,
    });
    setEditingId(item._id);
    setErrorMessage("");
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      setErrorMessage("Name and price are required.");
      return;
    }

    if (!restaurant) {
      setErrorMessage("No restaurant is linked to this account yet.");
      return;
    }

    const payload = {
      name: form.name,
      tagline: form.tagline,
      price: Number(form.price),
      category: form.category,
      available: form.available,
      restaurantId: restaurant._id,
    };

    try {
      if (editingId !== null) {
        const response = await fetch(`http://localhost:3000/api/foods/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await response.json();
        setMenuItems((prev) => prev.map((i) => (i._id === editingId ? updated : i)));
      } else {
        const response = await fetch("http://localhost:3000/api/foods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await response.json();
        setMenuItems((prev) => [...prev, created]);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch {
      setErrorMessage("Could not save item. Please try again.");
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:3000/api/foods/${id}`, { method: "DELETE" });
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      setErrorMessage("Could not delete item. Please try again.");
    }
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
          <Link to="/vendor/settings">Settings</Link>
        </nav>
        <div className="profile-box card">
          <div className="avatar-circle">
            {(restaurant?.name || "V").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="profile-name">{restaurant?.name || "Vendor"}</p>
            <p className="profile-location">{restaurant?.location || ""}</p>
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

        {errorMessage && !showForm && <p className="error-text">{errorMessage}</p>}

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
                  <label>Price (₦)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
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
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="menu-grid">
          {loading ? (
            <div className="card empty-menu">
              <p>Loading menu…</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="card empty-menu">
              <p>No items yet. Click <strong>+ Add Item</strong> to get started.</p>
            </div>
          ) : (
            menuItems.map((item) => (
              <div
                key={item._id}
                className={"card menu-item-card" + (item.available ? "" : " unavailable")}
              >
                <div className="menu-item-top">
                  <div>
                    <p className="menu-name">{item.name}</p>
                    <p className="menu-tagline">{item.tagline}</p>
                  </div>
                  <p className="menu-price">₦{item.price?.toLocaleString()}</p>
                </div>

                {item.category && <span className="category-pill">{item.category}</span>}

                <div className="menu-item-actions">
                  <button
                    className={"switch" + (item.available ? " on" : "")}
                    onClick={() => toggleAvailability(item)}
                    title={item.available ? "Mark unavailable" : "Mark available"}
                  />
                  <button className="btn btn-ghost btn-sm" onClick={() => openEditForm(item)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item._id)}
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