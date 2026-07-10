import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSession } from "../utils/auth";
import "./Orders.css";

const TABS = ["All", "New", "Preparing", "Ready", "Completed"];

export default function Orders() {
  const user = getSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/customer/${user._id}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?._id]);

  const filteredOrders =
    activeTab === "All" ? orders : orders.filter((order) => order.status === activeTab);

  return (
    <div className="orders-page">
      <Navbar />

      <section className="orders-section">
        <h1>My Orders</h1>

        {!user ? (
          <p>Sign in to see your orders.</p>
        ) : (
          <>
            <div className="filter-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="orders-list">
              {loading ? (
                <p>Loading orders…</p>
              ) : filteredOrders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                filteredOrders.map((order) => (
                  <div className="order-card" key={order._id}>
                    <div className="order-header">
                      <h3>#{order._id.slice(-6).toUpperCase()}</h3>

                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <h4>{order.restaurantId?.name || "Restaurant"}</h4>

                    <p className="items">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </p>

                    <div className="order-footer">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <strong>₦{order.total?.toLocaleString()}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}