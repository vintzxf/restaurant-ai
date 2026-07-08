import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";
import "./VerifyPhone.css";

export default function VerifyPhone() {
  const navigate = useNavigate();

  // Pull the phone that VendorApply saved
  const phone = sessionStorage.getItem("pendingPhone") || "";
  const vendorId = sessionStorage.getItem("pendingVendorId") || "";

  // 6 individual digit inputs
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpSent, setOtpSent] = useState(true); // assume sent on arrival

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // If no phone in session, send back
  useEffect(() => {
    if (!phone) navigate("/vendor-apply");
  }, [phone, navigate]);

  function handleDigitChange(index, value) {
    // Only allow single digits
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    // Backspace on empty input moves focus back
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setDigits(updated);
    // Focus last filled input
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();
    setErrorMessage("");

    const otp = digits.join("");
    if (otp.length < 6) {
      setErrorMessage("Enter all 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/vendor/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Invalid code. Try again.");
        setLoading(false);
        return;
      }

      // OTP passed — clear session and go to pending page
      sessionStorage.setItem("approvalVendorId", vendorId);
      sessionStorage.removeItem("pendingPhone");
      sessionStorage.removeItem("pendingVendorId");
      sessionStorage.setItem("approvalVendorId", vendorId)
      navigate("/pending-approval");
    } catch (error) {
      setErrorMessage("Failed to connect to server.");
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    try {
      await fetch("http://localhost:3000/api/vendor/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId }),
      });
      setResendCooldown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setErrorMessage("Failed to resend. Try again.");
    }
  }

  const maskedPhone = phone
    ? phone.slice(0, 4) + "****" + phone.slice(-3)
    : "your number";

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card verify-card card">
          <div className="verify-icon">📱</div>
          <h1>Verify your number</h1>
          <p className="subtitle">
            We sent a 6-digit code to <strong>{maskedPhone}</strong>.
            Enter it below to confirm your phone number.
          </p>

          <form onSubmit={handleVerify}>
            <div className="otp-row" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify Code"}
            </button>
          </form>

          <p className="resend-row">
            Didn't get it?{" "}
            <button
              className="resend-btn"
              onClick={handleResend}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </p>

          {/* Dev helper — remove in production */}
          <p className="dev-note">
            🛠 Dev mode: check your server console for the OTP code.
          </p>
        </div>
      </div>
    </>
  );
}
