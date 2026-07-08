const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: { type: String },
    businessName: { type: String },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"], // "admin" was missing before — anyone
      // trying to create an admin account would have failed schema validation
      default: "customer",
    },
    // For vendors: "pending" until an admin approves, "active" once approved,
    // "rejected" if declined. Customers are always "active".
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "active",
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorApplication",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);