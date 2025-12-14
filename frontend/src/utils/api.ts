import { API_URL } from "@config/api";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
    membershipTier: "free" | "pro" | "premium";
    createdAt: string;
}

// Fetch all users (admin only)
export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/admin/users`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data.users || [];
};

// Update user role
export const updateUserRole = async (
    userId: number,
    newRole: "user" | "admin"
): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
        throw new Error("Failed to update user role");
    }
};

// Update user membership tier
export const updateUserTier = async (
    userId: number,
    newTier: "free" | "pro" | "premium"
): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/tier`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
    });

    if (!response.ok) {
        throw new Error("Failed to update membership tier");
    }
};

// Delete a single user
export const deleteUser = async (userId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
};

// Bulk delete users
export const bulkDeleteUsers = async (userIds: number[]): Promise<void> => {
    const deletePromises = userIds.map((userId) =>
        fetch(`${API_URL}/admin/users/${userId}`, {
            method: "DELETE",
            credentials: "include",
        })
    );

    const responses = await Promise.all(deletePromises);
    const failed = responses.filter((r) => !r.ok);

    if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} user(s)`);
    }
};

// Bulk update user tier
export const bulkUpdateTier = async (
    userIds: number[],
    tier: "free" | "pro" | "premium"
): Promise<void> => {
    const updatePromises = userIds.map((userId) =>
        fetch(`${API_URL}/admin/users/${userId}/tier`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tier }),
        })
    );

    const responses = await Promise.all(updatePromises);
    const failed = responses.filter((r) => !r.ok);

    if (failed.length > 0) {
        throw new Error(`Failed to update ${failed.length} user(s)`);
    }
};
