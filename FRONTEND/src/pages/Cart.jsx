import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Cart.css";

import chickenImg from "../assets/Chicken-republic_2.png";
import pizzaImg from "../assets/Dominos-pizza.webp";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Grilled Chicken",
      restaurant: "Chicken Republic",
      price: 4500,
      quantity: 2,
      image: chickenImg,
    },
    {
      id: 2,
      name: "Large Pepperoni Pizza",
      restaurant: "Domino's Pizza",
      price: 6500,
      quantity: 1,
      image: pizzaImg,
    },
  ]);

  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity - 1),
              }
            : item
        )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 1500;
  const serviceFee = 500;

  const total =
    subtotal + deliveryFee + serviceFee;

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <div className="cart-left">
          <h1>My Cart</h1>

          {cartItems.map((item) => (
            <div
              className="cart-card"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-details">
                <h3>{item.name}</h3>

                <p>{item.restaurant}</p>

                <span>
                  ₦{item.price.toLocaleString()}
                </span>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                  >
                    -
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="item-total">
                ₦
                {(
                  item.price *
                  item.quantity
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-right">
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

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
