const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [orderItemSchema],
    subtotal: Number,
    deliveryFee: Number,
    serviceFee: Number,
    total: Number,
    deliveryAddress: String,
    deliveryPhone: String,
    instructions: String,
    paymentMethod: { type: String, default: "cash" },
    status: {
      type: String,
      enum: ["New", "Preparing", "Ready", "Completed"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);