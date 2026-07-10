import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";
import "./VerifyPhone.css";

export default function VerifyPhone() {
  const navigate = useNavigate();

  const phone = sessionStorage.getItem("pendingPhone") || "";
  const vendorId = sessionStorage.getItem("pendingVendorId") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [devOtp, setDevOtp] = useState(sessionStorage.getItem("pendingDevOtp") || "");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((count) => count - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!phone || !vendorId) navigate("/vendor-apply");
  }, [phone, vendorId, navigate]);

  function handleDigitChange(index, value) {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = ["", "", "", "", "", ""];

    for (let index = 0; index < pasted.length; index += 1) {
      updated[index] = pasted[index];
    }

    setDigits(updated);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/verify-otp`, {
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

      sessionStorage.removeItem("pendingPhone");
      sessionStorage.removeItem("pendingVendorId");
      sessionStorage.removeItem("pendingDevOtp");
      navigate("/pending-approval");
    } catch (error) {
      setErrorMessage("Failed to connect to server.");
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setErrorMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to resend. Try again.");
        return;
      }

      if (data.devOtp) {
        sessionStorage.setItem("pendingDevOtp", data.devOtp);
        setDevOtp(data.devOtp);
      }

      setResendCooldown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
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
          <div className="verify-icon">Phone</div>
          <h1>Verify your number</h1>
          <p className="subtitle">
            We sent a 6-digit code to <strong>{maskedPhone}</strong>.
            Enter it below to confirm your phone number.
          </p>

          <form onSubmit={handleVerify}>
            <div className="otp-row" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
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

          {devOtp && (
            <p className="dev-note">
              Dev mode OTP: <strong>{devOtp}</strong>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
