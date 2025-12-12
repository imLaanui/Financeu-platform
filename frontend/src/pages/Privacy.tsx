import "@css/main.css";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export default function Privacy() {
    return (
        <>
            <Navbar />

            <section className="auth-container">
                <div className="container">
                    <div className="auth-card" style={{ maxWidth: "900px" }}>
                        <div className="auth-header" style={{ textAlign: "left" }}>
                            <h1>Privacy Policy</h1>
                            <p className="last-updated">Last Updated: December 2025</p>
                        </div>

                        <div className="legal-content">
                            <p>
                                At FinanceU, we take your privacy seriously. This Privacy Policy
                                explains how we collect, use, disclose, and safeguard your
                                information when you use our website and services.
                            </p>

                            <h2>1. Information We Collect</h2>
                            <h3>Personal Information</h3>
                            <ul>
                                <li>Name and email address when you create an account</li>
                                <li>Payment information when you subscribe to paid plans</li>
                                <li>Profile information you choose to provide</li>
                                <li>Communications you send to us</li>
                            </ul>

                            <h3>Usage Information</h3>
                            <ul>
                                <li>Log data (IP address, browser type, pages visited)</li>
                                <li>Device information (device type, operating system)</li>
                                <li>Course progress and completion data</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <h2>2. How We Use Your Information</h2>
                            <ul>
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process your transactions and send related information</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Track and analyze usage trends to improve user experience</li>
                                <li>Personalize your learning experience</li>
                                <li>Detect and prevent fraud and abuse</li>
                            </ul>

                            <h2>3. Information Sharing and Disclosure</h2>
                            <ul>
                                <li>
                                    <strong>Service Providers:</strong> We share information with
                                    third-party service providers who perform services on our
                                    behalf (payment processing, data analysis, email delivery)
                                </li>
                                <li>
                                    <strong>Legal Requirements:</strong> We may disclose information
                                    if required by law or in response to valid legal requests
                                </li>
                                <li>
                                    <strong>Business Transfers:</strong> In the event of a merger,
                                    acquisition, or sale of assets, your information may be
                                    transferred
                                </li>
                                <li>
                                    <strong>With Your Consent:</strong> We may share information
                                    with your explicit consent
                                </li>
                            </ul>

                            <h2>4. Data Security</h2>
                            <ul>
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments</li>
                                <li>Access controls and authentication</li>
                                <li>Secure payment processing through trusted providers</li>
                            </ul>
                            <p>
                                However, no method of transmission over the internet is 100%
                                secure, and we cannot guarantee absolute security.
                            </p>

                            <h2>5. Your Rights and Choices</h2>
                            <ul>
                                <li>
                                    <strong>Access:</strong> Request access to the personal
                                    information we hold about you
                                </li>
                                <li>
                                    <strong>Correction:</strong> Request correction of inaccurate
                                    information
                                </li>
                                <li>
                                    <strong>Deletion:</strong> Request deletion of your personal
                                    information
                                </li>
                                <li>
                                    <strong>Opt-Out:</strong> Unsubscribe from marketing
                                    communications
                                </li>
                                <li>
                                    <strong>Data Portability:</strong> Request a copy of your data
                                    in a portable format
                                </li>
                            </ul>
                            <p>To exercise these rights, please contact us at privacy@financeu.org.</p>

                            <h2>6. Cookies and Tracking Technologies</h2>
                            <p>
                                We use cookies and similar tracking technologies to track activity
                                on our service and hold certain information. You can instruct your
                                browser to refuse all cookies or to indicate when a cookie is being
                                sent. However, if you do not accept cookies, you may not be able
                                to use some portions of our service.
                            </p>

                            <h2>7. Third-Party Links</h2>
                            <p>
                                Our service may contain links to third-party websites. We are not
                                responsible for the privacy practices of these external sites. We
                                encourage you to read their privacy policies.
                            </p>

                            <h2>8. Children's Privacy</h2>
                            <p>
                                Our service is intended for users who are at least 13 years old. We
                                do not knowingly collect personal information from children under
                                13. If you are a parent or guardian and believe your child has
                                provided us with personal information, please contact us.
                            </p>

                            <h2>9. International Data Transfers</h2>
                            <p>
                                Your information may be transferred to and maintained on computers
                                located outside of your state, province, country, or other
                                governmental jurisdiction where data protection laws may differ. By
                                using our service, you consent to this transfer.
                            </p>

                            <h2>10. Changes to This Privacy Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify
                                you of any changes by posting the new Privacy Policy on this page
                                and updating the "Last Updated" date. You are advised to review
                                this Privacy Policy periodically for any changes.
                            </p>

                            <h2>11. Contact Us</h2>
                            <ul>
                                <li>Email: privacy@financeu.org</li>
                                <li>
                                    Contact Form: <a href="/contact" style={{ color: "#2563EB" }}>Contact Us</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
