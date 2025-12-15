import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@config/api";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@components/Footer";
import "@css/admin/adminFeedback.css";

interface FeedbackItem {
    id: number;
    name?: string;
    email?: string;
    type: string; // Changed from feedback_type to match backend
    message: string;
    created_at: string;
}

type SortField = "date" | "type" | "name";
type SortOrder = "asc" | "desc";

export default function AdminFeedback() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
    const [filterType, setFilterType] = useState("all");
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Verify admin authentication
    const verifyAdmin = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user?.role === "admin") {
                    setIsAdmin(true);
                    loadFeedback();
                } else {
                    setIsAdmin(false);
                    navigate("/");
                }
            } else {
                setIsAdmin(false);
                navigate("/auth/login");
            }
        } catch (error) {
            console.error("Auth verification error:", error);
            setIsAdmin(false);
            navigate("/auth/login");
        }
    }, [navigate]);

    useEffect(() => {
        verifyAdmin();
    }, [verifyAdmin]);

    const loadFeedback = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/feedback/admin`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to load feedback");
            }

            const data = await res.json();
            setAllFeedback(data.feedback || []);
        } catch (error) {
            console.error("Error loading feedback:", error);
            setAllFeedback([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteFeedback = async (id: number) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return;

        try {
            const res = await fetch(`${API_URL}/feedback/admin/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setAllFeedback((prev) => prev.filter((f) => f.id !== id));
            } else {
                alert("Failed to delete feedback");
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("Error deleting feedback");
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    // Filter feedback by type
    const filteredByType = filterType === "all"
        ? allFeedback
        : allFeedback.filter((f) => f.type === filterType);

    // Filter by search term
    const filteredBySearch = filteredByType.filter((f) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            f.message.toLowerCase().includes(searchLower) ||
            f.name?.toLowerCase().includes(searchLower) ||
            f.email?.toLowerCase().includes(searchLower) ||
            f.type.toLowerCase().includes(searchLower)
        );
    });

    // Sort feedback
    const sortedFeedback = [...filteredBySearch].sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
            case "date":
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                break;
            case "type":
                comparison = a.type.localeCompare(b.type);
                break;
            case "name":
                const nameA = a.name || "Zzz";
                const nameB = b.name || "Zzz";
                comparison = nameA.localeCompare(nameB);
                break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
    });

    // Calculate stats
    const stats = {
        total: allFeedback.length,
        bug: allFeedback.filter((f) => f.type === "Bug Report").length,
        feature: allFeedback.filter((f) => f.type === "Feature Request").length,
        general: allFeedback.filter((f) => f.type === "General Feedback").length,
        compliment: allFeedback.filter((f) => f.type === "Compliment").length,
    };

    const escapeHtml = (text: string) => {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    };

    // Show loading state while checking auth
    if (isAdmin === null) {
        return (
            <div className="loading-container">
                <div className="loading">Verifying authentication...</div>
            </div>
        );
    }

    // If not admin, don't render anything (will redirect)
    if (!isAdmin) {
        return null;
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
                                <Link to="/auth/signout" className="btn-primary">
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <header className="admin-header">
                <div className="container">
                    <h1>Feedback Dashboard</h1>
                    <p>Manage and review user feedback</p>
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

                {/* Controls */}
                <div className="feedback-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="control-group">
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

                        <select
                            className="sort-dropdown"
                            value={`${sortField}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split("-") as [SortField, SortOrder];
                                setSortField(field);
                                setSortOrder(order);
                            }}
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="type-asc">Type (A-Z)</option>
                            <option value="type-desc">Type (Z-A)</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>

                {/* Results count */}
                {searchTerm && (
                    <div className="results-info">
                        Showing {sortedFeedback.length} of {allFeedback.length} feedback items
                    </div>
                )}

                {/* Feedback List */}
                <div className="feedback-list">
                    <div id="feedbackContainer">
                        {loading && <div className="loading">Loading feedback...</div>}

                        {!loading && sortedFeedback.length === 0 && !searchTerm && (
                            <div className="no-feedback">
                                <h3>No feedback yet</h3>
                                <p>When users submit feedback, it will appear here</p>
                            </div>
                        )}

                        {!loading && sortedFeedback.length === 0 && searchTerm && (
                            <div className="no-feedback">
                                <h3>No results found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )}

                        {!loading &&
                            sortedFeedback.map((item) => {
                                const date = new Date(item.created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                                const typeClass = item.type.toLowerCase().replace(/\s+/g, "-");

                                return (
                                    <div className="feedback-item" key={item.id}>
                                        <div className="feedback-header">
                                            <div className="feedback-meta">
                                                <span className={`feedback-type ${typeClass}`}>
                                                    {item.type}
                                                </span>
                                                <span className="feedback-date">
                                                    📅 {date}
                                                </span>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteFeedback(item.id)}
                                                title="Delete this feedback"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>

                                        <div className="feedback-body">
                                            {(item.name || item.email) && (
                                                <div className="feedback-contact">
                                                    {item.name && (
                                                        <span className="contact-item">
                                                            <strong>👤 Name:</strong> {escapeHtml(item.name)}
                                                        </span>
                                                    )}
                                                    {item.email && (
                                                        <span className="contact-item">
                                                            <strong>✉️ Email:</strong>{" "}
                                                            <a href={`mailto:${item.email}`}>
                                                                {escapeHtml(item.email)}
                                                            </a>
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="feedback-message">
                                                <strong>Message:</strong>
                                                <p>{escapeHtml(item.message)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
}
