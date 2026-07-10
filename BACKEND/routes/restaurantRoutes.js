const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/restaurants/mine — the logged-in vendor's own restaurant
// (identified via the x-user-id header, same pattern as adminRoutes/vendorController)
// NOTE: this must be declared before "/:id" below, or Express will try to
// treat "mine" as an :id value.
router.get("/mine", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Missing user id." });
    }

    const restaurant = await Restaurant.findOne({ ownerId: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this account." });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/restaurants/:id — a single restaurant (for the menu/detail page)
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;