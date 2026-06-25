const mongoose = require("mongoose");

const vendorApplicationSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    menuDescription: { type: String },
    otp: { type: String },
    phoneVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorApplication", vendorApplicationSchema);