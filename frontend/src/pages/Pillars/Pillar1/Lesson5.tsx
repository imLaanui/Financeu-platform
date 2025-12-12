import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@css/lesson.css";
import { completeLesson } from "@utils/lessonCompletion";

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
}

const quizData: { versions: QuizQuestion[] }[] = [
    {
        versions: [
            { question: "What does the 'S' in SMART goals stand for?", options: ["Simple", "Specific", "Strategic", "Sudden"], correct: 1 },
            { question: "According to the SMART framework, goals should be:", options: ["Vague and flexible", "Specific, Measurable, Achievable, Relevant, and Time-bound", "Simple and easy", "Complicated and impressive"], correct: 1 },
        ],
    },
    {
        versions: [
            { question: "Which is an example of a short-term financial goal?", options: ["Retirement savings", "Buying a house", "Emergency fund (0-1 year)", "Children's college fund"], correct: 2 },
            { question: "What timeframe defines a long-term financial goal?", options: ["0-1 year", "1-3 years", "3-5 years", "5+ years"], correct: 3 },
        ],
    },
    {
        versions: [
            { question: "Which is a better financial goal?", options: ["Save more money", "Save $500 by December 31st by setting aside $42 per month", "Get rich", "Try to save something"], correct: 1 },
            { question: "What makes a goal 'measurable'?", options: ["It's written down", "It has specific numbers and can be tracked", "It's difficult", "Everyone has the same goal"], correct: 1 },
        ],
    },
    {
        versions: [
            { question: "What common mistake involves setting financial goals?", options: ["Setting too many goals at once", "Writing goals down", "Making goals too easy", "Reviewing progress monthly"], correct: 0 },
            { question: "According to the lesson, how many priority goals should you focus on?", options: ["As many as possible", "1-3 priorities", "10 or more", "None, just wing it"], correct: 1 },
        ],
    },
];

const totalScreens = 8;

const Lesson5: React.FC = () => {
    const navigate = useNavigate();
    const [currentScreen, setCurrentScreen] = useState(1);

    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizPassed, setQuizPassed] = useState(false);

    // Initialize quiz
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const passed = localStorage.getItem(`lesson5_quiz_passed_${userId}`) === "true";
        if (passed) {
            setTimeout(() => setQuizPassed(true), 0);
            return;
        }

        const questions = quizData.map(q => {
            const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
            return randomVersion;
        });

        // Defer state updates to avoid synchronous setState in effect
        setTimeout(() => {
            setCurrentQuestions(questions);
            setUserAnswers(new Array(questions.length).fill(-1));
        }, 0);
    }, []);

    const selectAnswer = (qIndex: number, oIndex: number) => {
        setUserAnswers(prev => prev.map((v, i) => (i === qIndex ? oIndex : v)));
    };

    const submitQuiz = () => {
        if (userAnswers.includes(-1)) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const correctCount = currentQuestions.reduce(
            (acc, q, i) => (userAnswers[i] === q.correct ? acc + 1 : acc),
            0
        );
        const passed = correctCount / currentQuestions.length >= 0.8;

        setQuizPassed(passed);

        if (passed) {
            const userId = localStorage.getItem("userId");
            if (userId) localStorage.setItem(`lesson5_quiz_passed_${userId}`, "true");
        } else {
            alert("You need 80% to pass. Try again!");
        }
    };

    const finishLesson = async () => {
        if (!quizPassed) return alert("Please complete the quiz first!");
        const success = await completeLesson("pillar1_lesson5", 1, 5);
        if (success) navigate("/pillar1-lessons");
    };

    const nextScreen = () => currentScreen < totalScreens && setCurrentScreen(currentScreen + 1);
    const prevScreen = () => currentScreen > 1 && setCurrentScreen(currentScreen - 1);

    return (
        <div className="lesson-container">
            <nav className="navbar">
                <div className="container">
                    <div className="nav-wrapper">
                        <div className="logo">
                            <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
                                Finance<span className="logo-accent">U</span>
                            </a>
                        </div>
                        <ul className="nav-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/dashboard">Dashboard</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="lesson-header">
                <div className="lesson-number">LESSON 5</div>
                <h1>Setting Financial Goals</h1>
            </div>

            {/* Screens */}
            {[...Array(totalScreens)].map((_, i) => (
                <div key={i} className={`lesson-screen ${currentScreen === i + 1 ? "active" : ""}`}>
                    {i === 7 && (
                        <div className="quiz-container">
                            {currentQuestions.map((q, idx) => (
                                <div key={idx} className="question-card">
                                    <div className="question-text">{q.question}</div>
                                    {q.options.map((opt, oIdx) => (
                                        <div
                                            key={oIdx}
                                            className={`answer-option ${userAnswers[idx] === oIdx ? "selected" : ""}`}
                                            onClick={() => selectAnswer(idx, oIdx)}
                                        >
                                            <input type="radio" name={`question${idx}`} value={oIdx} checked={userAnswers[idx] === oIdx} readOnly />
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {!quizPassed ? (
                                <button className="btn-submit-quiz" onClick={submitQuiz}>Submit Quiz</button>
                            ) : (
                                <div className="quiz-result pass">
                                    <div className="result-icon">🎉</div>
                                    <div className="result-text">Quiz Passed!</div>
                                    <button className="btn-finish" onClick={finishLesson}>Finish Lesson</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            <div className="screen-navigation">
                {currentScreen > 1 && <button className="btn-nav btn-prev" onClick={prevScreen}>← Previous</button>}
                {currentScreen < totalScreens && <button className="btn-nav" onClick={nextScreen}>Next →</button>}
            </div>
        </div>
    );
};

export default Lesson5;
