import ChickenRepublic from "./assets/Chicken-republic.png"
import KFC from "./assets/KFC.png"
import Dominos from "./assets/Dominos-pizza.png"


export const categories = ["Burger", "Pizza", "Chicken", "Rice", "Shawarma", "Drinks"];

export const dietFilters = ["Healthy", "High Protein", "Budget Friendly", "Spicy"];

export const restaurants = [
  {
    id: 1,
    name: "Chicken Republic",
    rating: 4.6,
    eta: "20-30 mins",
    price: "₦₦",
    tags: ["High Protein", "Spicy", "Popular"],
    description: "Juicy grilled chicken, spicy wings and bold flavors that hit different.",
    image: ChickenRepublic,
  },


  {
    id: 2,
    name: "KFC",
    rating: 4.7,
    eta: "25-35 mins",
    price: "₦₦",
    tags: ["High Protein", "Budget Friendly", "Popular"],
    description: "The iconic taste of KFC. Crispy, fresh and finger lickin' good.",
    image: KFC,
  },
  {
    id: 3,
    name: "Domino's Pizza",
    rating: 4.4,
    eta: "30-40 mins",
    price: "₦₦₦",
    tags: ["Popular", "Budget Friendly"],
    description: "Classic hand-tossed pizza with melted cheese and fresh toppings.",
    image: Dominos,
  },
];

export const stats = [
  { label: "Total Revenue", value: "₦24,580", change: "+12.5% vs last week", bars: [40, 55, 48, 60, 52, 70, 80] },
  { label: "Active Orders", value: "18", change: "+5 vs last week", bars: [30, 45, 35, 50, 40, 60, 65] },
  { label: "AI Recommendation Score", value: "98%", change: "+3% vs last week", bars: [62, 74, 55, 85, 68, 92, 98] },
];

export const orders = [
  { id: "CA-8921", customer: "Alex Johnson", total: "₦8,500", status: "Preparing" },
  { id: "CA-8920", customer: "Maria Garcia", total: "₦5,990", status: "Preparing" },
  { id: "CA-8919", customer: "David Kim", total: "₦10,500", status: "New" },
  { id: "CA-8918", customer: "Sarah Wilson", total: "₦3,750", status: "Ready" },
  { id: "CA-8917", customer: "James Brown", total: "₦6,600", status: "Completed" },
];

export const menuItems = [
  { id: 1, name: "Jollof Rice Special", tagline: "High protein, Popular", price: "₦3,200", available: true },
  { id: 2, name: "Spicy Suya Wrap", tagline: "Popular, Spicy", price: "₦2,800", available: true },
  { id: 3, name: "Plantain & Egg Sauce", tagline: "Healthy, Veggie", price: "₦2,100", available: true },
  { id: 4, name: "Peppered Gizzard", tagline: "Bestseller, Spicy", price: "₦1,950", available: false },
  { id: 5, name: "Zobo Drink", tagline: "Refreshing, Popular", price: "₦900", available: true },
];
