import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@css/global/main.css";
import "@css/pages/terms.css";

export default function Terms() {
    return (
        <>
            {/* Navigation */}
            <Navbar />

            <section className="auth-container">
                <div className="container">
                    <div className="auth-card" style={{ maxWidth: "900px" }}>
                        <div className="auth-header" style={{ textAlign: "left" }}>
                            <h1>Terms of Service</h1>
                            <p className="last-updated">Last Updated: December 2025</p>
                        </div>

                        {/* Terms Content */}
                        {/* Note: legal-content is nested inside auth-card to use its styling */}
                        <div className="legal-content">
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

                            {/* Additional Sections (e.g., Use Restrictions, Disclaimer, Contact) */}

                            <h2>5. Use Restrictions and Prohibited Conduct</h2>
                            <p>You agree not to use the service for any purpose that is prohibited by these Terms. Prohibited activities include:</p>
                            <ul>
                                <li>Violating any local, state, national, or international law.</li>
                                <li>Harassing, abusing, or harming another person.</li>
                                <li>Attempting to interfere with or compromise the system integrity or security.</li>
                                <li>Copying, distributing, or disclosing any part of the service in any medium.</li>
                                <li>Using the service for any commercial solicitation purposes.</li>
                            </ul>

                            <h2>6. Intellectual Property</h2>
                            <p>All content on FinanceU, including text, graphics, logos, and course materials, is the property of FinanceU or its licensors and protected by intellectual property laws. Your use of the service grants you no rights to use the content except as explicitly authorized.</p>
                            <ul>
                                <li>Course content is for your **personal, non-commercial use only**.</li>
                                <li>You may not reproduce, redistribute, transmit, or sell any content without express written permission.</li>
                            </ul>

                            <h2>7. Disclaimer of Financial Advice</h2>
                            <p>
                                **The content provided by FinanceU is for educational purposes only and is not financial advice.** We are not a financial advisory firm. You should consult with a qualified professional before making any financial decisions. Your use of the information is at your own risk.
                            </p>

                            <h2>8. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by applicable law, FinanceU shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the service; (b) any conduct or content of any third party on the service; or (c) unauthorized access, use, or alteration of your transmissions or content.</p>

                            <h2>9. Governing Law</h2>
                            <p>These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.</p>

                            <h2>10. Changes to Terms</h2>
                            <p>We reserve the right to modify or replace these Terms at any time. We will provide at least 30 days notice before any new terms take effect. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.</p>

                            <h2>11. Contact Information</h2>
                            <p>Questions about the Terms of Service should be sent to us at:</p>
                            <ul>
                                <li>**Email:** support@financeu.org</li>
                                <li>**Address:** [Your Business Address]</li>
                            </ul>

                            <p style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid #e2e8f0" }}>
                                By using FinanceU, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </>
    );
}
