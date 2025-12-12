import "@css/Curriculum.css";

const pillars = [
    {
        number: "Pillar 1",
        icon: "💡",
        title: "Financial Literacy Foundations",
        description: "Start your journey with the fundamentals. Learn how money actually works, understand banking basics, and build the foundation for every financial decision you'll make. No more feeling lost when people talk about finances.",
        lessons: 8,
        hours: "2 hours",
        topics: [
            "How the banking system works",
            "Understanding interest rates",
            "Checking vs. savings accounts",
            "Financial terminology decoded",
        ],
        availability: "Available Now",
        tier: "Free",
        cta: "Start Learning Free →",
        ctaLink: "/pillar1-lessons"
    },
    {
        number: "Pillar 2",
        icon: "🎯",
        title: "Financial Goal Setting",
        description: "Stop daydreaming and start achieving. Learn how to set realistic financial goals, create action plans, and actually follow through. Whether it's buying a car, studying abroad, or building an emergency fund.you'll know exactly how to make it happen.",
        lessons: 8,
        hours: "2 hours",
        topics: [
            "Setting SMART financial goals",
            "Short-term vs. long-term planning",
            "Creating actionable timelines",
            "Tracking progress effectively",
        ],
        availability: "Coming 2026",
        tier: "Free",
        cta: "Coming 2026",
        disabled: true
    },
    // Add remaining pillars here...
];

export default function Curriculum() {
    return (
        <>
            {/* Navbar at the top */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-wrapper">
                        <div className="logo">
                            <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
                                Finance<span className="logo-accent">U</span>
                            </a>
                        </div>
                        <ul className="nav-links">
                            <li><a href="/curriculum">Curriculum</a></li>
                            <li><a href="/#features">Features</a></li>
                            <li><a href="/#pricing">Pricing</a></li>
                            <li><a href="/about">About</a></li>
                            <li id="authButtons" style={{ opacity: 0 }}></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="curriculum-hero">
                <div className="curriculum-hero-content">
                    <h1>Master Money in 11 Pillars</h1>
                    <p>A complete financial education designed for college students. Learn the real system, not just theory.</p>

                    <div className="curriculum-stats">
                        <div className="stat-item">
                            <span className="stat-number">11</span>
                            <span className="stat-label">Core Pillars</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">88</span>
                            <span className="stat-label">Total Lessons</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">20+</span>
                            <span className="stat-label">Hours of Content</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section className="pillars-section">
                <div className="container">
                    {/* Pillars Intro */}
                    <div className="pillar-info">
                        <h2>What is a Pillar?</h2>
                        <p>
                            Think of each pillar as a building block of financial knowledge. Master all 11, and you'll understand the complete money system. These aren't random tips or theoretical lessons. They're practical skills that work together to help you manage money, build wealth, and actually know what you're doing with your finances.
                        </p>
                    </div>

                    {/* Pillars Grid */}
                    <div className="pillars-grid">
                        {pillars.map((pillar, idx) => (
                            <div key={idx} className="pillar-card-premium">
                                <div className="pillar-card-header">
                                    <div className="pillar-icon">{pillar.icon}</div>
                                    <div className="pillar-badges">
                                        <span
                                            className={`availability-badge ${pillar.availability === "Available Now" ? "available" : "coming-soon"
                                                }`}
                                        >
                                            {pillar.availability}
                                        </span>
                                        <span className={`tier-badge ${pillar.tier.toLowerCase()}`}>{pillar.tier}</span>
                                    </div>
                                </div>

                                {/* Pillar Card Body */}
                                <div className="pillar-card-body">
                                    <div className="pillar-number">{pillar.number}</div>
                                    <h3 className="pillar-title">{pillar.title}</h3>
                                    <p className="pillar-description">{pillar.description}</p>
                                    {/* ...meta and topics sections here */}
                                </div>

                                {/* Pillar Card Footer */}
                                <div className="pillar-card-footer">
                                    <button className={`pillar-cta ${pillar.availability !== "Available Now" ? "disabled" : ""}`}>
                                        {pillar.availability === "Available Now" ? "Start Learning →" : pillar.availability}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Master Your Money?</h2>
                        <p>Start with Pillar 1 for free, or unlock all 11 pillars with Pro or Premium</p>
                        <a href="/signup" className="btn-primary btn-large">Get Started Free</a>
                        <p className="cta-subtext">No credit card required • Start learning in 2 minutes</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>FinanceU</h4>
                            <p>Making financial literacy accessible for college students.</p>
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
                                <li><a href="/feedback">Give Feedback</a></li>
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
