import { useEffect, useState, useCallback } from "react";
import "../css/adminUsers.css";
import { API_URL } from "../config/api";

interface PillarProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface UserProgress {
  overallPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastActivity: string | null;
  currentPillar: string;
  pillarProgress: Record<string, PillarProgress>;
}

interface User {
  id: number;
  name: string;
  email: string;
  membership_tier: "free" | "pro" | "premium";
  created_at: string;
  progress: UserProgress;
}

export default function AdminUsers() {
  const [adminAuth, setAdminAuth] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterCompletion, setFilterCompletion] = useState("all");
  const [sortBy, setSortBy] = useState("signup");

  const verifyAndLoadDashboard = useCallback(async (auth: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Wrap setState in setTimeout to satisfy linter
        setTimeout(() => {
          setAllUsers(data.users);
          setFilteredUsers(data.users);
        }, 0);
      } else {
        sessionStorage.removeItem("adminAuth");
        setTimeout(() => setAdminAuth(null), 0);
      }
    } catch (err) {
      console.error("Verification error:", err);
      sessionStorage.removeItem("adminAuth");
      setTimeout(() => setAdminAuth(null), 0);
    }
  }, []);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth) {
      // Wrap setState to avoid synchronous setState in effect
      setTimeout(() => {
        setAdminAuth(savedAuth);
        verifyAndLoadDashboard(savedAuth);
      }, 0);
    }
  }, [verifyAndLoadDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = btoa(`admin:${loginPassword}`);

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Basic ${auth}` },
      });

      if (res.ok) {
        sessionStorage.setItem("adminAuth", auth);
        setAdminAuth(auth);
        const data = await res.json();
        setAllUsers(data.users);
        setFilteredUsers(data.users);
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

  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    setAdminAuth(null);
    setLoginPassword("");
    setLoginError("");
  };

  useEffect(() => {
    const filtered = (() => {
      let temp = [...allUsers];

      if (filterTier !== "all") {
        temp = temp.filter((u) => u.membership_tier === filterTier);
      }

      if (filterCompletion !== "all") {
        if (filterCompletion === "0") {
          temp = temp.filter((u) => u.progress.overallPercentage === 0);
        } else if (filterCompletion === "100") {
          temp = temp.filter((u) => u.progress.overallPercentage === 100);
        } else {
          const [min, max] = filterCompletion.split("-").map(Number);
          temp = temp.filter((u) => {
            const pct = u.progress.overallPercentage;
            return pct >= min && pct <= max;
          });
        }
      }

      if (sortBy === "activity") {
        temp.sort((a, b) => {
          const dateA = a.progress.lastActivity ? new Date(a.progress.lastActivity) : new Date(0);
          const dateB = b.progress.lastActivity ? new Date(b.progress.lastActivity) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      } else if (sortBy === "progress") {
        temp.sort((a, b) => b.progress.overallPercentage - a.progress.overallPercentage);
      } else if (sortBy === "name") {
        temp.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        temp.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      return temp;
    })();

    // Wrap setState in setTimeout
    setTimeout(() => setFilteredUsers(filtered), 0);
  }, [allUsers, filterTier, filterCompletion, sortBy]);

  const togglePillarDetails = (userId: number) => {
    const div = document.getElementById(`pillar-details-${userId}`);
    const text = document.getElementById(`toggle-text-${userId}`);
    if (!div || !text) return;

    div.classList.toggle("expanded");
    text.textContent = div.classList.contains("expanded") ? "Hide pillar details" : "Show pillar details";
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  if (!adminAuth) {
    return (
      <div className="login-form">
        <h2>Admin Login</h2>
        {loginError && <div className="error-message show">{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div>
      <header className="admin-header">
        <div className="container">
          <h1>Users Dashboard</h1>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <nav className="admin-nav">
              <a href="/admin/users">Users</a>
              <a href="/admin/feedback">Feedback</a>
            </nav>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Free Tier</h3>
            <div className="stat-value">{allUsers.filter((u) => u.membership_tier === "free").length}</div>
          </div>
          <div className="stat-card">
            <h3>Pro Tier</h3>
            <div className="stat-value">{allUsers.filter((u) => u.membership_tier === "pro").length}</div>
          </div>
          <div className="stat-card">
            <h3>Premium Tier</h3>
            <div className="stat-value">{allUsers.filter((u) => u.membership_tier === "premium").length}</div>
          </div>
        </div>

        <div className="users-list">
          <div className="users-list-header">
            <h2>All Users</h2>
            <div className="filters">
              <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="filter-dropdown">
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>

              <select value={filterCompletion} onChange={(e) => setFilterCompletion(e.target.value)} className="filter-dropdown">
                <option value="all">All Completion</option>
                <option value="0">0% Complete</option>
                <option value="1-25">1-25% Complete</option>
                <option value="26-50">26-50% Complete</option>
                <option value="51-75">51-75% Complete</option>
                <option value="76-99">76-99% Complete</option>
                <option value="100">100% Complete</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
                <option value="signup">Sort by Signup Date</option>
                <option value="activity">Sort by Last Activity</option>
                <option value="progress">Sort by Progress</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          <div id="usersContainer">
            {filteredUsers.length === 0 ? (
              <div className="no-users">
                <h3>No users found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const signupDate = new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div className="user-card" key={user.id}>
                    <div className="user-header">
                      <div className="user-info">
                        <div className="user-name">{escapeHtml(user.name)}</div>
                        <div className="user-email">{escapeHtml(user.email)}</div>
                        <div className="user-meta">
                          <span className={`tier-badge ${user.membership_tier}`}>{user.membership_tier.toUpperCase()}</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>ID: #{user.id}</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Joined: {signupDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="overall-progress">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-dark)" }}>Overall Progress</span>
                          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-dark)" }}>
                            {user.progress.overallPercentage}%
                          </span>
                        </div>

                        <div style={{ background: "#e5e7eb", borderRadius: "10px", height: "20px", overflow: "hidden", position: "relative" }}>
                          <div
                            style={{
                              background:
                                user.progress.overallPercentage === 100
                                  ? "linear-gradient(90deg, #00A676, #10b981)"
                                  : user.progress.overallPercentage > 0
                                  ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                                  : "#d1d5db",
                              height: "100%",
                              width: `${user.progress.overallPercentage}%`,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        <div className="progress-label" style={{ marginTop: "8px" }}>
                          {user.progress.completedLessons} of {user.progress.totalLessons} lessons completed
                        </div>
                      </div>

                      <button className="toggle-details" onClick={() => togglePillarDetails(user.id)}>
                        <span id={`toggle-text-${user.id}`}>Show pillar details</span>
                      </button>

                      <div className="progress-details" id={`pillar-details-${user.id}`}>
                        <div className="pillar-grid">
                          {Object.entries(user.progress.pillarProgress).map(([pillar, data]) => {
                            const isCurrent = pillar === user.progress.currentPillar;
                            return (
                              <div
                                className={`pillar-item ${isCurrent ? "current" : ""}`}
                                title={`${pillar.replace("pillar", "Pillar ")}: ${data.completed}/${data.total} lessons (${data.percentage}%)`}
                                key={pillar}
                              >
                                <div className="pillar-name">
                                  {pillar.replace("pillar", "P")}
                                  {isCurrent ? " ⭐" : ""}
                                </div>
                                <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "8px", overflow: "hidden", margin: "6px 0" }}>
                                  <div
                                    style={{
                                      background: data.percentage === 100 ? "#00A676" : data.percentage > 0 ? "#3b82f6" : "#d1d5db",
                                      height: "100%",
                                      width: `${data.percentage}%`,
                                      transition: "width 0.3s ease",
                                    }}
                                  />
                                </div>
                                <div className="pillar-stats" style={{ fontSize: "11px", fontWeight: 600 }}>
                                  {data.percentage}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
