import "../css/terms.css";

export default function Terms() {
  return (
    <>
      {/* Navigation */}
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

      {/* Terms Content */}
      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: December 2025</p>

        <p>
          Welcome to FinanceU. By accessing or using our website and services, you
          agree to be bound by these Terms of Service. Please read them carefully.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account, accessing, or using FinanceU's services, you
          agree to comply with and be bound by these Terms of Service and our
          Privacy Policy. If you do not agree to these terms, please do not use
          our services.
        </p>

        <h2>2. Description of Service</h2>
        <p>FinanceU provides online financial education courses and resources designed for beginners in personal finance. Our service includes:</p>
        <ul>
          <li>Educational courses and lessons organized into 11 financial pillars</li>
          <li>Up to 88 comprehensive lesson plans across different subscription tiers</li>
          <li>Actionable steps and guidance for implementing financial knowledge</li>
          <li>Progress tracking and completion certificates</li>
        </ul>

        <h2>3. User Accounts</h2>
        <h3>Account Creation</h3>
        <p>To access certain features, you must create an account. You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and update your information to keep it accurate</li>
          <li>Maintain the security of your password</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>

        <h3>Eligibility</h3>
        <p>You must be at least 13 years old to use our service. If you are under 18, you represent that you have your parent's or guardian's permission to use the service.</p>

        <h2>4. Subscription and Payment</h2>
        <h3>Free and Paid Plans</h3>
        <p>FinanceU offers both free and paid subscription plans. By subscribing to a paid plan, you agree to pay all applicable fees.</p>

        <h3>Billing</h3>
        <ul>
          <li>Subscriptions are billed on a recurring basis (monthly or annually)</li>
          <li>You authorize us to charge your payment method automatically</li>
          <li>Prices are subject to change with 30 days notice</li>
          <li>All fees are non-refundable except as required by law or stated in our refund policy</li>
        </ul>

        <h3>Cancellation</h3>
        <p>You may cancel your subscription at any time from your account settings. Cancellation will take effect at the end of your current billing period.</p>

        <h3>Refund Policy</h3>
        <p>We offer a 30-day money-back guarantee for new paid subscriptions. To request a refund, contact us at support@financeu.org within 30 days of your initial purchase.</p>

        {/* Continue all other sections the same way */}
        <p style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid #e2e8f0" }}>
          By using FinanceU, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>

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
            <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: 10 }}>
              Disclaimer: FinanceU provides educational content only and does not offer financial, legal, or investment advice. Always consult with a qualified professional before making financial decisions.
            </p>
            <p>&copy; 2025 FinanceU. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
