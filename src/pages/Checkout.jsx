import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  CreditCard,
  Landmark,
  Wallet,
  Banknote,
} from "lucide-react";
import "./Checkout.css";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] =
    useState("card");

  const subtotal = 15500;
  const deliveryFee = 1500;
  const serviceFee = 500;

  const total =
    subtotal + deliveryFee + serviceFee;

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
            />

            <input
              type="tel"
              placeholder="Phone Number"
            />

            <textarea
              rows="4"
              placeholder="Enter delivery address"
            />
          </div>

          <div className="checkout-card">
            <h2>Payment Method</h2>

            <div className="payment-options">
              <label
                className={
                  paymentMethod === "cash"
                    ? "payment-option active"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() =>
                    setPaymentMethod("cash")
                  }
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
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="checkout-right">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                ₦{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>
                ₦{deliveryFee.toLocaleString()}
              </span>
            </div>

            <div className="summary-row">
              <span>Service Fee</span>
              <span>
                ₦{serviceFee.toLocaleString()}
              </span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>
                ₦{total.toLocaleString()}
              </span>
            </div>

            <button className="pay-btn">
              Pay ₦{total.toLocaleString()}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}