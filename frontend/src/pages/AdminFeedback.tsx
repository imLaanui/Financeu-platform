import { useEffect, useState, useCallback } from "react";
import "../css/adminFeedback.css";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

interface FeedbackItem {
  id: number;
  name?: string;
  email?: string;
  feedback_type: string;
  message: string;
  created_at: string;
}

export default function AdminFeedback() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [adminAuth, setAdminAuth] = useState<string | null>(null);

  // Verify admin credentials
  const verifyLogin = useCallback(async (auth: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/feedback`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (res.ok) {
        setLoggedIn(true);
        loadFeedback(auth);
      } else {
        sessionStorage.removeItem("adminAuth");
      }
    } catch {
      sessionStorage.removeItem("adminAuth");
    }
  }, []);

  // Check session storage for auth
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth) {
      setAdminAuth(savedAuth);
      verifyLogin(savedAuth);
    }
  }, [verifyLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = btoa(`admin:${password}`);
    try {
      const res = await fetch(`${API_URL}/admin/feedback`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (res.ok) {
        setAdminAuth(auth);
        sessionStorage.setItem("adminAuth", auth);
        setLoggedIn(true);
        loadFeedback(auth);
      } else {
        setLoginError("Invalid password");
      }
    } catch (err) {
      if (err instanceof Error) {
        setLoginError(`Network error: ${err.message}`);
      } else {
        setLoginError("Unknown network error");
      }
    }
  };

  const loadFeedback = async (auth: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/feedback`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!res.ok) throw new Error("Failed to load feedback");
      const data = await res.json();
      setAllFeedback(data.feedback);
    } catch {
      setAllFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setLoggedIn(false);
    setPassword("");
    setAdminAuth(null);
    setAllFeedback([]);
  };

  const deleteFeedback = async (id: number) => {
    if (!adminAuth) return;
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${adminAuth}` },
      });
      if (res.ok) {
        setAllFeedback((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Failed to delete feedback");
      }
    } catch {
      alert("Error deleting feedback");
    }
  };

  const filteredFeedback =
    filterType === "all"
      ? allFeedback
      : allFeedback.filter((f) => f.feedback_type === filterType);

  const stats = {
    total: allFeedback.length,
    bug: allFeedback.filter((f) => f.feedback_type === "Bug Report").length,
    feature:
      allFeedback.filter((f) => f.feedback_type === "Feature Request").length,
    compliment:
      allFeedback.filter((f) => f.feedback_type === "Compliment").length,
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  if (!loggedIn) {
    return (
      <div className="login-form">
        <h2>Admin Login</h2>
        {loginError && <div className="error-message show">{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          <button className="login-btn">Login</button>
        </form>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo">
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Finance<span className="logo-accent">U</span>
              </Link>
            </div>
            <ul className="nav-links">
              <li>
                <Link to="/admin/users">Users</Link>
              </li>
              <li>
                <Link to="/admin/feedback">Feedback</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="admin-header">
        <div className="container">
          <h1>Feedback Dashboard</h1>
        </div>
      </header>

      <div className="admin-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Feedback</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Bug Reports</h3>
            <div className="stat-value">{stats.bug}</div>
          </div>
          <div className="stat-card">
            <h3>Feature Requests</h3>
            <div className="stat-value">{stats.feature}</div>
          </div>
          <div className="stat-card">
            <h3>Compliments</h3>
            <div className="stat-value">{stats.compliment}</div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="feedback-list">
          <div className="feedback-list-header">
            <h2>All Feedback</h2>
            <select
              className="filter-dropdown"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Bug Report">Bug Reports</option>
              <option value="Feature Request">Feature Requests</option>
              <option value="General Feedback">General Feedback</option>
              <option value="Compliment">Compliments</option>
            </select>
          </div>

          <div id="feedbackContainer">
            {loading && <div className="loading">Loading feedback...</div>}
            {!loading && filteredFeedback.length === 0 && (
              <div className="no-feedback">
                <h3>No feedback yet</h3>
                <p>When users submit feedback, it will appear here</p>
              </div>
            )}
            {!loading &&
              filteredFeedback.map((item) => {
                const date = new Date(item.created_at).toLocaleString();
                const typeClass = item.feedback_type
                  .toLowerCase()
                  .replace(" ", "-");

                return (
                  <div className="feedback-item" key={item.id}>
                    <div className="feedback-header">
                      <div className="feedback-meta">
                        <span className={`feedback-type ${typeClass}`}>
                          {item.feedback_type}
                        </span>
                        <span className="feedback-date">{date}</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => deleteFeedback(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                    {(item.name || item.email) && (
                      <div className="feedback-contact">
                        {item.name && <strong>Name:</strong>}{" "}
                        {item.name && escapeHtml(item.name)}
                        {item.name && item.email ? " | " : ""}
                        {item.email && <strong>Email:</strong>}{" "}
                        {item.email && escapeHtml(item.email)}
                      </div>
                    )}
                    <div className="feedback-message">
                      {escapeHtml(item.message)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 FinanceU. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
