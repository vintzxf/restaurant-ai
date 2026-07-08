const bcrypt = require("bcrypt");
const VendorApplication = require("../models/VendorApplication");
const User = require("../models/User");

async function isAdmin(userId) {
  if (!userId) return false;
  const user = await User.findById(userId);
  return user && user.role === "admin";
}

// POST /api/vendor/apply
async function applyAsVendor(req, res) {
  const { businessName, location, phone, email, password, category, menuDescription } = req.body;

  if (!businessName || !phone || !category || !email || !password) {
    return res.status(400).json({
      message: "Business name, phone, email, password, and category are required.",
    });
  }

  try {
    const existingApplication = await VendorApplication.findOne({ phone });
    if (existingApplication) {
      return res.status(400).json({
        message: "An application with this phone number already exists.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const application = await VendorApplication.create({
      businessName,
      location,
      phone,
      email,
      password: hashedPassword,
      category,
      menuDescription,
      otp,
    });

    console.log(`\n OTP for ${phone} → ${otp}\n`);

    return res.status(201).json({ vendorId: application._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

// POST /api/vendor/verify-otp
async function verifyOtp(req, res) {
  const { vendorId, otp } = req.body;

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

    // Now that the phone is confirmed real, create the vendor's login account.
    // It starts as "pending" — they CAN log in, but the dashboard stays locked
    // until an admin approves them. This is what lets them check status later
    // without resubmitting the whole form.
    let user = await User.findOne({ email: application.email });
    if (!user) {
      user = await User.create({
        name: application.businessName,
        email: application.email,
        password: application.password, // already hashed
        phone: application.phone,
        businessName: application.businessName,
        role: "vendor",
        status: "pending",
        applicationId: application._id,
      });
    }

    return res.status(200).json({
      message: "Phone verified. Your application is under review.",
      applicationId: application._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

// POST /api/vendor/resend-otp
async function resendOtp(req, res) {
  const { vendorId } = req.body;

  try {
    const application = await VendorApplication.findById(vendorId);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    application.otp = newOtp;
    await application.save();

    console.log(`\n Resent OTP for ${application.phone} → ${newOtp}\n`);

    return res.status(200).json({ message: "OTP resent." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

// GET /api/vendor/status/:phone
// Lets someone check application status by phone without logging in — used by
// the Pending Approval page as a fallback (e.g. right after applying, before
// any account/session exists yet).
async function getStatusByPhone(req, res) {
  try {
    const application = await VendorApplication.findOne({ phone: req.params.phone });
    if (!application) {
      return res.status(404).json({ message: "No application found for this phone number." });
    }

    return res.json({
      status: application.status,
      phoneVerified: application.phoneVerified,
      businessName: application.businessName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
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

    // Keep the linked User account in sync so login actually unlocks the dashboard
    await User.findOneAndUpdate({ applicationId: application._id }, { status: "active" });

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

    await User.findOneAndUpdate({ applicationId: application._id }, { status: "rejected" });

    return res.json({ message: "Vendor rejected.", application });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
}

// DELETE /api/vendor/clear-test/:phone
// Dev-only convenience: deletes a test application AND its linked user account
// so the phone number and email can be reused while you're testing the flow.
// Blocked outside development so it can never accidentally run in production.
async function clearTestApplication(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Not available in production." });
  }

  try {
    const application = await VendorApplication.findOneAndDelete({ phone: req.params.phone });
    if (!application) {
      return res.status(404).json({ message: "No application found for this phone number." });
    }

    await User.findOneAndDelete({ applicationId: application._id });

    return res.json({ message: `Cleared application and account for ${req.params.phone}.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
  applyAsVendor,
  verifyOtp,
  resendOtp,
  getStatusByPhone,
  getApplications,
  approveVendor,
  rejectVendor,
  clearTestApplication,
};