import { useState } from "react";
import { Star, MapPin, ShoppingCart } from "lucide-react";
import Navbar from '../components/Navbar'
import chickenRepublicImg from "../assets/Chicken-republic_2.png";
import KfcImg from "../assets/KFC.png";
import DominosImg from "../assets/Dominos-pizza.webp";
import BiggsImg from "../assets/Mr.biggs.jpeg";
import ThePlaceImg from "../assets/the-place.webp";
import "./Restaurants.css";

const categories = [
  "Burger",
  "Pizza",
  "Chicken",
  "Rice",
  "Shawarma",
  "Drinks",
];

const restaurants = [
  {
    id: 1,
    name: "Chicken Republic",
    rating: 4.6,
    eta: "20-30 mins",
    price: "₦₦",
    tags: ["High Protein", "Spicy", "Popular"],
    description:
      "Juicy grilled chicken, spicy wings and bold flavors that hit different.",
    image:
      chickenRepublicImg,
  },
  {
    id: 2,
    name: "KFC",
    rating: 4.7,
    eta: "25-35 mins",
    price: "₦₦",
    tags: ["High Protein", "Budget Friendly", "Popular"],
    description:
      "The iconic taste of KFC. Crispy, fresh and finger lickin' good.",
    image:
      KfcImg,
  },
  {
    id: 3,
    name: "Domino's Pizza",
    rating: 4.4,
    eta: "30-40 mins",
    price: "₦₦₦",
    tags: ["Popular", "Budget Friendly"],
    description:
      "Classic hand-tossed pizza with melted cheese and fresh toppings.",
    image:
      DominosImg,
  },
  {
    id: 4,
    name: "Mr Bigg's",
    rating: 4.2,
    eta: "15-25 mins",
    price: "₦",
    tags: ["Budget Friendly", "Popular"],
    description:
      "Familiar local Favourites — meat pies, rice dishes and pastries.",
    image:
      BiggsImg,
  },
  {
    id: 5,
    name: "The Place Restaurant",
    rating: 4.5,
    eta: "30-40 mins",
    price: "₦₦₦",
    tags: ["High Protein", "Healthy"],
    description:
      "Sit-down style Nigerian dishes made with fresh, quality ingredients.",
    image:
      ThePlaceImg,
  },
];

export default function Restaurants() {
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="restaurants-page">
      <Navbar />
      {/* Header */}
      <section className="hero">
        <h1>All Restaurants</h1>

        <div className="categories">
          {categories.map((category) => (
            <button key={category}>{category}</button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search for a restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* Restaurant Grid */}
      <section className="restaurant-grid">
        {filteredRestaurants.map((restaurant) => (
          <div className="restaurant-card" key={restaurant.id}>
            <img
              src={restaurant.image}
              alt={restaurant.name}
            />

            <div className="card-content">
              <h3>{restaurant.name}</h3>

              <p className="meta">
                <Star fill="gold" color="gold" size={14} />
                {restaurant.rating} · {restaurant.eta} · {restaurant.price}
              </p>

              <div className="tags">
                {restaurant.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p className="description">
                {restaurant.description}
              </p>

              <button className="menu-btn">
                View Menu
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}