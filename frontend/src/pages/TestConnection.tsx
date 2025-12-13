import { useState } from "react";
import { API_URL } from "@config/api";
import "@css/auth/login.css";

interface TestResult {
    status: "info" | "success" | "error";
    message: string;
}

export default function TestConnection() {
    const [feedbackResult, setFeedbackResult] = useState<TestResult | null>(null);
    const [adminResult, setAdminResult] = useState<TestResult | null>(null);

    const currentUrl = window.location.href;
    const protocol = window.location.protocol;

    const urlTest = protocol === "file:"
        ? { status: "error", message: "❌ WRONG! Using file:// protocol" }
        : { status: "success", message: "✅ CORRECT! Using HTTP protocol" };

    const testFeedbackAPI = async () => {
        setFeedbackResult({ status: "info", message: "⏳ Testing feedback submission..." });

        try {
            const response = await fetch(`${API_URL}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Test User",
                    email: "test@example.com",
                    feedbackType: "General Feedback",
                    message: "This is a test message from the connection test page",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFeedbackResult({ status: "success", message: `✅ SUCCESS! Feedback submitted with ID: ${data.feedbackId}` });
            } else {
                setFeedbackResult({ status: "error", message: `❌ FAILED! Error: ${data.error}` });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setFeedbackResult({
                    status: "error",
                    message: `❌ FAILED! Network error: ${error.message}\nThis usually means:\n- Server not running\n- Wrong URL (using file:// instead of http://)`,
                });
            } else {
                setFeedbackResult({
                    status: "error",
                    message: "❌ FAILED! Unknown network error occurred",
                });
            }
        }
    };

    const testAdminAPI = async () => {
        setAdminResult({ status: "info", message: "⏳ Testing admin authentication..." });

        try {
            const credentials = btoa("admin:financeu2025");
            const response = await fetch(`${API_URL}/admin/feedback`, {
                headers: { Authorization: `Basic ${credentials}` },
            });

            const data = await response.json();

            if (response.ok) {
                setAdminResult({ status: "success", message: `✅ SUCCESS! Retrieved ${data.total} feedback items` });
            } else {
                setAdminResult({ status: "error", message: `❌ FAILED! Error: ${data.error}` });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setAdminResult({
                    status: "error",
                    message: `❌ FAILED! Network error: ${error.message}\nThis usually means:\n- Server not running\n- Wrong URL (using file:// instead of http://)`,
                });
            } else {
                setAdminResult({
                    status: "error",
                    message: "❌ FAILED! Unknown network error occurred",
                });
            }
        }
    };

    const getResultClass = (status: string) => {
        switch (status) {
            case "success": return "test-result success";
            case "error": return "test-result error";
            default: return "test-result info";
        }
    };

    return (
        <section className="auth-container">
            <div className="container">
                <div className="auth-card" style={{ maxWidth: 800 }}>
                    <h1>🔧 FinanceU Connection Test</h1>

                    <div className={getResultClass(urlTest.status)}>
                        <strong>Current URL:</strong> {currentUrl}<br />
                        <strong>Protocol:</strong> {protocol}<br />
                        <strong>Status:</strong> {urlTest.message}
                    </div>

                    <div className="test-result info">
                        <strong>API URL:</strong> {API_URL}<br />
                        <strong>Status:</strong> Waiting for test...
                    </div>

                    <button onClick={testFeedbackAPI}>Test Feedback Submission</button>
                    <button onClick={testAdminAPI}>Test Admin Login</button>

                    {feedbackResult && (
                        <div className={getResultClass(feedbackResult.status)}>
                            {feedbackResult.message.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    )}

                    {adminResult && (
                        <div className={getResultClass(adminResult.status)}>
                            {adminResult.message.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    )}

                    <hr />
                    <h3>Instructions:</h3>
                    <ol>
                        <li>If URL shows <code>file://</code> - you're accessing it wrong! ❌</li>
                        <li>Open: <strong>http://localhost:3000/test-connection</strong></li>
                        <li>Click the test buttons above</li>
                        <li>All tests should pass ✅</li>
                    </ol>
                </div>
            </div>
        </section>
    );
}
