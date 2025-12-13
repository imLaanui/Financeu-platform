import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@css/utilities/lessons.css";

interface Lesson {
    id: number;
    title: string;
    description: string;
    url: string;
}

const lessons: Lesson[] = [
    { id: 1, title: "Lesson 1 - What is Money?", description: "Understand the fundamental concept of money and its role in society", url: "/pillar1/lesson1" },
    { id: 2, title: "Lesson 2 - Understanding Income and Expenses", description: "Learn the difference between money coming in and money going out", url: "/pillar1/lesson2" },
    { id: 3, title: "Lesson 3 - The Time Value of Money", description: "Discover why money today is worth more than money tomorrow", url: "/pillar1/lesson3" },
    { id: 4, title: "Lesson 4 - Needs vs. Wants", description: "Master the crucial skill of distinguishing between necessities and desires", url: "/pillar1/lesson4" },
    { id: 5, title: "Lesson 5 - Setting Financial Goals", description: "Learn how to set and achieve meaningful financial objectives", url: "/pillar1/lesson5" },
    { id: 6, title: "Lesson 6 - Introduction to Banking", description: "Understand how banks work and the services they offer", url: "/pillar1/lesson6" },
    { id: 7, title: "Lesson 7 - Tracking Your Money", description: "Discover simple methods to monitor your financial activities", url: "/pillar1/lesson7" },
    { id: 8, title: "Lesson 8 - Building Good Money Habits", description: "Develop daily practices that lead to long-term financial success", url: "/pillar1/lesson8" },
];

// Helper to determine initial quiz state on load
const getInitialQuizState = (uid: string | null) => {
    if (!uid || uid === 'null' || uid === 'undefined') {
        return { showQuiz: false, quizCompleted: false, quizScore: null };
    }

    const completed = JSON.parse(localStorage.getItem(`pillar1_completed_${uid}`) || '[]');

    let allQuizzesPassed = true;
    for (let i = 1; i <= 8; i++) {
        if (localStorage.getItem(`lesson${i}_quiz_passed_${uid}`) !== 'true') {
            allQuizzesPassed = false;
            break;
        }
    }

    const showQuiz = completed.length === 8 && allQuizzesPassed;

    if (showQuiz) {
        const quizComp = localStorage.getItem(`pillar1_quiz_completed_${uid}`) === 'true';
        const score = localStorage.getItem(`pillar1_quiz_score_${uid}`);

        return {
            showQuiz: true,
            quizCompleted: quizComp,
            quizScore: score
        };
    }

    return { showQuiz: false, quizCompleted: false, quizScore: null };
};

export default function Pillar1Lessons() {
    const navigate = useNavigate();

    // Lazy initialization for userId
    const [userId] = useState<string | null>(() => {
        return localStorage.getItem("userId");
    });

    // Lazy initialization for completedLessons
    const [completedLessons] = useState<number[]>(() => {
        const uid = localStorage.getItem("userId");
        if (!uid || uid === 'null' || uid === 'undefined') {
            return [];
        }
        return JSON.parse(localStorage.getItem(`pillar1_completed_${uid}`) || '[]');
    });

    const [quizStatus] = useState(() => getInitialQuizState(userId));

    const showQuiz = quizStatus.showQuiz;
    const quizCompleted = quizStatus.quizCompleted;
    const quizScore = quizStatus.quizScore;

    const isLessonLocked = (lessonId: number): boolean => {
        if (!userId || userId === 'null' || userId === 'undefined') {
            return lessonId > 1;
        }

        if (lessonId === 1) {
            return false;
        }

        const previousQuizPassed = localStorage.getItem(`lesson${lessonId - 1}_quiz_passed_${userId}`) === 'true';
        return !previousQuizPassed;
    };

    return (
        <>
            <Navbar />
            <div>
                <section className="pillar-header">
                    <h1>Pillar 1: Financial Literacy Fundamentals</h1>
                    <p>Build your foundation with essential money management concepts and skills</p>
                </section>

                <div className="lessons-container">
                    <a onClick={() => navigate("/dashboard")} className="back-link" style={{ cursor: 'pointer' }}>
                        ← Back to Dashboard
                    </a>

                    <div id="lessonsList">
                        {lessons.map((lesson) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isLocked = isLessonLocked(lesson.id);

                            return (
                                <div
                                    key={lesson.id}
                                    className={`lesson-card ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                                    data-lesson={lesson.id}
                                >
                                    <div className="lesson-content">
                                        <div className="lesson-info">
                                            <h3>{lesson.title}</h3>
                                            <p>{lesson.description}</p>
                                        </div>
                                        <div className="lesson-status">
                                            {isLocked ? (
                                                <span className="locked-text">🔒 Complete Previous Lesson</span>
                                            ) : isCompleted ? (
                                                <>
                                                    <span className="completed-badge">✓ Completed</span>
                                                    <a onClick={() => navigate(lesson.url)} className="btn-start-lesson" style={{ cursor: 'pointer' }}>
                                                        Review
                                                    </a>
                                                </>
                                            ) : (
                                                <a onClick={() => navigate(lesson.url)} className="btn-start-lesson" style={{ cursor: 'pointer' }}>
                                                    Start Lesson
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Final Quiz */}
                        {showQuiz && (
                            <div className="quiz-card">
                                <div className="lesson-info">
                                    <h3>🎓 Final Quiz</h3>
                                    <p>Test your knowledge of all 8 lessons • 16 questions • 80% to pass</p>
                                </div>
                                <div className="lesson-status">
                                    {quizCompleted ? (
                                        <>
                                            <span className="quiz-completed-badge">✓ Passed ({quizScore}%)</span>
                                            <a onClick={() => navigate("/pillar1/quiz")} className="btn-start-quiz" style={{ cursor: 'pointer' }}>
                                                Retake Quiz
                                            </a>
                                        </>
                                    ) : (
                                        <a onClick={() => navigate("/pillar1/quiz")} className="btn-start-quiz" style={{ cursor: 'pointer' }}>
                                            Take Quiz
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
