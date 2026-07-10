const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST /api/orders — create an order (checkout)
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      deliveryAddress,
      deliveryPhone,
      instructions,
      paymentMethod,
    } = req.body;

    if (!customerId || !restaurantId || !items || !items.length) {
      return res.status(400).json({ message: "Missing required order details." });
    }

    const order = await Order.create({
      customerId,
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      deliveryAddress,
      deliveryPhone,
      instructions,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/customer/:customerId — a customer's own order history
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId })
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/restaurant/:restaurantId — a vendor's incoming orders
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status — advance an order to its next status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;