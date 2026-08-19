import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/v1/data/login`, {
        email,
        password,
      });

      setMessage(res?.data?.message || "Login successful");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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

            <div className="auth-kicker">Identity • Access • Security</div>

            <h1 className="auth-hero">
              Welcome back to your{" "}
              <span className="soft-accent">beautifully secure space.</span>
            </h1>

            <p className="auth-subtitle">
              A softer, more polished login flow designed to feel effortless,
              modern and visually refined.
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-panel">
            <div className="panel-head">
              <div className="panel-chip">Welcome Back</div>
              <h2 className="panel-title">Login</h2>
              <p className="panel-subtitle">
                Sign in and continue with a clean, premium authentication experience.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
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
                    placeholder="Enter your password"
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

              <div className="forgot-row">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {message && <div className="status-msg status-success">{message}</div>}
            {error && <div className="status-msg status-error">{error}</div>}

            <div className="auth-footer">
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;