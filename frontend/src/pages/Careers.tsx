import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@config/api";
import Navbar from "@components/Navbar";
import "@css/navbar.css";
import "@css/buttons.css";
import "@css/sections.css";

export default function Careers() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(() => {
        const cached = localStorage.getItem("authState");
        return cached ? JSON.parse(cached).isLoggedIn : null;
    });

    useEffect(() => {
        async function fetchAuth() {
            try {
                const response = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
                if (response.ok) {
                    localStorage.setItem("authState", JSON.stringify({ isLoggedIn: true }));
                    setIsLoggedIn(true);
                } else {
                    localStorage.setItem("authState", JSON.stringify({ isLoggedIn: false }));
                    setIsLoggedIn(false);
                }
            } catch {
                localStorage.setItem("authState", JSON.stringify({ isLoggedIn: false }));
                setIsLoggedIn(false);
            }
        }

        fetchAuth();
    }, []);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navigation */}
            <Navbar />

            {/* Coming Soon Section */}
            <section
                className="coming-soon-section"
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "60px 20px",
                    textAlign: "center",
                }}
            >
                <div className="coming-soon-content" style={{ maxWidth: 600 }}>
                    <h1 className="coming-soon-title" style={{ fontSize: "3rem", marginBottom: 30, color: "var(--text-primary)" }}>
                        Coming Soon
                    </h1>
                    <p className="coming-soon-text" style={{ fontSize: "1.2rem", marginBottom: 20, color: "var(--text-secondary)" }}>
                        We're currently a small team focused on building the best financial education platform for students.
                        We're not hiring right now, but we're always excited to hear from passionate people who share our mission!
                    </p>
                    <p className="coming-soon-text" style={{ fontSize: "1.2rem", marginBottom: 30, color: "var(--text-secondary)" }}>
                        Check back later or reach out to us at{" "}
                        <Link to="/contact" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                            our contact page
                        </Link>{" "}
                        if you'd like to stay in touch.
                    </p>
                    <Link to="/" className="btn-primary btn-large" style={{ padding: "16px 40px" }}>
                        Back to Home
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>FinanceU</h4>
                            <p>Making financial literacy accessible for everyone.</p>
                        </div>
                        <div className="footer-section">
                            <h4>Company</h4>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/careers">Careers</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Support</h4>
                            <ul>
                                <li><Link to="/help">Help Center</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: 10 }}>
                            Disclaimer: FinanceU provides educational content only and does not offer financial, legal, or investment advice. Always consult with a qualified professional before making financial decisions.
                        </p>
                        <p>&copy; 2025 FinanceU. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
