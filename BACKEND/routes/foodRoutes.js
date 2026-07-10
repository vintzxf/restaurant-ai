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
// Looks up the vendor's User directly by phone (User now stores a real phone
// field), then finds their Restaurant, then returns its foods. This used to
// construct a synthetic "{phone}@counterai.vendor" email, which broke once
// vendors started signing up with their own real email address.
router.get("/vendor/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

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

// POST /api/foods — add a new menu item
router.post("/", async (req, res) => {
  try {
    const { name, price, image, category, tagline, available, tags, restaurantId } = req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({ message: "Name, price, and restaurantId are required." });
    }

    const food = await Food.create({
      name,
      price,
      image,
      category,
      tagline,
      available,
      tags,
      restaurantId,
    });

    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/foods/:id — edit details or toggle availability
router.patch("/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: "Item not found." });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/foods/:id
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: "Item not found." });
    res.json({ message: "Item deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;