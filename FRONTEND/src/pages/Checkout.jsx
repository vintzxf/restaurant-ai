import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Banknote } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getSession } from "../utils/auth";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, restaurantId } = useCart();
  const user = getSession();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [placing, setPlacing] = useState(false);

  const deliveryFee = items.length > 0 ? 1500 : 0;
  const serviceFee = items.length > 0 ? 500 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  async function handlePay() {
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Please sign in before placing an order.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }
    if (!address.trim() || !phone.trim()) {
      setErrorMessage("Please fill in your delivery address and phone number.");
      return;
    }

    setPlacing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user._id,
          restaurantId,
          items: items.map((i) => ({
            foodId: i.foodId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal,
          deliveryFee,
          serviceFee,
          total,
          deliveryAddress: address,
          deliveryPhone: phone,
          instructions,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Could not place order.");
        setPlacing(false);
        return;
      }

      clearCart();
      navigate("/orders");
    } catch (error) {
      setErrorMessage("Failed to connect to server.");
      setPlacing(false);
    }
  }

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        {/* LEFT COLUMN */}
        <div className="checkout-left">
          <h1>Checkout</h1>

          <div className="checkout-card">
            <h2>Delivery Address</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              rows="4"
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="checkout-card">
            <h2>Payment Method</h2>

            <div className="payment-options">
              <label
                className={
                  paymentMethod === "cash" ? "payment-option active" : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />

                <Banknote size={20} />
                Cash on Delivery
              </label>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Special Instructions</h2>

            <textarea
              rows="4"
              placeholder="Any instructions for the restaurant or rider?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>

        {/* RIGHT COLUMN */}
        <div className="checkout-right">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Service Fee</span>
              <span>₦{serviceFee.toLocaleString()}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <button className="pay-btn" onClick={handlePay} disabled={placing}>
              {placing ? "Placing order…" : `Pay ₦${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}