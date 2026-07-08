import { useState } from "react";
import { Star } from "lucide-react";
import Navbar from "../components/Navbar";
import "./Favourites.css";

import chickenRepublicImg from "../assets/Chicken-republic_2.png";
import kfcImg from "../assets/KFC.png";

export default function Favourites() {
  const [favourites, setFavourites] = useState([
    {
      id: 1,
      name: "Chicken Republic",
      rating: 4.6,
      eta: "20-30 mins",
      price: "Mid-range",
      tags: ["High Protein", "Spicy", "Popular"],
      description:
        "Juicy grilled chicken, spicy wings and bold flavors that hit different.",
      image: chickenRepublicImg,
    },
    {
      id: 2,
      name: "KFC",
      rating: 4.7,
      eta: "25-35 mins",
      price: "Mid-range",
      tags: ["High Protein", "Budget Friendly", "Popular"],
      description:
        "The iconic taste of KFC. Crispy, fresh and finger lickin' good.",
      image: kfcImg,
    },
  ]);

  const removeFavourite = (id) => {
    setFavourites(favourites.filter((restaurant) => restaurant.id !== id));
  };

  return (
    <div className="Favourites-page">
      <Navbar />

      <section className="Favourites-section">
        <h1>Your Favourites</h1>

        {favourites.length === 0 ? (
          <div className="empty-state">
            <h3>No Favourites yet</h3>
            <p>Restaurants you save will appear here.</p>
          </div>
        ) : (
          <div className="Favourites-grid">
            {favourites.map((restaurant) => (
              <div className="Favourite-card" key={restaurant.id}>
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                />

                <div className="card-body">
                  <h3>{restaurant.name}</h3>

                  <p className="meta">
                    <Star
                      size={15}
                      fill="gold"
                      color="gold"
                    />
                    {restaurant.rating} - {restaurant.eta} -{" "}
                    {restaurant.price}
                  </p>

                  <div className="tag-row">
                    {restaurant.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="description">
                    {restaurant.description}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() => removeFavourite(restaurant.id)}
                  >
                    Remove from Favourites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
