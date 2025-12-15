import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@config/api";
import { isAdmin } from "@utils/auth";
import "@css/admin/adminUsers.css";

interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
    membershipTier: "free" | "pro" | "premium";
    createdAt: string;
}

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTier, setFilterTier] = useState("all");
    const [filterRole, setFilterRole] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Check admin auth
    useEffect(() => {
        if (!isAdmin()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data.users || []);
            setFilteredUsers(data.users || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Filter and sort users
    useEffect(() => {
        let filtered = [...users];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.id.toString().includes(query)
            );
        }

        // Tier filter
        if (filterTier !== "all") {
            filtered = filtered.filter((user) => user.membershipTier === filterTier);
        }

        // Role filter
        if (filterRole !== "all") {
            filtered = filtered.filter((user) => user.role === filterRole);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "name":
                    return a.name.localeCompare(b.name);
                case "email":
                    return a.email.localeCompare(b.email);
                default:
                    return 0;
            }
        });

        setFilteredUsers(filtered);
    }, [users, searchQuery, filterTier, filterRole, sortBy]);

    // Select/deselect user
    const toggleUserSelection = (userId: number) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    // Select all visible users
    const selectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
        }
    };

    // Update user role
    const updateUserRole = async (userId: number, newRole: "user" | "admin") => {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                fetchUsers();
            } else {
                alert("Failed to update user role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Error updating user role");
        }
    };

    // Update user tier
    const updateUserTier = async (userId: number, newTier: "free" | "pro" | "premium") => {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/tier`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier: newTier }),
            });

            if (response.ok) {
                fetchUsers();
            } else {
                alert("Failed to update membership tier");
            }
        } catch (error) {
            console.error("Error updating tier:", error);
            alert("Error updating membership tier");
        }
    };

    // Delete user
    const deleteUser = async (userId: number) => {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                fetchUsers();
                setShowDeleteModal(false);
                setUserToDelete(null);
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user");
        }
    };

    // Bulk delete users
    const bulkDeleteUsers = async () => {
        if (selectedUsers.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)?`)) return;

        try {
            const deletePromises = Array.from(selectedUsers).map((userId) =>
                fetch(`${API_URL}/admin/users/${userId}`, {
                    method: "DELETE",
                    credentials: "include",
                })
            );

            await Promise.all(deletePromises);
            fetchUsers();
            setSelectedUsers(new Set());
            setShowBulkActions(false);
        } catch (error) {
            console.error("Error bulk deleting:", error);
            alert("Error deleting users");
        }
    };

    // Bulk update tier
    const bulkUpdateTier = async (tier: "free" | "pro" | "premium") => {
        if (selectedUsers.size === 0) return;

        try {
            const updatePromises = Array.from(selectedUsers).map((userId) =>
                fetch(`${API_URL}/admin/users/${userId}/tier`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tier }),
                })
            );

            await Promise.all(updatePromises);
            fetchUsers();
            setSelectedUsers(new Set());
            setShowBulkActions(false);
        } catch (error) {
            console.error("Error bulk updating:", error);
            alert("Error updating users");
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>⚡ User Management</h1>
                    <div className="admin-header-actions">
                        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                            ← Back to Dashboard
                        </button>
                        <button className="btn-danger" onClick={() => navigate("/signout")}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-container">
                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <div className="stat-label">Total Users</div>
                            <div className="stat-value">{users.length}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🆓</div>
                        <div className="stat-info">
                            <div className="stat-label">Free Tier</div>
                            <div className="stat-value">{users.filter((u) => u.membershipTier === "free").length}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <div className="stat-label">Pro Tier</div>
                            <div className="stat-value">{users.filter((u) => u.membershipTier === "pro").length}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💎</div>
                        <div className="stat-info">
                            <div className="stat-label">Premium Tier</div>
                            <div className="stat-value">{users.filter((u) => u.membershipTier === "premium").length}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-info">
                            <div className="stat-label">Admins</div>
                            <div className="stat-value">{users.filter((u) => u.role === "admin").length}</div>
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
                            placeholder="Search by name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery("")}>
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="filters">
                        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="filter-select">
                            <option value="all">All Tiers</option>
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="premium">Premium</option>
                        </select>

                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
                            <option value="all">All Roles</option>
                            <option value="user">Users</option>
                            <option value="admin">Admins</option>
                        </select>

                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="email">Email (A-Z)</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.size > 0 && (
                    <div className="bulk-actions-bar">
                        <div className="bulk-info">
                            <span>{selectedUsers.size} user(s) selected</span>
                            <button className="btn-text" onClick={() => setSelectedUsers(new Set())}>
                                Clear selection
                            </button>
                        </div>
                        <div className="bulk-buttons">
                            <button className="btn-bulk" onClick={() => setShowBulkActions(!showBulkActions)}>
                                Bulk Actions ▼
                            </button>
                            {showBulkActions && (
                                <div className="bulk-dropdown">
                                    <button onClick={() => bulkUpdateTier("free")}>Set to Free</button>
                                    <button onClick={() => bulkUpdateTier("pro")}>Set to Pro</button>
                                    <button onClick={() => bulkUpdateTier("premium")}>Set to Premium</button>
                                    <div className="dropdown-divider"></div>
                                    <button className="danger" onClick={bulkDeleteUsers}>
                                        Delete Selected
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="users-table-container">
                    <div className="users-table-header">
                        <div className="table-title">
                            <h2>Users ({filteredUsers.length})</h2>
                        </div>
                        <div className="table-actions">
                            <button className="btn-select-all" onClick={selectAll}>
                                {selectedUsers.size === filteredUsers.length ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No users found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="users-table">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className={`user-row ${selectedUsers.has(user.id) ? "selected" : ""}`}>
                                    <div className="user-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.has(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
                                        />
                                    </div>

                                    <div className="user-main-info">
                                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                        <div className="user-details">
                                            <div className="user-name-row">
                                                <span className="user-name">{user.name}</span>
                                                {user.role === "admin" && <span className="admin-badge">⚡ Admin</span>}
                                            </div>
                                            <div className="user-email">{user.email}</div>
                                            <div className="user-meta-info">
                                                <span>ID: #{user.id}</span>
                                                <span>•</span>
                                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="user-tier-control">
                                        <label>Membership</label>
                                        <select
                                            value={user.membershipTier}
                                            onChange={(e) => updateUserTier(user.id, e.target.value as any)}
                                            className={`tier-select ${user.membershipTier}`}
                                        >
                                            <option value="free">Free</option>
                                            <option value="pro">Pro</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>

                                    <div className="user-role-control">
                                        <label>Role</label>
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                                            className={`role-select ${user.role}`}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="user-actions">
                                        <button
                                            className="btn-icon danger"
                                            onClick={() => {
                                                setUserToDelete(user.id);
                                                setShowDeleteModal(true);
                                            }}
                                            title="Delete user"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete User</h3>
                            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                            <div className="user-to-delete">
                                {users.find((u) => u.id === userToDelete)?.name}
                                <br />
                                <small>{users.find((u) => u.id === userToDelete)?.email}</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={() => deleteUser(userToDelete)}>
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
