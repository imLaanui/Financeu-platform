import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "@config/api";
import "@css/auth/login.css";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get token and email from URL parameters (hidden from user)
    const [email] = useState(searchParams.get("email") || "");
    const [token] = useState(searchParams.get("token") || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Check if token exists on mount
    useEffect(() => {
        if (!token || !email) {
            setErrorMessage("Invalid or missing reset link. Please request a new password reset link.");
        }
    }, [token, email]);

    const hideMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        hideMessages();

        // Validation
        if (!email || !token) {
            setErrorMessage("Invalid reset link. Please request a new password reset link.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    token,
                    newPassword
                }),
            });

            const data: { error?: string; message?: string } = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setSuccessMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            const err = error instanceof Error ? error : new Error("Failed to reset password");
            console.error("Reset password error:", err);
            setErrorMessage(err.message);
            setLoading(false);
        }
    };

    return (
        <section className="auth-container">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Reset Your Password</h1>
                        <p>Enter your new password below</p>
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                required
                                placeholder="Enter new password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={!email || !token}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={!email || !token}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || !email || !token}
                        >
                            {loading ? "Resetting password..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have a reset link? <a href="/forgot-password">Request reset link</a>
                        </p>
                        <p style={{ marginTop: "10px" }}>
                            Remember your password? <a href="/login">Log in</a>
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
