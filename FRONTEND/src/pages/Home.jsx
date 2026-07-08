import { useState } from "react";
import { categories, dietFilters, restaurants } from "../data.js";
import { Sparkles, Truck, Lock, Headphones, Star } from 'lucide-react';
import "./Home.css";
import Navbar from "../components/Navbar";

export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeFilter, setActiveFilter] = useState(dietFilters[0]);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchableText = [
      restaurant.name,
      restaurant.description,
      restaurant.price,
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
    <div className="page">
      <Navbar />
      <section className="hero">
        <h1>
          Order Like You're <em>At The Counter</em>
        </h1>
        <p>Tell us what you're craving - local vendors, ready in minutes.</p>

        <input
          className="search-input"
          type="text"
          placeholder="Search for a restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
 
        <div className="pill-row">
          {categories.map((category) => (
            <button
              key={category}
              className={"pill-btn" + (activeCategory === category ? " active" : "")}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Recommended For You</h2>
          <div className="pill-row">
            {dietFilters.map((filter) => (
              <button
                key={filter}
                className={"pill-btn" + (activeFilter === filter ? " active" : "")}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <div className="card restaurant-card" key={restaurant.id}>
              <img src={restaurant.image} alt={restaurant.name} />
              <div className="restaurant-body">
                <h3>{restaurant.name}</h3>
                <p className="meta">
                  <Star color="yellow" size={15} />
                   {restaurant.rating} - {restaurant.eta} - {restaurant.price}
                </p>
                <div className="tag-row">
                  {restaurant.tags.map((tag) => (
                    <span className="badge badge-blue" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="description">{restaurant.description}</p>
                <button className="btn btn-outline">View Menu</button>
              </div>
            </div>
          ))}

          {filteredRestaurants.length === 0 && (
            <p className="empty-state">No restaurants match your filters.</p>
          )}
        </div>
      </section>

      <section className="feature-strip">
        <div className="feature-item">
          <h4><Sparkles color="var(--accent)" size={15} /> AI-Powered Recommendations</h4>
          <p>Personalized picks you'll love</p>
        </div>
        <div className="feature-item">
          <h4><Truck color="var(--accent)" size={18} /> Fast & Reliable Delivery</h4>
          <p>Get your meals on time</p>
        </div>
        <div className="feature-item">
          <h4><Lock color="var(--accent)" size={15} /> Secure Payments</h4>
          <p>Pay safely and securely</p>
        </div>
        <div className="feature-item">
          <h4><Headphones color="var(--accent)" size={15} /> 24/7 Customer Support</h4>
          <p>We're here to help anytime</p>
        </div>
      </section>
    </div>
  );
}
