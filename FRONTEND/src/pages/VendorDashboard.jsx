import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { stats, orders, menuItems as initialMenuItems } from "../data.js";
import "./VendorDashboard.css";


const statusColors = {
  New: "badge-purple",
  Preparing: "badge-blue",
  Ready: "badge-green",
  Completed: "badge-gray",
};


const orderFilters = ["All", "New", "Preparing", "Ready", "Completed"];

export default function VendorDashboard() {
  const [orderFilter, setOrderFilter] = useState("All");

  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const filteredOrders =
    orderFilter === "All" ? orders : orders.filter((o) => o.status === orderFilter);

  function toggleAvailability(id) {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  }

  return (
    <>
      <div className="dashboard">
        <aside className="sidebar">
          <Link to="/" className="brand">
            Counter<span>AI</span>
          </Link>
          <p className="sidebar-label">Vendor Dashboard</p>


          <nav className="sidebar-nav">
            <Link to="/vendor" className="active">Dashboard</Link>
            <Link to="/vendor/orders">Orders</Link>
            <Link to="/vendor/menu">Menu Builder</Link>
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
              <h1>Welcome back, Spice Paradise 👋</h1>
              <p>Here's what's happening with your business today.</p>
            </div>
            <div className="dash-actions">
              <ThemeToggle />
              <span className="pill">📅 Jun 14 – Jun 20, 2026</span>
            </div>
          </div>

          <div className="stat-grid">
            {stats.map((stat) => (
              <div className="card stat-card" key={stat.label}>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-change">▲ {stat.change}</p>
                <div className="bar-chart">
                  {stat.bars.map((height, index) => (
                    <div className="bar" style={{ height: height + "%" }} key={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="panel-grid">
            <div className="card panel">
              <h3>Order Management</h3>

              <div className="filter-row">
                {orderFilters.map((status) => (
                  <button
                    key={status}
                    className={"pill-btn" + (orderFilter === status ? " active" : "")}
                    onClick={() => setOrderFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.total}</td>
                      <td>
                        <span className={"badge " + statusColors[order.status]}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card panel">
              <h3>Menu Controls</h3>

              {menuItems.map((item) => (
                <div className="menu-row" key={item.id}>
                  <div>
                    <p className="menu-name">{item.name}</p>
                    <p className="menu-tagline">{item.tagline}</p>
                  </div>
                  <p className="menu-price">{item.price}</p>
                  <button
                    className={"switch" + (item.available ? " on" : "")}
                    onClick={() => toggleAvailability(item.id)}
                  />
                </div>


              ))}
              <div className="sidebar-footer">

              </div>
            </div>
          </div>
        </main>
      </div>

    </>
  );
}
