export type UserRole = "user" | "admin";

export const isAdmin = (): boolean => {
    const role = localStorage.getItem("userRole");
    return role === "admin";
};

export const getUserRole = (): UserRole | null => {
    const role = localStorage.getItem("userRole");
    return role === "user" || role === "admin" ? role : null;
};
