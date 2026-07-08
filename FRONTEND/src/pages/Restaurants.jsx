import { useState } from "react";
import { Star } from "lucide-react";
import Navbar from "../components/Navbar";
import { categories, dietFilters, restaurants } from "../data.js";
import "./Restaurants.css";

export default function Restaurants() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeFilter, setActiveFilter] = useState(dietFilters[0]);
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchableText = [
      restaurant.name,
      restaurant.description,
      ...restaurant.tags,
      ...restaurant.categories,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = searchableText.includes(normalizedSearch);
    const matchesCategory =
      activeCategory === "All" || restaurant.categories.includes(activeCategory);
    const matchesDietFilter =
      activeFilter === "All" || restaurant.tags.includes(activeFilter);

    return matchesSearch && matchesCategory && matchesDietFilter;
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

        <div className="categories">
          {dietFilters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search for a restaurant, dish, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="restaurant-grid">
        {filteredRestaurants.map((restaurant) => (
          <div className="restaurant-card" key={restaurant.id}>
            <img src={restaurant.image} alt={restaurant.name} />

            <div className="card-content">
              <h3>{restaurant.name}</h3>

              <p className="meta">
                <Star fill="gold" color="gold" size={14} />
                {restaurant.rating} - {restaurant.eta} - {restaurant.price}
              </p>

              <div className="tags">
                {restaurant.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p className="description">{restaurant.description}</p>

              <button className="menu-btn">View Menu</button>
            </div>
          </div>
        ))}

        {filteredRestaurants.length === 0 && (
          <p className="empty-state">No restaurants match your filters.</p>
        )}
      </section>
    </div>
  );
}
