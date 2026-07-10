import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { getSession } from "../utils/auth";
import "./VendorDashboard.css";

const statusColors = {
  New: "badge-purple",
  Preparing: "badge-blue",
  Ready: "badge-green",
  Completed: "badge-gray",
};

const orderFilters = ["All", "New", "Preparing", "Ready", "Completed"];

// Small real bar-chart: order counts for each of the last 7 days.
function last7DayBars(orders) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toDateString());
  }
  const counts = days.map(
    (day) => orders.filter((o) => new Date(o.createdAt).toDateString() === day).length
  );
  const max = Math.max(...counts, 1);
  return counts.map((c) => Math.max(Math.round((c / max) * 100), 8));
}

export default function VendorDashboard() {
  const user = getSession();
  const businessName = user?.businessName || "Vendor";
  const initials = businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("All");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/api/restaurants/mine", {
      headers: { "x-user-id": user._id },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data._id) return;
        setRestaurant(data);

        const [ordersRes, foodsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/orders/restaurant/${data._id}`).then((r) => r.json()),
          fetch(`http://localhost:3000/api/foods/restaurant/${data._id}`).then((r) => r.json()),
        ]);

        setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        setMenuItems(Array.isArray(foodsRes) ? foodsRes : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?._id]);

  const filteredOrders =
    orderFilter === "All" ? orders : orders.filter((o) => o.status === orderFilter);

  const totalRevenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const activeOrders = orders.filter((o) => o.status !== "Completed").length;
  const bars = last7DayBars(orders);

  const stats = [
    {
      label: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      change: "from completed orders",
      bars,
    },
    {
      label: "Active Orders",
      value: String(activeOrders),
      change: "currently in progress",
      bars,
    },
    {
      label: "Menu Items Listed",
      value: String(menuItems.length),
      change: `${menuItems.filter((m) => m.available).length} available`,
      bars,
    },
  ];

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
            <Link to="/vendor/settings">Settings</Link>
          </nav>

          <div className="profile-box card">
            <div className="avatar-circle">{initials}</div>
            <div>
              <p className="profile-name">{businessName}</p>
              <p className="profile-location">{restaurant?.location || ""}</p>
            </div>
          </div>
        </aside>
        <main className="dash-main">
          <div className="dash-header">
            <div>
              <h1>Welcome back, {businessName} 👋</h1>
              <p>Here's what's happening with your business today.</p>
            </div>
            <div className="dash-actions">
              <ThemeToggle />
            </div>
          </div>

          {!loading && !restaurant ? (
            <div className="card" style={{ padding: "1.5rem" }}>
              <p>
                We couldn't find a restaurant linked to your account. Contact support if this
                seems wrong.
              </p>
            </div>
          ) : (
            <>
              <div className="stat-grid">
                {stats.map((stat) => (
                  <div className="card stat-card" key={stat.label}>
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{loading ? "…" : stat.value}</p>
                    <p className="stat-change">{stat.change}</p>
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
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center", padding: "1.5rem", opacity: 0.5 }}>
                            Loading…
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center", padding: "1.5rem", opacity: 0.5 }}>
                            No orders yet.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.slice(0, 6).map((order) => (
                          <tr key={order._id}>
                            <td>#{order._id.slice(-6).toUpperCase()}</td>
                            <td>₦{order.total?.toLocaleString()}</td>
                            <td>
                              <span className={"badge " + statusColors[order.status]}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <Link
                    to="/vendor/orders"
                    className="btn btn-ghost"
                    style={{ marginTop: "1rem", display: "inline-block" }}
                  >
                    View all orders →
                  </Link>
                </div>

                <div className="card panel">
                  <h3>Menu Snapshot</h3>

                  {loading ? (
                    <p style={{ opacity: 0.5 }}>Loading…</p>
                  ) : menuItems.length === 0 ? (
                    <p style={{ opacity: 0.6 }}>
                      No menu items yet. <Link to="/vendor/menu">Add your first item →</Link>
                    </p>
                  ) : (
                    menuItems.slice(0, 5).map((item) => (
                      <div className="menu-row" key={item._id}>
                        <div>
                          <p className="menu-name">{item.name}</p>
                          <p className="menu-tagline">{item.tagline}</p>
                        </div>
                        <p className="menu-price">₦{item.price?.toLocaleString()}</p>
                        <span className={"switch" + (item.available ? " on" : "")} />
                      </div>
                    ))
                  )}

                  <Link
                    to="/vendor/menu"
                    className="btn btn-ghost"
                    style={{ marginTop: "1rem", display: "inline-block" }}
                  >
                    Manage full menu →
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}