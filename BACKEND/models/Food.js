const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    category: String,

    tags: [
      String
    ], 

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);