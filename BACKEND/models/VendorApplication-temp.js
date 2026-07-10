const mongoose = require("mongoose");

const vendorApplicationSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // hashed — used to create the
    // linked User account once the phone number is verified
    category: { type: String, required: true },
    menuDescription: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
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
