import { useEffect } from "react";
import "@css/main.css";

export default function Home() {
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener("click", handleSmoothScroll));

    // Cleanup
    return () => {
      links.forEach(link => link.removeEventListener("click", handleSmoothScroll));
    };
  }, []);

  return (
        <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo">
              Finance<span className="logo-accent">U</span>
            </div>
            <ul className="nav-links">
              <li>
                <a href="/curriculum">Curriculum</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li id="authButtons">
                <a href="/login" className="btn-primary">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-visual-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>
                        <h1 className="hero-title">
                            Stop Stressing About Money. <span className="highlight">Start Mastering It.</span>
                        </h1>
                        <p className="hero-subtitle">
                            The all-in-one finance platform for anyone starting their financial journey. Whether you're a college student, young professional, or just beginning to learn about money - no confusing jargon, no scattered resources. Just clear, practical money skills you'll actually use.
                        </p>
                        <div className="hero-cta">
                            <a href="/signup" className="btn-primary btn-large">Start Learning Free</a>
                            <a href="#features" className="btn-primary btn-large">See How It Works</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="problem-section">
                <div className="container">
                    <div className="problem-content">
                        <h2>Sound Familiar?</h2>
                        <div className="problem-grid">
                            {/* Card 1 */}
                            <div className="problem-card">
                                <div className="problem-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="8" y="16" width="48" height="32" rx="4" fill="#FEE2E2" />
                                        <rect x="8" y="16" width="48" height="10" rx="4" fill="#DC2626" />
                                        <circle cx="20" cy="36" r="3" fill="#DC2626" />
                                        <rect x="28" y="34" width="20" height="4" rx="2" fill="#DC2626" />
                                    </svg>
                                </div>
                                <h3>Credit Cards Confuse You</h3>
                                <p>You have no idea how interest rates work or which card to choose</p>
                            </div>

                            {/* Card 2 */}
                            <div className="problem-card">
                                <div className="problem-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="32" cy="32" r="20" fill="#FEF3C7" />
                                        <text x="32" y="40" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#F59E0B">$</text>
                                        <path d="M 20 50 Q 32 55 44 50" stroke="#F59E0B" strokeWidth="3" fill="none" strokeDasharray="2,2" />
                                    </svg>
                                </div>
                                <h3>Money Disappears</h3>
                                <p>Paycheck arrives, then vanishes. You're not sure where it all goes</p>
                            </div>

                            {/* Card 3 */}
                            <div className="problem-card">
                                <div className="problem-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M 10 50 L 20 35 L 30 40 L 40 25 L 50 30 L 54 20" stroke="#3B82F6" strokeWidth="3" fill="none" />
                                        <circle cx="20" cy="35" r="3" fill="#3B82F6" />
                                        <circle cx="30" cy="40" r="3" fill="#3B82F6" />
                                        <circle cx="40" cy="25" r="3" fill="#3B82F6" />
                                        <circle cx="50" cy="30" r="3" fill="#3B82F6" />
                                        <path d="M 50 20 L 54 20 L 54 24" stroke="#3B82F6" strokeWidth="3" fill="none" />
                                    </svg>
                                </div>
                                <h3>Investing Feels Impossible</h3>
                                <p>Stocks, bonds, 401k... it all sounds like another language</p>
                            </div>

                            {/* Card 4 */}
                            <div className="problem-card">
                                <div className="problem-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="32" cy="32" r="22" stroke="#6B7280" strokeWidth="3" fill="none" />
                                        <circle cx="32" cy="32" r="3" fill="#6B7280" />
                                        <text x="32" y="20" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#6B7280">?</text>
                                        <text x="18" y="32" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#6B7280">?</text>
                                        <text x="46" y="32" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#6B7280">?</text>
                                    </svg>
                                </div>
                                <h3>Information Overload</h3>
                                <p>Hours of YouTube videos and articles, still no clear answers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Solution Section */}
            <section className="solution-section">
                <div className="container">
                    <h2 className="section-title">Everything You Need, All in One Place</h2>
                    <p className="section-subtitle">
                        Stop piecing together advice from random Reddit threads. Get a structured path from zero to financially confident.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="26" fill="#EFF6FF" />
                                    <path d="M 14 28 L 24 38 L 42 18" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>11 Essential Financial Pillars</h3>
                            <p>Master the complete financial system through 11 core pillars, from money management fundamentals to retirement planning and long-term security.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="26" fill="#D1FAE5" />
                                    <rect x="18" y="14" width="20" height="28" rx="2" stroke="#00A676" strokeWidth="3" fill="none" />
                                    <line x1="22" y1="20" x2="34" y2="20" stroke="#00A676" strokeWidth="2" />
                                    <line x1="22" y1="26" x2="34" y2="26" stroke="#00A676" strokeWidth="2" />
                                    <line x1="22" y1="32" x2="28" y2="32" stroke="#00A676" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>Up to 88 Comprehensive Lessons</h3>
                            <p>Start with 24 free lessons covering 3 pillars, or unlock all 88 lessons across all 11 pillars with our Pro and Premium plans.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="26" fill="#FEF3C7" />
                                    <circle cx="28" cy="22" r="8" stroke="#F59E0B" strokeWidth="3" fill="none" />
                                    <path d="M 15 42 Q 15 32 28 32 Q 41 32 41 42" stroke="#F59E0B" strokeWidth="3" fill="none" />
                                </svg>
                            </div>
                            <h3>Expert-Written Content</h3>
                            <p>Every lesson is crafted by financial professionals and educators who understand the challenges of starting your financial journey.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="26" fill="#FCE7F3" />
                                    <circle cx="28" cy="28" r="18" stroke="#EC4899" strokeWidth="3" fill="none" />
                                    <line x1="28" y1="28" x2="28" y2="16" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="28" y1="28" x2="38" y2="28" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3>Self-Paced Learning</h3>
                            <p>Learn on your schedule. No deadlines, no pressure. Study during breaks, between classes, or late at night.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="26" fill="#EDE9FE" />
                                    <path d="M 20 15 L 36 15 L 38 20 L 36 25 L 20 25 L 18 20 Z" fill="#8B5CF6" opacity="0.3" />
                                    <path d="M 18 25 L 36 25 L 38 30 L 36 35 L 18 35 L 16 30 Z" fill="#8B5CF6" opacity="0.5" />
                                    <path d="M 16 35 L 34 35 L 36 40 L 34 45 L 16 45 L 14 40 Z" fill="#8B5CF6" opacity="0.7" />
                                </svg>
                            </div>
                            <h3>Structured Learning Path</h3>
                            <p>Lessons organized into 11 pillars covering everything from financial literacy basics, credit and debt, investing, budgeting, career finance, taxes, insurance, real estate, and retirement planning.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="28" cy="28" r="26" fill="#DBEAFE" />
                                    <circle cx="20" cy="28" r="3" fill="#3B82F6" />
                                    <path d="M 24 28 L 32 20" stroke="#3B82F6" strokeWidth="3" />
                                    <circle cx="36" cy="16" r="4" fill="#3B82F6" />
                                    <path d="M 24 28 L 32 36" stroke="#3B82F6" strokeWidth="3" />
                                    <circle cx="36" cy="40" r="4" fill="#3B82F6" />
                                </svg>
                            </div>
                            <h3>Beginner-Friendly Explanations</h3>
                            <p>No confusing jargon or complex terms. Every concept is broken down into simple, practical language you'll actually understand.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <div className="container">
                    <h2 className="section-title">Choose Your Plan</h2>
                    <p className="section-subtitle">Start free, upgrade when you're ready for more</p>

                    <div className="pricing-grid">
                        {/* Starter */}
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Starter</h3>
                                <div className="price">
                                    <span className="price-amount">$0</span>
                                    <span className="price-period">/forever</span>
                                </div>
                                <p className="pricing-description">Perfect for getting started with the basics</p>
                            </div>
                            <ul className="pricing-features">
                                <li className="feature-included">3 Core Financial Pillars</li>
                                <li className="feature-included">24 Lesson Plans</li>
                                <li className="feature-included">Actions You Can Take Now</li>
                                <li className="feature-excluded">Advanced Financial Pillars</li>
                                <li className="feature-excluded">Full Lesson Library</li>
                                <li className="feature-excluded">Premium Support</li>
                            </ul>
                            <a href="/signup" className="btn-outline btn-full">Start Free</a>
                        </div>

                        {/* Pro */}
                        <div className="pricing-card pricing-card-featured">
                            <div className="popular-badge">Most Popular</div>
                            <div className="pricing-header">
                                <h3>Pro</h3>
                                <div className="price">
                                    <span className="price-amount">$9.99</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <p className="pricing-description">Everything you need to master your finances</p>
                            </div>
                            <ul className="pricing-features">
                                <li className="feature-included">8 Financial Pillars</li>
                                <li className="feature-included">64 Lesson Plans</li>
                                <li className="feature-included">Actions You Can Take Now</li>
                                <li className="feature-included">Progress Tracking</li>
                                <li className="feature-excluded">All 11 Financial Pillars</li>
                                <li className="feature-excluded">Complete Lesson Library (88 lessons)</li>
                            </ul>
                            <a href="/signup" className="btn-primary btn-full">Start 7-Day Free Trial</a>
                        </div>

                        {/* Premium */}
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Premium</h3>
                                <div className="price">
                                    <span className="price-amount">$14.99</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <p className="pricing-description">For those who want complete financial mastery</p>
                            </div>
                            <ul className="pricing-features">
                                <li className="feature-included">All 11 Financial Pillars</li>
                                <li className="feature-included">88 Lesson Plans</li>
                                <li className="feature-included">Actions You Can Take Now</li>
                                <li className="feature-included">Advanced Progress Tracking</li>
                                <li className="feature-included">Complete Access to Everything</li>
                            </ul>
                            <a href="/signup" className="btn-outline btn-full">Start 7-Day Free Trial</a>
                        </div>
                    </div>

                    <div className="pricing-guarantee">
                        <p>30-Day Money-Back Guarantee • Cancel Anytime • No Hidden Fees</p>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section className="testimonials-section">
                <div className="container">
                    <h2
                        className="section-title"
                        style={{ textAlign: 'center', marginBottom: '1rem' }}
                    >
                        Want to give Feedback?
                    </h2>
                    <p
                        className="section-subtitle"
                        style={{ textAlign: 'center', marginBottom: '30px' }}
                    >
                        We'd love to hear from you! Share your thoughts, report bugs, or request features.
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <a href="/feedback" className="btn-primary btn-large">
                            Share Your Feedback
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Stop Stressing and Start Building Wealth?</h2>
                        <p>Take the first step toward financial confidence and security</p>
                        <a href="/signup" className="btn-primary btn-large">Get Started Free Today</a>
                        <p className="cta-subtext">No credit card required • Start learning in under 2 minutes</p>
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
                                <li><a href="/feedback">Give Feedback</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '10px' }}>
                            Disclaimer: FinanceU provides educational content only and does not offer financial, legal, or investment advice. Always consult with a qualified professional before making financial decisions.
                        </p>
                        <p>&copy; 2025 financeU. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
