import React, { useState } from "react";
import { API_URL } from "@config/api";
import "@css/auth/login.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const hideMessages = () => {
        setErrorMsg(null);
        setSuccessMsg(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        hideMessages();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send reset email");
            }

            // Success - show message that email was sent
            setSuccessMsg(data.message || "Password reset instructions have been sent to your email.");
            setEmail(""); // Clear the email field
        } catch (error: unknown) {
            console.error("Forgot password error:", error);
            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-container">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Reset Password</h1>
                        <p>Enter your email to receive password reset instructions</p>
                    </div>

                    {errorMsg && <div className="error-message">{errorMsg}</div>}
                    {successMsg && (
                        <div className="success-message">
                            <p>{successMsg}</p>
                            <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#666" }}>
                                Please check your email inbox (and spam folder) for the reset link.
                                The link will expire in 1 hour.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Instructions"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Remember your password? <a href="/login">Log in</a>
                        </p>
                        <p style={{ marginTop: "10px" }}>
                            Already have a reset link? <a href="/reset-password">Reset password</a>
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
