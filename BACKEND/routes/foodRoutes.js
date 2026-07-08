const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

// GET /api/foods — all foods (used by AI chatbot)
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurantId");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/foods/vendor/:phone — foods belonging to a vendor
// Looks up the vendor's User by phone, finds their Restaurant, returns its foods
router.get("/vendor/:phone", async (req, res) => {
  try {
    const email = req.params.phone + "@counterai.vendor";
    const user = await User.findOne({ email });

    if (!user) {
      return res.json([]); // vendor has no account yet — return empty
    }

    const restaurant = await Restaurant.findOne({ ownerId: user._id });

    if (!restaurant) {
      return res.json([]); // vendor has no restaurant linked yet
    }

    const foods = await Food.find({ restaurantId: restaurant._id });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/foods/restaurant/:id — foods by restaurant ID
router.get("/restaurant/:id", async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.id });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;