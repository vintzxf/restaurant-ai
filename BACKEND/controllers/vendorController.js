const VendorApplication = require("../models/VendorApplication");
const User = require("../models/User");

async function isAdmin(userId) {
  const user = await User.findById(userId);
  return user && user.role === "admin";
}

async function applyAsVendor(req, res) {
  const { businessName, location, phone, category, menuDescription } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!businessName || !phone || !category) {
    return res.status(400).json({ message: "Business name, phone, and category are required." });
  }

  if (normalizedPhone.length < 11) {
    return res.status(400).json({ message: "Enter a valid phone number." });
  }

  try {
    const existing = await VendorApplication.findOne({ phone: normalizedPhone });
    if (existing) {
      return res.status(400).json({ message: "An application with this phone number already exists." });
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

// POST /api/vendor/verify-otp
async function verifyOtp(req, res) {
  const { vendorId, otp } = req.body;

  if (!vendorId || !otp) {
    return res.status(400).json({ message: "Vendor ID and OTP are required." });
  }

  try {
    const application = await VendorApplication.findById(vendorId);

    if (!application) {
      return res.status(404).json({ message: "Application not found. Please apply again." });
    }

    if (application.otp !== otp) {
      return res.status(400).json({ message: "Incorrect code. Please try again." });
    }

    application.phoneVerified = true;
    application.otp = null;
    await application.save();

    return res.status(200).json({ message: "Phone verified. Application is under review." });
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

// GET /api/vendor/applications  (admin only)
async function getApplications(req, res) {
  try {
    const adminCheck = await isAdmin(req.headers["x-user-id"]);
    if (!adminCheck) {
      return res.status(403).json({ message: "Access denied." });
    }

    const applications = await VendorApplication.find().sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
}

// PATCH /api/vendor/approve/:id  (admin only)
async function approveVendor(req, res) {
  try {
    const adminCheck = await isAdmin(req.headers["x-user-id"]);
    if (!adminCheck) {
      return res.status(403).json({ message: "Access denied." });
    }

    const application = await VendorApplication.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    return res.json({ message: "Vendor approved.", application });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
}

// PATCH /api/vendor/reject/:id  (admin only)
async function rejectVendor(req, res) {
  try {
    const adminCheck = await isAdmin(req.headers["x-user-id"]);
    if (!adminCheck) {
      return res.status(403).json({ message: "Access denied." });
    }

    const application = await VendorApplication.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    return res.json({ message: "Vendor rejected.", application });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { applyAsVendor, verifyOtp, resendOtp, getApplications, approveVendor, rejectVendor };
