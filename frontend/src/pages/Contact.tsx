import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@config/api";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@css/navbar.css";
import "@css/buttons.css";
import "@css/sections.css";

export default function Contact() {
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

            {/* Contact Section */}
            <section
                className="contact-section"
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px 20px",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 800 }}>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: 30, color: "var(--text-primary)" }}>
                        Want to Get in Touch?
                    </h1>
                    <p style={{ fontSize: "1.2rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 40 }}>
                        We don't have a dedicated support team yet, but we'd love to hear from you! Share your questions,
                        feedback, bug reports, or feature requests through our feedback forum.
                    </p>
                    <Link
                        to="/feedback"
                        className="btn-primary btn-large"
                        style={{ display: "inline-block", padding: "16px 40px", textDecoration: "none" }}
                    >
                        Go to Feedback Forum
                    </Link>
                    <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginTop: 30, opacity: 0.8 }}>
                        Your feedback helps me improve FinanceU for all students.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
