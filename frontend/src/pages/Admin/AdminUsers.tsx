import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@config/api";
import { Link, useNavigate } from "react-router-dom";
import { isAdmin } from "@utils/auth";
import Footer from "@components/Footer";
import "@css/admin/adminFeedback.css";

interface FeedbackItem {
    id: number;
    name?: string;
    email?: string;
    type: string;
    message: string;
    created_at: string;
}

type SortField = "date" | "type" | "name";
type SortOrder = "asc" | "desc";

export default function AdminFeedback() {
    const navigate = useNavigate();
    const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
    const [filterType, setFilterType] = useState("all");
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);

    // Check admin auth
    useEffect(() => {
        if (!isAdmin()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const loadFeedback = useCallback(async () => {
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
            alert("Failed to load feedback");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFeedback();
    }, [loadFeedback]);

    const deleteFeedback = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/feedback/admin/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setAllFeedback((prev) => prev.filter((f) => f.id !== id));
                setShowDeleteModal(false);
                setFeedbackToDelete(null);
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

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading feedback...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>💬 Feedback Management</h1>
                    <div className="admin-header-actions">
                        <button className="btn-secondary" onClick={() => navigate("/admin/users")}>
                            Users →
                        </button>
                        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                            ← Back to Dashboard
                        </button>
                        <button className="btn-danger" onClick={() => navigate("/auth/signout")}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-container">
                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <div className="stat-label">Total Feedback</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🐛</div>
                        <div className="stat-info">
                            <div className="stat-label">Bug Reports</div>
                            <div className="stat-value">{stats.bug}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✨</div>
                        <div className="stat-info">
                            <div className="stat-label">Feature Requests</div>
                            <div className="stat-value">{stats.feature}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💬</div>
                        <div className="stat-info">
                            <div className="stat-label">General</div>
                            <div className="stat-value">{stats.general}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">❤️</div>
                        <div className="stat-info">
                            <div className="stat-label">Compliments</div>
                            <div className="stat-value">{stats.compliment}</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls-section">
                    <div className="search-bar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" strokeWidth="2" />
                            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm("")}>
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="filters">
                        <select
                            className="filter-select"
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
                            className="filter-select"
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
                <div className="feedback-table-container">
                    <div className="feedback-table-header">
                        <h2>Feedback ({sortedFeedback.length})</h2>
                    </div>

                    {sortedFeedback.length === 0 && !searchTerm && (
                        <div className="no-results">
                            <div className="no-results-icon">💬</div>
                            <h3>No feedback yet</h3>
                            <p>When users submit feedback, it will appear here</p>
                        </div>
                    )}

                    {sortedFeedback.length === 0 && searchTerm && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No results found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    )}

                    {sortedFeedback.length > 0 && (
                        <div className="feedback-table">
                            {sortedFeedback.map((item) => {
                                const date = new Date(item.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                                const typeClass = item.type.toLowerCase().replace(/\s+/g, "-");

                                return (
                                    <div className="feedback-row" key={item.id}>
                                        <div className="feedback-header-row">
                                            <div className="feedback-meta">
                                                <span className={`feedback-type-badge ${typeClass}`}>
                                                    {item.type}
                                                </span>
                                                <span className="feedback-date">
                                                    📅 {date}
                                                </span>
                                            </div>
                                            <button
                                                className="btn-icon danger"
                                                onClick={() => {
                                                    setFeedbackToDelete(item.id);
                                                    setShowDeleteModal(true);
                                                }}
                                                title="Delete this feedback"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
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
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && feedbackToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Feedback</h3>
                            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this feedback? This action cannot be undone.</p>
                            <div className="feedback-to-delete">
                                <strong>Type:</strong> {allFeedback.find((f) => f.id === feedbackToDelete)?.type}
                                <br />
                                <strong>Message:</strong> {allFeedback.find((f) => f.id === feedbackToDelete)?.message.substring(0, 100)}...
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={() => deleteFeedback(feedbackToDelete)}>
                                Delete Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}
