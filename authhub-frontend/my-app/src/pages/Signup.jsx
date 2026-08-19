import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/v1/data/signup`, {
        name,
        email,
        password,
      });

      setMessage(res?.data?.message || "Signup successful");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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

            <div className="auth-kicker">Identity • Access • Recovery</div>

            <h1 className="auth-hero">
              Create your account with a <span className="soft-accent">cleaner aesthetic.</span>
            </h1>

            <p className="auth-subtitle">
              Soft, minimal and premium — a signup experience designed to feel
              calm, modern and beautifully put together.
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-panel">
            <div className="panel-head">
              <div className="panel-chip">Create Account</div>
              <h2 className="panel-title">Sign up</h2>
              <p className="panel-subtitle">
                Create your account and step into a cleaner, more thoughtful auth experience.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSignup}>
              <div className="field">
                <label>Full Name</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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

              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            {message && <div className="status-msg status-success">{message}</div>}
            {error && <div className="status-msg status-error">{error}</div>}

            <div className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;