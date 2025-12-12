import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@css/lessons.css";

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

export default function Pillar1Lessons() {
    const navigate = useNavigate();

    const [completedLessons] = useState<number[]>(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return [];
        return JSON.parse(localStorage.getItem(`pillar1_completed_${userId}`) || "[]");
    });

    return (
        <div>
            <section className="pillar-header">
                <h1>Pillar 1: Financial Literacy Fundamentals</h1>
                <p>Build your foundation with essential money management concepts and skills</p>
            </section>

            <div className="lessons-container">
                <a onClick={() => navigate("/dashboard")} className="back-link">← Back to Dashboard</a>

                {lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                        <div
                            key={lesson.id}
                            className={`lesson-card ${isCompleted ? "completed" : ""}`}
                            data-lesson={lesson.id}
                        >
                            <div className="lesson-info">
                                <h3>{lesson.title}</h3>
                                <p>{lesson.description}</p>
                            </div>
                            <div className="lesson-status">
                                {isCompleted ? (
                                    <>
                                        <span className="completed-badge">Completed</span>
                                        <a onClick={() => navigate(lesson.url)} className="btn-start-lesson">Review</a>
                                    </>
                                ) : (
                                    <a onClick={() => navigate(lesson.url)} className="btn-start-lesson">Start Lesson</a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
