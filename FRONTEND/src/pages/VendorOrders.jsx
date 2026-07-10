import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { getSession } from "../utils/auth.js";
import "./VendorDashboard.css";

const statusColors = {
  New: "badge-purple",
  Preparing: "badge-blue",
  Ready: "badge-green",
  Completed: "badge-gray",
};

const statusFlow = {
  New: "Preparing",
  Preparing: "Ready",
  Ready: "Completed",
  Completed: null,
};

const orderFilters = ["All", "New", "Preparing", "Ready", "Completed"];

export default function VendorOrders() {
  const user = getSession();

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

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
        return fetch(`http://localhost:3000/api/orders/restaurant/${data._id}`).then((r) =>
          r.json()
        );
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?._id]);

  const filteredOrders =
    orderFilter === "All" ? orders : orders.filter((o) => o.status === orderFilter);

  async function advanceStatus(order) {
    const next = statusFlow[order.status];
    if (!next) return;

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${order._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const updated = await response.json();

      setOrders((prev) => prev.map((o) => (o._id === order._id ? updated : o)));
      if (selectedOrder && selectedOrder._id === order._id) {
        setSelectedOrder(updated);
      }
    } catch {
      // The button stays clickable, so the vendor can just retry.
    }
  }

  const counts = orderFilters.slice(1).reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/" className="brand">
          Counter<span>AI</span>
        </Link>
        <p className="sidebar-label">Vendor Dashboard</p>
        <nav className="sidebar-nav">
          <Link to="/vendor">Dashboard</Link>
          <Link to="/vendor/orders" className="active">Orders</Link>
          <Link to="/vendor/menu">Menu Builder</Link>
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
            <h1>Orders</h1>
            <p>Manage and update all incoming orders.</p>
          </div>
          <div className="dash-actions">
            <ThemeToggle />
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
          {Object.entries(counts).map(([status, count]) => (
            <div className="card stat-card" key={status}>
              <p className="stat-label">{status}</p>
              <p className="stat-value">{count}</p>
              <p className="stat-change" style={{ opacity: 0.5, fontSize: "0.75rem" }}>
                orders
              </p>
            </div>
          ))}
        </div>

        <div
          className="panel-grid"
          style={{ gridTemplateColumns: selectedOrder ? "1fr 340px" : "1fr" }}
        >
          <div className="card panel">
            <div className="filter-row">
              {orderFilters.map((s) => (
                <button
                  key={s}
                  className={"pill-btn" + (orderFilter === s ? " active" : "")}
                  onClick={() => setOrderFilter(s)}
                >
                  {s}
                  {s !== "All" && counts[s] > 0 && (
                    <span style={{ marginLeft: "6px", opacity: 0.7, fontSize: "0.75rem" }}>
                      ({counts[s]})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem", opacity: 0.5 }}>
                      Loading orders…
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem", opacity: 0.5 }}>
                      No {orderFilter !== "All" ? orderFilter.toLowerCase() : ""} orders right now.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      style={{
                        cursor: "pointer",
                        background: selectedOrder?._id === order._id ? "var(--hover)" : "",
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.customerId?.name || "Customer"}</td>
                      <td>{order.items.length}</td>
                      <td>₦{order.total?.toLocaleString()}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <span className={"badge " + statusColors[order.status]}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {statusFlow[order.status] ? (
                          <button
                            className="pill-btn active"
                            style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceStatus(order);
                            }}
                          >
                            Mark {statusFlow[order.status]}
                          </button>
                        ) : (
                          <span style={{ opacity: 0.4, fontSize: "0.8rem" }}>Done</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="card panel" style={{ position: "relative" }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  opacity: 0.5,
                }}
              >
                ✕
              </button>
              <h3>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
              <p style={{ opacity: 0.6, fontSize: "0.85rem", marginBottom: "1rem" }}>
                {selectedOrder.customerId?.name || "Customer"} —{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>

              <span
                className={"badge " + statusColors[selectedOrder.status]}
                style={{ marginBottom: "1.5rem", display: "inline-block" }}
              >
                {selectedOrder.status}
              </span>

              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.4rem 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ opacity: 0.7 }}>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span>₦{selectedOrder.total?.toLocaleString()}</span>
              </div>

              {statusFlow[selectedOrder.status] && (
                <button
                  className="btn btn-primary full-width"
                  style={{ marginTop: "1.5rem" }}
                  onClick={() => advanceStatus(selectedOrder)}
                >
                  Mark as {statusFlow[selectedOrder.status]}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}