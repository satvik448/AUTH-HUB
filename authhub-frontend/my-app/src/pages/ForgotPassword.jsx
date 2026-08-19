import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/data/forget`,
        { email }
      );

      setMessage(res.data?.message || "Reset link sent to your email");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-copy">
            <div className="auth-badge">
              <span className="auth-badge-dot"></span>
              AuthHub
            </div>

            <div className="auth-kicker">Password • Recovery • Access</div>

            <h1 className="auth-hero">
              Forgot your <span className="soft-accent">password?</span>
            </h1>

            <p className="auth-subtitle">
              Enter your registered email and we’ll send you a reset link.
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-panel">
            <div className="panel-head">
              <div className="panel-chip">Forgot Password</div>
              <h2 className="panel-title">Recover access</h2>
              <p className="panel-subtitle">
                We’ll send a reset link to your email address.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleForgotPassword}>
              <div className="field">
                <label>Email Address</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            {message && <div className="status-msg status-success">{message}</div>}
            {error && <div className="status-msg status-error">{error}</div>}

            <div className="auth-footer">
              Back to <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;