import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "@config/api";
import "@css/auth/login.css";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");
            const emailParam = searchParams.get("email");

            if (!token || !emailParam) {
                setStatus("error");
                setMessage("Invalid verification link. Please check your email for the correct link.");
                return;
            }

            setEmail(emailParam);

            try {
                const response = await fetch(`${API_URL}/auth/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email: emailParam, token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Verification failed");
                }

                // Store auth data if provided (auto-login after verification)
                if (data.token && data.user) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.user.id);
                    localStorage.setItem("userRole", data.user.role);
                }

                setStatus("success");
                setMessage("Email verified successfully! Redirecting to dashboard...");

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } catch (error) {
                const err = error instanceof Error ? error : new Error("Verification failed");
                console.error("Verification error:", err);
                setStatus("error");
                setMessage(err.message);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    const handleResendVerification = async () => {
        if (!email) return;

        try {
            const response = await fetch(`${API_URL}/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to resend verification email");
            }

            setMessage("Verification email sent! Please check your inbox for a new link.");
        } catch (error) {
            const err = error instanceof Error ? error : new Error("Failed to resend email");
            setMessage(err.message);
        }
    };

    return (
        <section className="auth-container">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>
                            {status === "loading" && "Verifying Email..."}
                            {status === "success" && "✅ Email Verified!"}
                            {status === "error" && "❌ Verification Failed"}
                        </h1>
                    </div>

                    {status === "loading" && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Please wait while we verify your email...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    {status === "error" && (
                        <>
                            <div className="error-message">
                                {message}
                            </div>
                            {email && (
                                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                                    <button
                                        type="button"
                                        className="btn-submit"
                                        onClick={handleResendVerification}
                                    >
                                        Resend Verification Email
                                    </button>
                                </div>
                            )}
                            <div className="auth-footer">
                                <p>
                                    <a href="/login">Return to Login</a>
                                </p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <div className="auth-footer">
                            <p>
                                Not redirected? <a href="/dashboard">Go to Dashboard</a>
                            </p>
                        </div>
                    )}
                </div>

                <div className="back-home">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </section>
    );
}
