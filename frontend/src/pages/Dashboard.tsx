import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import Footer from "@components/Footer";
import "@css/dashboard.css";

type User = {
    id: number;
    name: string;
    membershipTier: "free" | "pro" | "premium";
    createdAt: string;
};

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [memberDays, setMemberDays] = useState(0);
    const [progressPercent, setProgressPercent] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // ---- Check authentication ----
    const checkAuth = async (): Promise<User | null> => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
            if (!res.ok) return null;
            const data = await res.json();
            return data.user as User;
        } catch {
            return null;
        }
    };

    // ---- Load dashboard ----
    useEffect(() => {
        const load = async () => {
            const authUser = await checkAuth();
            if (!authUser) {
                window.location.href = "/login";
                return;
            }

            setUser(authUser);

            // Member days
            const created = new Date(authUser.createdAt);
            const today = new Date();
            const diff = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            setMemberDays(Math.max(0, diff));

            try {
                const userId = authUser.id;

                // Local progress tracking
                const pillar1Completed = JSON.parse(
                    localStorage.getItem(`pillar1_completed_${userId}`) || "[]"
                ) as number[];

                const quizCompleted =
                    localStorage.getItem(`pillar1_quiz_completed_${userId}`) === "true";

                const totalItems = 9; // lessons + quiz

                setCompletedLessons(pillar1Completed.length);

                // Progress percent
                if (quizCompleted) {
                    setProgressPercent(100);
                } else {
                    const percent = Math.round((pillar1Completed.length / totalItems) * 100);
                    setProgressPercent(percent);
                }

                setLoading(false);
            } catch (err) {
                setErrorMsg(`Failed to load dashboard. ${err}`);
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (errorMsg) return <div className="error">{errorMsg}</div>;
    if (!user) return null;

    const membershipLabel =
        user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1);

    return (
        <section className="dashboard">
            <div className="container">
                <h2>Welcome back, {user.name}</h2>

                <div className="membership-header">
                    <span className={`membership-badge ${user.membershipTier}`}>
                        {membershipLabel} Member
                    </span>
                    <span className="member-days">{memberDays} days</span>
                </div>

                {user.membershipTier === "free" && (
                    <div className="upgrade-banner">
                        Upgrade your plan to unlock more pillars.
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>{completedLessons}</h3>
                        <p>Lessons Completed</p>
                    </div>
                    <div className="stat-card">
                        <h3>{progressPercent}%</h3>
                        <p>Overall Progress</p>
                    </div>
                </div>

                {/* Pillars */}
                <div className="lessons-section">
                    <div className="section-header">
                        <h2>Your Pillars</h2>
                    </div>

                    <div className="lesson-list">
                        {/* PILLAR 1 */}
                        <div className="lesson-item">
                            <div className="lesson-info">
                                <div className="lesson-details">
                                    <h3>
                                        Pillar 1{" "}
                                        <span className="badge-free">FREE</span>
                                        <span className="badge-free">• Available Now</span>
                                    </h3>
                                    <p>Foundation of financial literacy and money management.</p>
                                </div>
                            </div>

                            <div className="lesson-status">
                                <a href="/pillar1-lessons" className="btn-lesson">
                                    {progressPercent === 100
                                        ? "Review Pillar"
                                        : completedLessons > 0
                                            ? "Continue Pillar"
                                            : "Start Pillar"}
                                </a>
                            </div>
                        </div>

                        {/* PILLAR 2–11 STATIC LIST */}
                        {Array.from({ length: 10 }).map((_, idx) => {
                            const pillarNumber = idx + 2;
                            const isPro = pillarNumber >= 4 && pillarNumber <= 8;
                            const isPremium = pillarNumber >= 9;

                            const tier = isPremium ? "PREMIUM" : isPro ? "PRO" : "FREE";
                            const color =
                                isPremium ? "#3b82f6" : isPro ? "#f59e0b" : "#10b981";

                            return (
                                <div key={pillarNumber} className="lesson-item locked">
                                    <div className="lesson-info">
                                        <div className="lesson-details">
                                            <h3>
                                                Pillar {pillarNumber}
                                                <span
                                                    style={{
                                                        color,
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                        textTransform: "uppercase",
                                                        marginLeft: "10px",
                                                    }}
                                                >
                                                    {tier}
                                                </span>
                                            </h3>
                                            <p>Coming 2026.</p>
                                        </div>
                                    </div>
                                    <div className="lesson-status">
                                        <span className="status-badge locked">Coming 2026</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </section>
    );
}
