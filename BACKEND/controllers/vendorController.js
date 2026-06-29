const crypto = require("crypto");
const VendorApplication = require("../models/vendorapplication");

const OTP_TTL_MINUTES = 10;

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function getOtpExpiresAt() {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

function buildOtpResponse(application, otp) {
  const response = {
    vendorId: application._id,
    message: "OTP sent. Verify your phone number to continue.",
  };

  if (process.env.NODE_ENV !== "production") {
    response.devOtp = otp;
  }

  return response;
}

async function applyAsVendor(req, res) {
  const { businessName, location, phone, category, menuDescription } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!businessName || !normalizedPhone || !category) {
    return res
      .status(400)
      .json({ message: "Business name, phone, and category are required." });
  }

  if (normalizedPhone.length < 11) {
    return res.status(400).json({ message: "Enter a valid phone number." });
  }

  try {
    const existing = await VendorApplication.findOne({ phone: normalizedPhone });
    if (existing) {
      if (existing.phoneVerified) {
        return res
          .status(400)
          .json({ message: "An application with this phone number already exists." });
      }

      const otp = generateOtp();
      existing.otp = otp;
      existing.otpExpiresAt = getOtpExpiresAt();
      await existing.save();

      console.log(`\nOTP for ${normalizedPhone} -> ${otp}\n`);
      return res.status(200).json(buildOtpResponse(existing, otp));
    }

    const otp = generateOtp();

    const application = await VendorApplication.create({
      businessName,
      location,
      phone: normalizedPhone,
      category,
      menuDescription,
      otp,
      otpExpiresAt: getOtpExpiresAt(),
    });

    console.log(`\nOTP for ${normalizedPhone} -> ${otp}\n`);

    return res.status(201).json(buildOtpResponse(application, otp));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

async function verifyOtp(req, res) {
  const { vendorId, otp } = req.body;

  if (!vendorId || !otp) {
    return res.status(400).json({ message: "Vendor ID and OTP are required." });
  }

  try {
    const application = await VendorApplication.findById(vendorId);

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found. Please apply again." });
    }

    if (application.phoneVerified) {
      return res
        .status(200)
        .json({ message: "Phone already verified. Application is under review." });
    }

    if (!application.otpExpiresAt || application.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Code expired. Please request a new one." });
    }

    if (application.otp !== String(otp).trim()) {
      return res
        .status(400)
        .json({ message: "Incorrect code. Please try again." });
    }

    application.phoneVerified = true;
    application.otp = null;
    application.otpExpiresAt = null;
    await application.save();

    console.log(`Phone verified for application: ${vendorId}`);

    return res
      .status(200)
      .json({ message: "Phone verified. Application is under review." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

async function resendOtp(req, res) {
  const { vendorId } = req.body;

  if (!vendorId) {
    return res.status(400).json({ message: "Vendor ID is required." });
  }

  try {
    const application = await VendorApplication.findById(vendorId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.phoneVerified) {
      return res.status(400).json({ message: "Phone number is already verified." });
    }

    const otp = generateOtp();
    application.otp = otp;
    application.otpExpiresAt = getOtpExpiresAt();
    await application.save();

    console.log(`\nResent OTP for ${application.phone} -> ${otp}\n`);

    return res.status(200).json(buildOtpResponse(application, otp));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

module.exports = { applyAsVendor, verifyOtp, resendOtp };
