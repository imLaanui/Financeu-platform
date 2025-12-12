import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@config/api";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@css/navbar.css";
import "@css/buttons.css";
import "@css/sections.css";
import "@css/help.css";

export default function Help() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(() => {
        const cached = localStorage.getItem("authState");
        return cached ? JSON.parse(cached).isLoggedIn : null;
    });
    const [searchTerm, setSearchTerm] = useState("");

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

    // FAQ items
    const faqItems = [
        {
            question: "Is FinanceU really free?",
            answer:
                "Yes! Our Starter plan is completely free forever. You get access to 3 core financial pillars with 24 lesson plans and actionable steps you can take now. No credit card required to sign up.",
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer:
                "Absolutely. You can cancel your Pro or Premium subscription at any time from your account settings. There are no cancellation fees, and you'll retain access until the end of your billing period.",
        },
        {
            question: "Do I need any prior financial knowledge?",
            answer:
                "Not at all! FinanceU is designed for complete beginners. Our courses start with the absolute basics and build up gradually. If you can read this, you're qualified to start learning.",
        },
        {
            question: "How long does it take to complete a lesson?",
            answer:
                "Each lesson is designed to be completed in 10-20 minutes, but you can go at your own pace. Learn on your schedule - during breaks, between classes, or whenever works best for you.",
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. All payments are processed securely through Stripe.",
        },
        {
            question: "Is my personal information secure?",
            answer:
                "Yes. We take your privacy seriously and use industry-standard encryption to protect your data. We never sell your information to third parties. Read our Privacy Policy for more details.",
        },
        {
            question: "Can I access FinanceU on my phone?",
            answer:
                "Yes! Our website is fully mobile-responsive and works great on phones and tablets. Access your lessons anytime, anywhere from any device with a web browser.",
        },
        {
            question: "Do you offer student discounts?",
            answer:
                "Our pricing is already student-friendly! However, if you're facing financial hardship, reach out to us at support@financeu.org. We're committed to making financial education accessible to everyone.",
        },
    ];

    // Filtered FAQs
    const filteredFaqs = faqItems.filter(
        (item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()) || item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navigation */}
            <Navbar />

            {/* Help Hero */}
            <section
                className="help-hero"
                style={{
                    padding: "80px 20px 60px",
                    textAlign: "center",
                    color: "white",
                    background: "linear-gradient(135deg, #0A1A2F 0%, #1a3a5c 100%)",
                }}
            >
                <h1 style={{ fontSize: "3rem", marginBottom: 20 }}>How Can We Help You?</h1>
                <p style={{ fontSize: "1.25rem", opacity: 0.9 }}>Search our help center or browse categories below</p>
                <div className="help-search" style={{ maxWidth: 600, margin: "40px auto 0" }}>
                    <input
                        type="text"
                        placeholder="Search for help..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px 24px",
                            borderRadius: 50,
                            border: "none",
                            fontSize: 16,
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                    />
                </div>
            </section>

            {/* Help Content */}
            <div className="help-content" style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 20px", flex: 1 }}>
                {/* Categories */}
                <div className="help-categories" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, marginBottom: 60 }}>
                    <div className="category-card">
                        <h3>Getting Started</h3>
                        <ul>
                            <li><Link to="#signup">How do I sign up?</Link></li>
                            <li><Link to="#first-lesson">Taking your first lesson</Link></li>
                            <li><Link to="#navigation">Navigating the platform</Link></li>
                            <li><Link to="#profile">Setting up your profile</Link></li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>Billing & Subscriptions</h3>
                        <ul>
                            <li><Link to="#pricing">What are the pricing plans?</Link></li>
                            <li><Link to="#upgrade">How to upgrade my account</Link></li>
                            <li><Link to="#cancel">Canceling my subscription</Link></li>
                            <li><Link to="#refund">Refund policy</Link></li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>Courses & Learning</h3>
                        <ul>
                            <li><Link to="#progress">Tracking your progress</Link></li>
                            <li><Link to="#lessons">Accessing lessons</Link></li>
                            <li><Link to="#resources">Using course resources</Link></li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>Technical Support</h3>
                        <ul>
                            <li><Link to="#login-issues">Login problems</Link></li>
                            <li><Link to="#password">Reset your password</Link></li>
                            <li><Link to="#browser">Browser compatibility</Link></li>
                        </ul>
                    </div>
                </div>

                {/* FAQs */}
                <section className="faq-section">
                    <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: 40 }}>Frequently Asked Questions</h2>
                    {filteredFaqs.map((faq, idx) => (
                        <div key={idx} className="faq-item" style={{ background: "white", padding: 25, borderRadius: 12, marginBottom: 20, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <div className="faq-question" style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 15, display: "flex", gap: 12 }}>
                                <span>❓</span>
                                <span>{faq.question}</span>
                            </div>
                            <div className="faq-answer" style={{ color: "var(--text-secondary)", lineHeight: 1.6, paddingLeft: 32 }}>
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Contact CTA */}
                <div className="contact-cta" style={{ textAlign: "center", marginTop: 60, padding: 40, background: "#f7fafc", borderRadius: 12 }}>
                    <h3 style={{ fontSize: "2rem", marginBottom: 15 }}>Still Have Questions?</h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 25 }}>Can't find what you're looking for? Our support team is here to help.</p>
                    <Link to="/contact" className="btn-primary btn-large">Contact Support</Link>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
