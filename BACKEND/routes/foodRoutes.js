const express = require("express");
const router = express.Router();
const Food = require("../models/Food");


router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurantId");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/restaurant/:id", async (req, res) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.id });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;