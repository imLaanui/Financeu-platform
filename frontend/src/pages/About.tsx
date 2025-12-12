import { useEffect } from "react";
import Navbar from "@components/Navbar";
import "@css/main.css";

export default function About() {
    useEffect(() => {
        const authButtons = document.getElementById("authButtons");

        // Load cached auth state
        const cachedAuth = localStorage.getItem("authState");
        if (cachedAuth) {
            const authState = JSON.parse(cachedAuth);
            if (authButtons) {
                authButtons.innerHTML = authState.isLoggedIn
                    ? `<a href="/dashboard" class="btn-primary">Dashboard</a>`
                    : `<a href="/login" class="btn-primary">Login</a>`;
                authButtons.style.opacity = "1";
            }
        } else if (authButtons) {
            // default state
            authButtons.innerHTML = `<a href="/login" class="btn-primary">Login</a>`;
            authButtons.style.opacity = "1";
        }
    }, []);

    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* About Hero Section */}
            <section className="hero" style={{ padding: "80px 0 60px" }}>
                <div className="container">
                    <div className="hero-content" style={{ textAlign: "center" }}>
                        <h1 className="hero-title">
                            Hey, I'm the founder of Finance<span className="logo-accent">U</span>
                        </h1>
                        <p className="hero-subtitle">
                            A college finance major who got tired of watching my friends (and
                            myself) struggle with money because no one ever taught us how it
                            actually works.
                        </p>
                    </div>
                </div>
            </section>

            {/* My Story Section */}
            <section className="features-section">
                <div className="container">
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "50px",
                            fontSize: "2.5rem",
                            fontWeight: 700,
                        }}
                    >
                        My Story
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            gap: "50px",
                            alignItems: "center",
                            maxWidth: "1100px",
                            margin: "0 auto",
                            flexWrap: "wrap",
                        }}
                    >
                        <div
                            style={{
                                flex: "0 0 300px",
                                minWidth: "250px",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="./AboutUsImage.jpeg"
                                alt="La'anui - Founder of FinanceU"
                                style={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    height: "auto",
                                    aspectRatio: "1",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <p style={{ margin: "0 0 25px", lineHeight: 1.8, fontSize: "1.05rem" }}>
                                My name is La'anui, and I'm a college student pursuing a degree in Business Finance. I used to be terrified of anything money-related. Credit cards confused me, investing sounded like gambling with extra steps, and budgeting felt impossible.
                            </p>
                            <p style={{ margin: "0 0 25px", lineHeight: 1.8, fontSize: "1.05rem" }}>
                                In college, I learned that most students feel the same way. Many take on debt without understanding how the system works, not because they're careless, but because no one teaches us how to manage money.
                            </p>
                            <p style={{ margin: "0 0 25px", lineHeight: 1.8, fontSize: "1.05rem" }}>
                                That pushed me to major in finance. As I learned more, I realized the information was scattered and written for professionals, not for students trying to manage their first real expenses.
                            </p>
                            <p style={{ margin: 0, lineHeight: 1.8, fontSize: "1.05rem" }}>
                                <strong>That's why I built FinanceU.</strong> One platform with simple lessons that don't teach you <em>how to make money</em>, but <em>how to manage it</em>. FinanceU offers simple and clear explanations for the financial system, the way I wish someone had explained it to me.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Makes This Different */}
            <section className="solution-section">
                <div className="container">
                    <h2 className="section-title">What Makes FinanceU Different</h2>
                    <div className="features-grid" style={{ maxWidth: 900, margin: "0 auto" }}>
                        <div className="feature-card">
                            <h3>Built by a Student, for Students</h3>
                            <p>I'm not a financial advisor or some rich guy selling courses. I'm a finance major who learned this stuff the hard way and wanted to make it easier for you.</p>
                        </div>
                        <div className="feature-card">
                            <h3>All-in-One Platform</h3>
                            <p>No more piecing together information from 10 different sources. Everything you need to learn the financial system is in one place.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Actually Beginner-Friendly</h3>
                            <p>Written in plain English, not finance textbook jargon. If I can understand it, you can too.</p>
                        </div>
                        <div className="feature-card">
                            <h3>The Complete System</h3>
                            <p>From opening your first bank account to understanding retirement accounts. The full financial system, organized into 11 essential pillars.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="features-section" style={{ background: "linear-gradient(to bottom, #f9fafb 0%, white 100%)", padding: "60px 0" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <h2 className="section-title" style={{ color: "var(--text-dark)" }}>My Mission</h2>
                    <p className="section-subtitle" style={{ maxWidth: 700, margin: "0 auto", lineHeight: 1.8, fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                        To give every college student the financial education that school never provided. So you can graduate knowing how to actually manage money, build credit, invest for your future, and avoid the mistakes I almost made.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Join Us on This Journey</h2>
                        <p>Start taking control of your financial future today</p>
                        <a href="/signup" className="btn-primary btn-large">Get Started Free</a>
                    </div>
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
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/careers">Careers</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="/help">Help Center</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "10px" }}>
                            Disclaimer: FinanceU provides educational content only and does not offer financial, legal, or investment advice. Always consult with a qualified professional before making financial decisions.
                        </p>
                        <p>&copy; 2025 FinanceU. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
