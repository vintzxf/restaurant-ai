require("dotenv").config();
const mongoose = require("mongoose");

const Restaurant = require("./models/Restaurant");
const Food = require("./models/Food");

const connectDB = require("./config/db");

const seedData = async () => {
  try {
    await connectDB();

    // CLEAR OLD DATA (safe for dev)
    await Restaurant.deleteMany();
    await Food.deleteMany();

    console.log("Old data cleared");

    // CREATE RESTAURANTS
    const restaurants = await Restaurant.insertMany([
      {
        name: "Chicken Republic",
        description: "Fast food chicken restaurant",
        location: "Abuja",
        image: "chicken.jpg",
      },
      {
        name: "KFC",
        description: "Global fried chicken chain",
        location: "Lagos",
        image: "kfc.jpg",
      },
      {
        name: "Mama Put",
        description: "Local Nigerian dishes",
        location: "Abuja",
        image: "mamaput.jpg",
      },
      {
        name: "Dominos Pizza",
        description: "Pizza and fast food",
        location: "Lagos",
        image: "pizza.jpg",
      },
    ]);

    console.log("Restaurants created");

   
    const foods = await Food.insertMany([
      {
        name: "Spicy Chicken Wings",
        price: 3500,
        category: "chicken",
        tags: ["spicy", "chicken"],
        restaurantId: restaurants[0]._id,
      },
      {
        name: "Fried Rice + Chicken",
        price: 4000,
        category: "rice",
        tags: ["normal", "combo"],
        restaurantId: restaurants[0]._id,
      },
      {
        name: "Zinger Burger",
        price: 4500,
        category: "burger",
        tags: ["fastfood"],
        restaurantId: restaurants[1]._id,
      },
      {
        name: "Jollof Rice + Beef",
        price: 2500,
        category: "local",
        tags: ["cheap", "filling"],
        restaurantId: restaurants[2]._id,
      },
      {
        name: "Pepperoni Pizza",
        price: 6000,
        category: "pizza",
        tags: ["cheesy"],
        restaurantId: restaurants[3]._id,
      },
    ]);

    console.log("Foods created");

    console.log("🔥 Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedData();