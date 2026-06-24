import { useState } from "react";
import Navbar from '../components/Navbar'
import "./Orders.css";

const orders = [
    {
        id: "ORD-1042",
        status: "Delivered",
        restaurant: "Chicken Republic",
        items: "2x Grilled Chicken, 1x Fries",
        date: "Jun 18, 2026",
        amount: "₦8,500",
    },
    {
        id: "ORD-1041",
        status: "Delivered",
        restaurant: "KFC",
        items: "1x Chicken Bucket",
        date: "Jun 16, 2026",
        amount: "₦12,000",
    },
    {
        id: "ORD-1040",
        status: "On the way",
        restaurant: "Domino's Pizza",
        items: "1x Large Pepperoni Pizza",
        date: "Jun 14, 2026",
        amount: "₦9,200",
    },
    {
        id: "ORD-1039",
        status: "Preparing",
        restaurant: "Chicken Republic",
        items: "1x Jollof Rice, 1x Drink",
        date: "Jun 10, 2026",
        amount: "₦4,300",
    },
];

export default function Orders() {
    const [activeTab, setActiveTab] = useState("All");

    const filteredOrders =
        activeTab === "All"
            ? orders
            : orders.filter((order) => order.status === activeTab);

    return (
        <div className="orders-page">
            <Navbar />

            <section className="orders-section">
                <h1>My Orders</h1>

                <div className="filter-tabs">
                    {["All", "Preparing", "On the way", "Delivered"].map((tab) => (
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
                    {filteredOrders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-header">
                                <h3>#{order.id}</h3>

                                <span
                                    className={`status ${order.status
                                        .toLowerCase()
                                        .replace(/\s/g, "-")}`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <h4>{order.restaurant}</h4>

                            <p className="items">{order.items}</p>

                            <div className="order-footer">
                                <span>{order.date}</span>
                                <strong>{order.amount}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}