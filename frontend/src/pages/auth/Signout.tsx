import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@config/api";
import "@css/auth/login.css";

export default function Signout() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Clear localStorage
                localStorage.removeItem("authState");
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRole");

                // Call logout endpoint
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                });

                setStatus("success");

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } catch (error) {
                console.error("Logout error:", error);
                setStatus("error");

                // Still redirect even if API call fails
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        };

        performLogout();
    }, [navigate]);

    return (
        <section className="auth-container">
            <div className="container">
                <div className="auth-card">
                    {status === "loading" && (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <div
                                style={{
                                    fontSize: "3rem",
                                    marginBottom: "1rem",
                                    animation: "spin 1s linear infinite",
                                }}
                            >
                                ⟳
                            </div>
                            <h2>Logging you out...</h2>
                            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                                Please wait a moment
                            </p>
                        </div>
                    )}

                    {status === "success" && (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👋</div>
                            <h2>Successfully logged out!</h2>
                            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                                Redirecting you to home...
                            </p>
                        </div>
                    )}

                    {status === "error" && (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✓</div>
                            <h2>Logged out</h2>
                            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                                Redirecting you to home...
                            </p>
                        </div>
                    )}

                    <div className="auth-footer" style={{ marginTop: "2rem" }}>
                        <p>
                            Want to come back? <a href="/login">Log in</a>
                        </p>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </section>
    );
}
