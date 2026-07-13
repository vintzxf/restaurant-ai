const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(toEmail, otp, businessName) {
  await transporter.sendMail({
    from: `"CounterAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your CounterAI Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Verify your CounterAI vendor account</h2>
        <p>Hi ${businessName || "there"},</p>
        <p>Use the code below to verify your account. This code expires in 10 minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; background: #f4f4f4; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };