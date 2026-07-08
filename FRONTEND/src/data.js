import ChickenRepublic from "./assets/Chicken-republic.png";
import KFC from "./assets/KFC.png";
import Dominos from "./assets/Dominos-pizza.png";
import Biggs from "./assets/Mr.biggs.jpeg";
import ThePlace from "./assets/the-place.webp";

export const categories = ["All", "Burger", "Pizza", "Chicken", "Rice", "Shawarma", "Drinks"];

export const dietFilters = ["All", "Healthy", "High Protein", "Budget Friendly", "Spicy"];

export const restaurants = [
  {
    id: 1,
    name: "Chicken Republic",
    rating: 4.6,
    eta: "20-30 mins",
    price: "Mid-range",
    tags: ["High Protein", "Spicy", "Popular"],
    categories: ["Chicken", "Rice", "Drinks"],
    description: "Juicy grilled chicken, spicy wings and bold flavors that hit different.",
    image: ChickenRepublic,
  },
  {
    id: 2,
    name: "KFC",
    rating: 4.7,
    eta: "25-35 mins",
    price: "Mid-range",
    tags: ["High Protein", "Budget Friendly", "Popular"],
    categories: ["Burger", "Chicken", "Drinks"],
    description: "The iconic taste of KFC. Crispy, fresh and finger lickin' good.",
    image: KFC,
  },
  {
    id: 3,
    name: "Domino's Pizza",
    rating: 4.4,
    eta: "30-40 mins",
    price: "Premium",
    tags: ["Popular", "Budget Friendly"],
    categories: ["Pizza", "Drinks"],
    description: "Classic hand-tossed pizza with melted cheese and fresh toppings.",
    image: Dominos,
  },
  {
    id: 4,
    name: "Mr Bigg's",
    rating: 4.2,
    eta: "15-25 mins",
    price: "Budget",
    tags: ["Budget Friendly", "Popular"],
    categories: ["Rice", "Drinks"],
    description: "Familiar local favourites, from meat pies to rice dishes and pastries.",
    image: Biggs,
  },
  {
    id: 5,
    name: "The Place Restaurant",
    rating: 4.5,
    eta: "30-40 mins",
    price: "Premium",
    tags: ["High Protein", "Healthy"],
    categories: ["Chicken", "Rice", "Shawarma", "Drinks"],
    description: "Sit-down style Nigerian dishes made with fresh, quality ingredients.",
    image: ThePlace,
  },
];

export const stats = [
  { label: "Total Revenue", value: "NGN 24,580", change: "+12.5% vs last week", bars: [40, 55, 48, 60, 52, 70, 80] },
  { label: "Active Orders", value: "18", change: "+5 vs last week", bars: [30, 45, 35, 50, 40, 60, 65] },
  { label: "AI Recommendation Score", value: "98%", change: "+3% vs last week", bars: [62, 74, 55, 85, 68, 92, 98] },
];

export const orders = [
  { id: "CA-8921", customer: "Alex Johnson", total: "NGN 8,500", status: "Preparing" },
  { id: "CA-8920", customer: "Maria Garcia", total: "NGN 5,990", status: "Preparing" },
  { id: "CA-8919", customer: "David Kim", total: "NGN 10,500", status: "New" },
  { id: "CA-8918", customer: "Sarah Wilson", total: "NGN 3,750", status: "Ready" },
  { id: "CA-8917", customer: "James Brown", total: "NGN 6,600", status: "Completed" },
];

export const menuItems = [
  { id: 1, name: "Jollof Rice Special", tagline: "High protein, Popular", price: "NGN 3,200", available: true },
  { id: 2, name: "Spicy Suya Wrap", tagline: "Popular, Spicy", price: "NGN 2,800", available: true },
  { id: 3, name: "Plantain & Egg Sauce", tagline: "Healthy, Veggie", price: "NGN 2,100", available: true },
  { id: 4, name: "Peppered Gizzard", tagline: "Bestseller, Spicy", price: "NGN 1,950", available: false },
  { id: 5, name: "Zobo Drink", tagline: "Refreshing, Popular", price: "NGN 900", available: true },
];
