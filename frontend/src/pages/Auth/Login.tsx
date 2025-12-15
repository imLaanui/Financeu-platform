import { useState, useEffect } from "react";
import { API_URL } from "@config/api";
import { useNavigate, useLocation } from "react-router-dom";
import "@css/auth/login.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);

    // Show message from signup/verification redirect
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            if (location.state?.email) {
                setEmail(location.state.email);
            }
        }
    }, [location]);

    // Hide messages
    const hideMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setShowResendVerification(false);
    };

    const handleResendVerification = async () => {
        if (!email) {
            setErrorMessage("Please enter your email address");
            return;
        }

        setLoading(true);
        hideMessages();

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

            setSuccessMessage("Verification email sent! Please check your inbox.");
            setShowResendVerification(false);
        } catch (error) {
            const err = error instanceof Error ? error : new Error("Failed to resend email");
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        hideMessages();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if email is not verified
                if (data.emailVerified === false) {
                    setErrorMessage(data.error || "Please verify your email before logging in");
                    setShowResendVerification(true);
                    setLoading(false);
                    return;
                }
                throw new Error(data.error || "Login failed");
            }

            const previousUserId = localStorage.getItem("userId");
            const newUserId = data.user.id;
            if (previousUserId && previousUserId !== newUserId) {
                Object.keys(localStorage).forEach((key) => {
                    if (key.includes("pillar1_") || key.includes("lesson") || key.includes("quiz")) {
                        localStorage.removeItem(key);
                    }
                });
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", newUserId);
            localStorage.setItem("userRole", data.user.role);

            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (error) {
            const err = error instanceof Error ? error : new Error("Login failed");
            console.error("Login error:", err);
            setErrorMessage(err.message);
            setLoading(false);
        }
    };

    // useEffect fix
    useEffect(() => {
        const checkIfLoggedIn = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
                if (response.ok) navigate("/dashboard");
            } catch {
                // stay on page
            }
        };
        checkIfLoggedIn();
    }, [navigate]);

    return (
        <section className="auth-container">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome Back!</h1>
                        <p>Log in to continue your financial education</p>
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    {showResendVerification && (
                        <div className="info-message">
                            <p>Didn't receive the email?</p>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={handleResendVerification}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Resend verification email"}
                            </button>
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

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                        <p style={{ marginTop: "10px" }}>
                            <a href="/forgot-password">Forgot your password?</a>
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
