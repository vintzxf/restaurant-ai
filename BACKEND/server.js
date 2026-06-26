require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const foodRoutes = require("./routes/foodRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);

app.get("/", (req, res) => {
  res.send("CounterAI Backend Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});