import { useEffect, useState } from 'react';
import { API_URL } from '@config/api';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import '@css/dashboard.css';

interface User {
    id: string;
    name: string;
    email: string;
    membershipTier: 'free' | 'pro' | 'premium';
    createdAt: string;
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    icon: string;
    url: string;
    accessible: boolean;
}

interface LessonProgress {
    lesson_id: string;
    completed: boolean;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        completedLessons: 0,
        progressPercent: 0,
        memberDays: 0,
    });
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
    const [pillar1ButtonText, setPillar1ButtonText] = useState('Start Pillar');
    const [pillar2ButtonText, setPillar2ButtonText] = useState('Start Pillar');

    useEffect(() => {
        loadDashboard();
    }, []);

    const checkAuth = async (): Promise<User | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include',
            });

            if (!response.ok) {
                window.location.href = '/login.html';
                return null;
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login.html';
            return null;
        }
    };

    const loadDashboard = async () => {
        const authenticatedUser = await checkAuth();
        if (!authenticatedUser) return;

        setUser(authenticatedUser);

        try {
            // Show upgrade banner for free users
            if (authenticatedUser.membershipTier === 'free') {
                setShowUpgradeBanner(true);
            }

            // Calculate member days
            const createdDate = new Date(authenticatedUser.createdAt);
            const today = new Date();
            const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            const days = Math.max(0, daysDiff);

            // Load progress from localStorage
            const userId = authenticatedUser.id;
            const pillar1Completed = JSON.parse(
                localStorage.getItem(`pillar1_completed_${userId}`) || '[]'
            );
            const pillar1QuizCompleted =
                localStorage.getItem(`pillar1_quiz_completed_${userId}`) === 'true';
            const pillar2Completed = JSON.parse(
                localStorage.getItem(`pillar2_completed_${userId}`) || '[]'
            );
            const pillar2QuizCompleted =
                localStorage.getItem(`pillar2_quiz_completed_${userId}`) === 'true';

            const totalLessonsPerPillar = 8;
            const totalItemsPerPillar = 9; // 8 lessons + 1 quiz

            // Total completed lessons across ALL pillars
            const totalCompletedLessons = pillar1Completed.length + pillar2Completed.length;

            // Calculate "Overall Progress" percentage
            const totalAvailableItems = totalItemsPerPillar * 2; // 2 pillars × 9 items each
            const pillar1QuizBonus = pillar1QuizCompleted ? 1 : 0;
            const pillar2QuizBonus = pillar2QuizCompleted ? 1 : 0;
            const totalCompletedItems =
                totalCompletedLessons + pillar1QuizBonus + pillar2QuizBonus;

            const progressPercent = Math.round(
                (totalCompletedItems / totalAvailableItems) * 100
            );

            setStats({
                completedLessons: totalCompletedLessons,
                progressPercent,
                memberDays: days,
            });

            // Update Pillar 1 button text
            if (pillar1QuizCompleted) {
                setPillar1ButtonText('Review Pillar');
            } else if (
                pillar1Completed.length > 0 &&
                pillar1Completed.length < totalLessonsPerPillar
            ) {
                setPillar1ButtonText('Continue Pillar');
            } else if (pillar1Completed.length === totalLessonsPerPillar) {
                setPillar1ButtonText('Continue Pillar');
            } else {
                setPillar1ButtonText('Start Pillar');
            }

            // Update Pillar 2 button text
            if (pillar2QuizCompleted) {
                setPillar2ButtonText('Review Pillar');
            } else if (
                pillar2Completed.length > 0 &&
                pillar2Completed.length < totalLessonsPerPillar
            ) {
                setPillar2ButtonText('Continue Pillar');
            } else if (pillar2Completed.length === totalLessonsPerPillar) {
                setPillar2ButtonText('Continue Pillar');
            } else {
                setPillar2ButtonText('Start Pillar');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            setError('Error loading dashboard. Please try again.');
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('authState');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/index.html';
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <nav className="navbar">
                    <div className="container">
                        <div className="nav-wrapper">
                            <div className="logo">
                                Finance<span className="logo-accent">U</span>
                            </div>
                            <ul className="nav-links">
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li>
                                    <a href="/dashboard">Dashboard</a>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="btn-primary">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="loading">
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <nav className="navbar">
                    <div className="container">
                        <div className="nav-wrapper">
                            <div className="logo">
                                Finance<span className="logo-accent">U</span>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            {/* Navigation */}
            <Navbar />

            {/* Dashboard Header */}
            <section className="dashboard-header">
                <div className="container">
                    <div className="welcome-section">
                        <div className="welcome-text">
                            <h1>
                                Welcome back, <span>{user?.name || 'Student'}</span>!
                            </h1>
                            <p>Continue your journey to financial mastery</p>
                        </div>
                        <div className={`membership-badge ${user?.membershipTier}`}>
                            {user?.membershipTier
                                ? `${user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Member`
                                : 'Free Member'}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Content */}
            <section className="dashboard-container">
                <div className="container">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="24" cy="24" r="22" fill="#D1FAE5" />
                                    <path
                                        d="M 14 24 L 21 31 L 34 17"
                                        stroke="#00A676"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="stat-number">{stats.completedLessons}</div>
                            <div className="stat-label">Lessons Completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="24" cy="24" r="22" fill="#DBEAFE" />
                                    <circle
                                        cx="24"
                                        cy="24"
                                        r="18"
                                        stroke="#3B82F6"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeDasharray="70 113"
                                    />
                                    <circle cx="24" cy="24" r="12" fill="#3B82F6" opacity="0.2" />
                                </svg>
                            </div>
                            <div className="stat-number">{stats.progressPercent}%</div>
                            <div className="stat-label">Overall Progress</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="24" cy="24" r="22" fill="#FEF3C7" />
                                    <rect
                                        x="14"
                                        y="10"
                                        width="20"
                                        height="26"
                                        rx="2"
                                        stroke="#F59E0B"
                                        strokeWidth="2.5"
                                        fill="none"
                                    />
                                    <line
                                        x1="14"
                                        y1="16"
                                        x2="34"
                                        y2="16"
                                        stroke="#F59E0B"
                                        strokeWidth="2.5"
                                    />
                                    <circle cx="19" cy="13" r="1.5" fill="#F59E0B" />
                                    <circle cx="24" cy="13" r="1.5" fill="#F59E0B" />
                                    <circle cx="29" cy="13" r="1.5" fill="#F59E0B" />
                                </svg>
                            </div>
                            <div className="stat-number">{stats.memberDays}</div>
                            <div className="stat-label">Days as Member</div>
                        </div>
                    </div>

                    {/* Upgrade Banner (shown for free users) */}
                    {showUpgradeBanner && (
                        <div className="upgrade-banner">
                            <div className="upgrade-header">
                                <h3>Unlock Your Full Potential</h3>
                            </div>
                            <div className="upgrade-tiers">
                                <div className="tier-option">
                                    <span className="tier-badge-banner pro">Pro</span>
                                    <h4>Saving & Investing</h4>
                                    <p className="tier-features">
                                        Pillars 4-8 • Saving strategies, investment basics, budgeting
                                        mastery
                                    </p>
                                    <a href="/#pricing" className="btn-upgrade pro">
                                        Get Pro
                                    </a>
                                </div>
                                <div className="tier-option">
                                    <span className="tier-badge-banner premium">Premium</span>
                                    <h4>Advanced Finance</h4>
                                    <p className="tier-features">
                                        Pillars 9-11 • Insurance, real estate, retirement planning
                                    </p>
                                    <a href="/#pricing" className="btn-upgrade premium">
                                        Get Premium
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pillars Section */}
                    <div className="lessons-section">
                        <div className="section-header">
                            <h2>Your Pillars</h2>
                        </div>
                        <div className="lesson-list">
                            {/* Pillar 1-3: Available */}
                            <div className="lesson-item">
                                <div className="lesson-info">
                                    <div className="lesson-details">
                                        <h3>
                                            Pillar 1{' '}
                                            <span className="badge-free">FREE</span>
                                            <span className="badge-available">• Available Now</span>
                                        </h3>
                                        <p>
                                            Foundation of financial literacy and money management
                                            fundamentals.
                                        </p>
                                    </div>
                                </div>
                                <div className="lesson-status">
                                    <a href="/pillar1-lessons" className="btn-lesson">
                                        {pillar1ButtonText}
                                    </a>
                                </div>
                            </div>

                            <div className="lesson-item">
                                <div className="lesson-info">
                                    <div className="lesson-details">
                                        <h3>
                                            Pillar 2{' '}
                                            <span className="badge-free">FREE</span>
                                            <span className="badge-available">• Available Now</span>
                                        </h3>
                                        <p>Master budgeting and saving to build your financial security.</p>
                                    </div>
                                </div>
                                <div className="lesson-status">
                                    <a href="/pillar2-lessons" className="btn-lesson">
                                        {pillar2ButtonText}
                                    </a>
                                </div>
                            </div>

                            <div
                                className="lesson-item"
                                onClick={() => (window.location.href = '/pillar3-lessons')}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="lesson-info">
                                    <div className="lesson-details">
                                        <h3>
                                            Pillar 3: Credit & Debt Mastery{' '}
                                            <span className="badge-free">FREE</span>
                                        </h3>
                                        <p>Master credit scores, credit cards, and debt management.</p>
                                    </div>
                                </div>
                                <div className="lesson-status">
                                    <span className="status-badge available">Available Now</span>
                                </div>
                            </div>

                            {/* Pillar 4-11: Coming 2026 (Greyed Out) */}
                            {[
                                { num: 4, tier: 'PRO', desc: 'Smart saving strategies and emergency fund planning.' },
                                { num: 5, tier: 'PRO', desc: 'Investment principles and wealth building techniques.' },
                                { num: 6, tier: 'PRO', desc: 'Budgeting mastery and expense management.' },
                                { num: 7, tier: 'PRO', desc: 'Career development and income optimization.' },
                                { num: 8, tier: 'PRO', desc: 'Tax fundamentals and financial planning.' },
                                { num: 9, tier: 'PREMIUM', desc: 'Insurance and risk management essentials.' },
                                { num: 10, tier: 'PREMIUM', desc: 'Real estate and major purchase planning.' },
                                { num: 11, tier: 'PREMIUM', desc: 'Retirement planning and long-term financial security.' },
                            ].map((pillar) => (
                                <div key={pillar.num} className="lesson-item locked">
                                    <div className="lesson-info">
                                        <div className="lesson-details">
                                            <h3>
                                                Pillar {pillar.num}{' '}
                                                <span className={`badge-tier ${pillar.tier.toLowerCase()}`}>
                                                    {pillar.tier}
                                                </span>
                                            </h3>
                                            <p>{pillar.desc}</p>
                                        </div>
                                    </div>
                                    <div className="lesson-status">
                                        <span className="status-badge locked">Coming 2026</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
