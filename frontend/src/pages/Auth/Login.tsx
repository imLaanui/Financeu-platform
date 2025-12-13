import { useState, useEffect } from "react";
import { API_URL } from "@config/api";
import { useNavigate } from "react-router-dom";
import "@css/auth/login.css";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Hide messages
    const hideMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
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

            const data: { user: { id: string }; token: string; error?: string } = await response.json();

            if (!response.ok) throw new Error(data.error || "Login failed");

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
