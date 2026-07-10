import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "./Restaurants.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/restaurants/${id}`).then((r) => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/foods/restaurant/${id}`).then((r) => r.json()),
    ])
      .then(([restaurantData, foodsData]) => {
        if (restaurantData.message) {
          setErrorMessage(restaurantData.message);
        } else {
          setRestaurant(restaurantData);
          setFoods(Array.isArray(foodsData) ? foodsData : []);
        }
      })
      .catch(() => setErrorMessage("Failed to load this restaurant."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd(food) {
    addToCart(food, restaurant);
    setAddedId(food._id);
    setTimeout(() => setAddedId(null), 1500);
  }

  if (loading) {
    return (
      <div className="restaurants-page">
        <Navbar />
        <p style={{ padding: "2rem" }}>Loading menu…</p>
      </div>
    );
  }

  if (errorMessage || !restaurant) {
    return (
      <div className="restaurants-page">
        <Navbar />
        <p style={{ padding: "2rem" }}>{errorMessage || "Restaurant not found."}</p>
        <Link to="/restaurants" style={{ padding: "0 2rem" }}>
          ← Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="restaurants-page">
      <Navbar />
      <section className="hero">
        <h1>{restaurant.name}</h1>
        {restaurant.location && <p>{restaurant.location}</p>}
        {restaurant.description && <p>{restaurant.description}</p>}
      </section>

      <section className="restaurant-grid">
        {foods.length === 0 ? (
          <p className="empty-state">This restaurant hasn't added any menu items yet.</p>
        ) : (
          foods
            .filter((food) => food.available !== false)
            .map((food) => (
              <div className="restaurant-card" key={food._id}>
                {food.image && <img src={food.image} alt={food.name} />}

                <div className="card-content">
                  <h3>{food.name}</h3>
                  {food.tagline && <p className="description">{food.tagline}</p>}

                  {food.category && (
                    <div className="tags">
                      <span>{food.category}</span>
                    </div>
                  )}

                  <p className="meta">₦{food.price?.toLocaleString()}</p>

                  <button className="menu-btn" onClick={() => handleAdd(food)}>
                    {addedId === food._id ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))
        )}
      </section>
    </div>
  );
}