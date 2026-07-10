import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(food, restaurant) {
    setItems((prev) => {
      // A single cart can only hold items from one restaurant at a time.
      if (prev.length > 0 && prev[0].restaurantId !== restaurant._id) {
        const confirmed = window.confirm(
          "Your cart has items from another restaurant. Start a new cart with this item instead?"
        );
        if (!confirmed) return prev;
        prev = [];
      }

      const existing = prev.find((i) => i.foodId === food._id);
      if (existing) {
        return prev.map((i) =>
          i.foodId === food._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [
        ...prev,
        {
          foodId: food._id,
          name: food.name,
          price: food.price,
          image: food.image,
          quantity: 1,
          restaurantId: restaurant._id,
          restaurantName: restaurant.name,
        },
      ];
    });
  }

  function increaseQty(foodId) {
    setItems((prev) =>
      prev.map((i) => (i.foodId === foodId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }

  function decreaseQty(foodId) {
    setItems((prev) =>
      prev.map((i) =>
        i.foodId === foodId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  }

  function removeFromCart(foodId) {
    setItems((prev) => prev.filter((i) => i.foodId !== foodId));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const restaurantId = items[0]?.restaurantId || null;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        subtotal,
        restaurantId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}