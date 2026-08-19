import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function ResetPassword() {
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/data/reset/${token}`,
        { newPassword }
      );

      setMessage(res.data?.message || "Password reset successful 🎉");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-card">
        <div className="auth-badge">🔑 Reset Access</div>
        <h1 className="auth-title">Set a new password</h1>
        <p className="auth-subtitle">
          Choose a strong password for your account. Make sure it’s easy for you
          to remember but hard for others to guess.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <div className="status-msg status-success">{message}</div>}
        {error && <div className="status-msg status-error">{error}</div>}

        <div className="auth-footer">
          Back to <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;