import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import "./VendorDashboard.css";
import "./VendorCustomers.css";

// Hardcoded customer data — swap for API call when backend is ready
const customersData = [
  {
    id: 1,
    name: "Amaka Obi",
    email: "amaka@mail.com",
    orders: 7,
    totalSpent: "₦42,500",
    lastOrder: "Jun 19, 2026",
    status: "Regular",
  },
  {
    id: 2,
    name: "Chidi Nwosu",
    email: "chidi@mail.com",
    orders: 2,
    totalSpent: "₦9,800",
    lastOrder: "Jun 14, 2026",
    status: "New",
  },
  {
    id: 3,
    name: "Funke Adeyemi",
    email: "funke@mail.com",
    orders: 15,
    totalSpent: "₦101,200",
    lastOrder: "Jun 20, 2026",
    status: "VIP",
  },
  {
    id: 4,
    name: "Emeka Eze",
    email: "emeka@mail.com",
    orders: 4,
    totalSpent: "₦22,000",
    lastOrder: "Jun 10, 2026",
    status: "Regular",
  },
  {
    id: 5,
    name: "Ngozi Okafor",
    email: "ngozi@mail.com",
    orders: 1,
    totalSpent: "₦3,500",
    lastOrder: "Jun 5, 2026",
    status: "New",
  },
];

const STATUS_COLORS = {
  New: "badge-purple",
  Regular: "badge-blue",
  VIP: "badge-green",
};

export default function VendorCustomers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = customersData
    .filter((c) => (filter === "All" ? true : c.status === filter))
    .filter(
      (c) =>
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

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
          <Link to="/vendor/customers" className="active">Customers</Link>
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
            <h1>Customers</h1>
            <p>Everyone who has ordered from your store.</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Summary */}
        <div className="customers-summary">
          <div className="summary-stat card">
            <p className="stat-label">Total Customers</p>
            <p className="stat-value">{customersData.length}</p>
          </div>
          <div className="summary-stat card">
            <p className="stat-label">VIP Customers</p>
            <p className="stat-value">
              {customersData.filter((c) => c.status === "VIP").length}
            </p>
          </div>
          <div className="summary-stat card">
            <p className="stat-label">New This Month</p>
            <p className="stat-value">
              {customersData.filter((c) => c.status === "New").length}
            </p>
          </div>
        </div>

        <div className="card panel">
          <div className="orders-toolbar">
            <div className="filter-row">
              {["All", "New", "Regular", "VIP"].map((s) => (
                <button
                  key={s}
                  className={"pill-btn" + (filter === s ? " active" : "")}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              className="search-input"
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    No customers match this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="customer-name-cell">
                        <div className="customer-avatar">
                          {c.name.charAt(0)}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td className="email-cell">{c.email}</td>
                    <td>{c.orders}</td>
                    <td className="spent-cell">{c.totalSpent}</td>
                    <td className="time-cell">{c.lastOrder}</td>
                    <td>
                      <span className={"badge " + STATUS_COLORS[c.status]}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
