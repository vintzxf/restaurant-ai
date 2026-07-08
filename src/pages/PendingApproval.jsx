import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";
import "./PendingApproval.css";

export default function PendingApproval() {
  const location = useLocation();

  const [status, setStatus] = useState(location.state?.status || null);
  const [businessName, setBusinessName] = useState(location.state?.businessName || "");
  const [loading, setLoading] = useState(!location.state);

  useEffect(() => {
    // If we arrived here from SignIn, we already have the status — no fetch needed.
    if (location.state) return;

    // Otherwise (e.g. straight after verifying OTP, or a page refresh), fall
    // back to looking it up by the phone number saved during application.
    const phone = sessionStorage.getItem("pendingPhone");
    if (!phone) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/vendor/status/${phone}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setStatus(data.status);
          setBusinessName(data.businessName || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [location.state]);

  const isRejected = status === "rejected";
  const isApproved = status === "approved" || status === "active";

  const steps = [
    { icon: "✅", label: "Application submitted", done: true },
    { icon: "✅", label: "Phone number verified", done: true },
    {
      icon: isRejected ? "❌" : isApproved ? "✅" : "⏳",
      label: isRejected ? "Admin review — not approved" : "Admin review (up to 24 hrs)",
      done: isApproved || isRejected,
    },
    { icon: isApproved ? "✅" : "🔒", label: "Account activated", done: isApproved },
  ];

  return (
    <>
      <Navbar />
      <div className="auth-page pending-page">
        <div className="auth-card pending-card card">
          <div className="pending-icon">{isRejected ? "😕" : "🎉"}</div>

          <h1>
            {loading
              ? "Checking your status…"
              : isRejected
              ? "Application not approved"
              : isApproved
              ? "You're approved!"
              : "You're in the queue!"}
          </h1>

          <p className="subtitle">
            {isRejected
              ? "Unfortunately your application wasn't approved this time. Contact support if you'd like more details or to reapply."
              : isApproved
              ? `Welcome aboard${businessName ? `, ${businessName}` : ""}! You can now sign in to your vendor dashboard.`
              : "Your application and phone number have been verified. Our admin team will review your details and activate your vendor account within 24 hours."}
          </p>

          <div className="steps-list">
            {steps.map((step, i) => (
              <div key={i} className={"step-row" + (step.done ? " done" : "")}>
                <span className="step-icon">{step.icon}</span>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>

          {!isRejected && (
            <div className="pending-info-box">
              <p>
                {isApproved
                  ? "You can log in any time with the email and password from your application."
                  : "We'll notify you once your account is approved. In the meantime, you can browse CounterAI as a customer — and come back to sign in any time to check your status."}
              </p>
            </div>
          )}

          <Link
            to={isApproved ? "/signin" : "/"}
            className="btn btn-primary full-width"
          >
            {isApproved ? "Go to Sign In" : "Go to Homepage"}
          </Link>

          <p className="switch-text">
            Questions? <a href="mailto:support@counterai.ng">Contact support</a>
          </p>
        </div>
      </div>
    </>
  );
}