import "./Home.css";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo">Finance<span className="logo-accent">U</span></div>
            <ul className="nav-links">
              <li><a href="/curriculum">Curriculum</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="/about">About</a></li>
              <li id="authButtons" style={{ opacity: 0 }}></li>
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
                  {/* SVG kept untouched */}
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
    </>
  );
}
