import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Auth.css";
import "./PendingApproval.css";

const STEPS = [
  {
    icon: "✅",
    label: "Application submitted",
    done: true,
  },
  {
    icon: "✅",
    label: "Phone number verified",
    done: true,
  },
  {
    icon: "⏳",
    label: "Admin review (up to 24 hrs)",
    done: false,
  },
  {
    icon: "🔒",
    label: "Account activated",
    done: false,
  },
];

export default function PendingApproval() {
  return (
    <>
      <Navbar />
      <div className="auth-page pending-page">
        <div className="auth-card pending-card card">
          <div className="pending-icon">🎉</div>
          <h1>You're in the queue!</h1>
          <p className="subtitle">
            Your application and phone number have been verified. Our admin
            team will review your details and activate your vendor account
            within 24 hours.
          </p>

          <div className="steps-list">
            {STEPS.map((step, i) => (
              <div key={i} className={"step-row" + (step.done ? " done" : "")}>
                <span className="step-icon">{step.icon}</span>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>

          <div className="pending-info-box">
            <p>
              We'll notify you once your account is approved. In the meantime,
              you can browse CounterAI as a customer.
            </p>
          </div>

          <Link to="/" className="btn btn-primary full-width">
            Go to Homepage
          </Link>

          <p className="switch-text">
            Questions? <a href="mailto:support@counterai.ng">Contact support</a>
          </p>
        </div>
      </div>
    </>
  );
}
