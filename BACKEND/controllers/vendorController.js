const VendorApplication = require("../models/VendorApplication");

async function applyAsVendor(req, res) {
  const { businessName, location, phone, category, menuDescription } = req.body;

  if (!businessName || !phone || !category) {
    return res
      .status(400)
      .json({ message: "Business name, phone, and category are required." });
  }

  try {
    const existing = await VendorApplication.findOne({ phone });
    if (existing) {
      return res
        .status(400)
        .json({ message: "An application with this phone number already exists." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const application = await VendorApplication.create({
      businessName,
      location,
      phone,
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


async function verifyOtp(req, res) {
  const { vendorId, otp } = req.body;

  try {
    const application = await VendorApplication.findById(vendorId);

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found. Please apply again." });
    }

    if (application.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Incorrect code. Please try again." });
    }

    application.phoneVerified = true;
    application.otp = null; 
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

module.exports = { applyAsVendor, verifyOtp, resendOtp };