import { useState, useEffect } from "react";
import { API_URL } from "@config/api";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@css/pages/feedback.css";

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        feedbackType: "",
        message: "",
    });

    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [, setIsLoggedIn] = useState(false);

    // Update auth state
    useEffect(() => {
        const cachedAuth = localStorage.getItem("authState");
        if (cachedAuth) setIsLoggedIn(JSON.parse(cachedAuth).isLoggedIn);

        async function verifyAuth() {
            try {
                const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
                if (res.ok) {
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

        verifyAuth();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name || null,
                    email: formData.email || null,
                    feedbackType: formData.feedbackType,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setMessage({ text: "Thank you! Your feedback has been submitted successfully.", type: "success" });
                setFormData({ name: "", email: "", feedbackType: "", message: "" });
            } else {
                const data = await response.json();
                setMessage({ text: data.error || "Failed to submit feedback. Please try again.", type: "error" });
            }
        } catch (error: unknown) {
            console.error("Feedback submission error:", error);
            setMessage({ text: "Network error. Please check your connection and try again.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="feedback-hero">
                <h1>We Want to Hear From You!</h1>
                <p>Your feedback helps us improve FinanceU for everyone</p>
            </section>

            {/* Feedback Form */}
            <div className="feedback-content">
                <div className="feedback-form">
                    {message && <div className={`message ${message.type} show`}>{message.text}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Your Name (Optional)</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Your Email (Optional)</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <small>We'll only use this if we need to follow up on your feedback</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="feedbackType">Feedback Type *</label>
                            <select
                                id="feedbackType"
                                name="feedbackType"
                                required
                                value={formData.feedbackType}
                                onChange={handleChange}
                            >
                                <option value="">Select feedback type...</option>
                                <option value="Bug Report">Bug Report</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="General Feedback">General Feedback</option>
                                <option value="Compliment">Compliment</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Your Message *</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Tell us what's on your mind..."
                                required
                                minLength={10}
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                            <small>Minimum 10 characters</small>
                        </div>

                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
}
