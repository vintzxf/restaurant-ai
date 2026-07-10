import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { items, increaseQty, decreaseQty, removeFromCart, subtotal } = useCart();

  const deliveryFee = items.length > 0 ? 1500 : 0;
  const serviceFee = items.length > 0 ? 500 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <div className="cart-left">
          <h1>My Cart</h1>

          {items.length === 0 ? (
            <p>
              Your cart is empty.{" "}
              <Link to="/restaurants">Browse restaurants</Link> to add something delicious.
            </p>
          ) : (
            items.map((item) => (
              <div className="cart-card" key={item.foodId}>
                {item.image && <img src={item.image} alt={item.name} />}

                <div className="cart-details">
                  <h3>{item.name}</h3>

                  <p>{item.restaurantName}</p>

                  <span>₦{item.price.toLocaleString()}</span>

                  <div className="quantity-controls">
                    <button onClick={() => decreaseQty(item.foodId)}>-</button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item.foodId)}>+</button>
                  </div>
                </div>

                <div className="item-total">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeFromCart(item.foodId)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-right">
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

            {items.length > 0 && (
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}