const express = require("express");
const router = express.Router();
const {
  applyAsVendor,
  verifyOtp,
  resendOtp,
  getStatusByPhone,
  getApplications,
  approveVendor,
  rejectVendor,
  clearTestApplication,
} = require("../controllers/vendorController");

router.post("/apply", applyAsVendor);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/status/:phone", getStatusByPhone);

// Dev-only: clear a test application + linked account so you can reuse a phone number
router.delete("/clear-test/:phone", clearTestApplication);

// Admin-only routes
router.get("/applications", getApplications);
router.patch("/approve/:id", approveVendor);
router.patch("/reject/:id", rejectVendor);

module.exports = router;