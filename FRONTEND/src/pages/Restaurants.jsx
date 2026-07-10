import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Restaurants.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(Array.isArray(data) ? data : []))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  // Categories are derived from real vendor data (set during their
  // application) rather than a fixed dummy list.
  const categories = ["All", ...new Set(restaurants.map((r) => r.category).filter(Boolean))];

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchableText = [restaurant.name, restaurant.description, restaurant.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(normalizedSearch);
    const matchesCategory = activeCategory === "All" || restaurant.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="restaurants-page">
      <Navbar />
      <section className="hero">
        <h1>All Restaurants</h1>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search for a restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="restaurant-grid">
        {loading ? (
          <p className="empty-state">Loading restaurants…</p>
        ) : filteredRestaurants.length === 0 ? (
          <p className="empty-state">No restaurants match your filters.</p>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <div className="restaurant-card" key={restaurant._id}>
              {restaurant.image && <img src={restaurant.image} alt={restaurant.name} />}

              <div className="card-content">
                <h3>{restaurant.name}</h3>

                {restaurant.category && (
                  <div className="tags">
                    <span>{restaurant.category}</span>
                  </div>
                )}

                <p className="description">{restaurant.description}</p>
                {restaurant.location && <p className="meta">{restaurant.location}</p>}

                <Link to={`/restaurants/${restaurant._id}`} className="menu-btn">
                  View Menu
                </Link>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}