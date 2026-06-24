require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();


connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);

app.get("/", (req, res) => {
  res.send("CounterAI Backend Running");
});

console.log("MONGO URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});