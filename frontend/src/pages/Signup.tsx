import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@config/api";
import "@css/Login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const hideMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    hideMessages();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data: { user: { id: string }; token: string; error?: string } =
        await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      // Clear previous progress data
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("pillar1_") || key.includes("lesson") || key.includes("quiz")) {
          localStorage.removeItem(key);
        }
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Registration failed");
      console.error("Signup error:", err);
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        if (response.ok) navigate("/dashboard");
      } catch {
        // not logged in
      }
    };
    checkIfLoggedIn();
  }, [navigate]);

  return (
    <section className="auth-container">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Start Your Journey</h1>
            <p>Create your free account to begin learning</p>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="form-hint">Use your .edu email for student benefits</div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="form-hint">At least 6 characters</div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </div>

        <div className="back-home">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </section>
  );
}
