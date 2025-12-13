import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "@css/utilities/lesson.css";

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
}

const quizData: { versions: QuizQuestion[] }[] = [
    {
        versions: [
            {
                question: "Why is a dollar today worth more than a dollar tomorrow?",
                options: [
                    "Because of inflation only",
                    "Because it has the potential to grow and earn returns",
                    "Because dollars lose value immediately",
                    "Because tomorrow never comes"
                ],
                correct: 1
            },
            {
                question: "What is the main concept of the time value of money?",
                options: [
                    "Money loses all value over time",
                    "Money available now is worth more than the same amount in the future",
                    "Future money is always worth more",
                    "Time and money are unrelated"
                ],
                correct: 1
            }
        ]
    },
    {
        versions: [
            {
                question: "According to the lesson, what would $100 saved at age 20 be worth at age 65 (assuming 7% growth)?",
                options: ["$500", "$761", "$1,000", "$1,497"],
                correct: 3
            },
            {
                question: "Starting to save 10 years earlier can have what effect on your money?",
                options: ["No significant difference", "Nearly doubles your money", "Triples your money", "Reduces your returns"],
                correct: 1
            }
        ]
    },
    {
        versions: [
            {
                question: "If someone offers you $1,000 today or $1,000 in one year, which should you choose?",
                options: [
                    "Wait for one year to get it",
                    "Take it today because it can grow and has more value now",
                    "It doesn't matter, they're the same",
                    "Wait because future money is safer"
                ],
                correct: 1
            },
            {
                question: "Why would lenders charge interest on money they lend?",
                options: [
                    "To be greedy",
                    "Because it's required by law",
                    "To compensate for giving up the opportunity to grow that money",
                    "To punish borrowers"
                ],
                correct: 2
            }
        ]
    },
    {
        versions: [
            {
                question: "What common mistake involves delaying saving for the future?",
                options: [
                    "Starting too early",
                    "Thinking 'I'll start saving later'",
                    "Saving too much now",
                    "Ignoring current needs"
                ],
                correct: 1
            },
            {
                question: "According to the lesson, what is a consequence of money sitting under your mattress?",
                options: [
                    "It grows slowly",
                    "It stays the same forever",
                    "It loses value every year due to inflation",
                    "It becomes more valuable"
                ],
                correct: 2
            }
        ]
    }
];

const Lesson3 = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [quizPassed, setQuizPassed] = useState(false);
    const totalScreens = 8;

    // Navigation
    const nextScreen = () => currentScreen < totalScreens && setCurrentScreen(currentScreen + 1);
    const previousScreen = () => currentScreen > 1 && setCurrentScreen(currentScreen - 1);

    // Quiz Initialization
    useEffect(() => {
        const initializeQuiz = () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const quizPassedStatus = localStorage.getItem(`lesson3_quiz_passed_${userId}`);
            if (quizPassedStatus === "true") {
                setQuizPassed(true);
                return;
            }

            const questions = quizData.map(q => {
                const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
                return randomVersion;
            });

            // Use functional updates to ensure safe state update
            setCurrentQuestions(() => questions);
            setUserAnswers(() => new Array(questions.length).fill(-1));
        };

        initializeQuiz();
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
        const percentage = Math.round((correctCount / currentQuestions.length) * 100);
        const passed = percentage >= 80;

        setQuizPassed(passed);

        if (passed) {
            const userId = localStorage.getItem("userId");
            if (userId) localStorage.setItem(`lesson3_quiz_passed_${userId}`, "true");
        }
    };

    // Retry Quiz integrated
    const retryQuizHandler = () => {
        const questions = quizData.map(q => q.versions[Math.floor(Math.random() * q.versions.length)]);
        setCurrentQuestions(questions);
        setUserAnswers(new Array(questions.length).fill(-1));
        setQuizPassed(false);
    };

    const finishLesson = async () => {
        if (!quizPassed) return alert("Please complete the quiz first!");
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        await fetch(`${API_URL}/lessons/complete`, {
            method: "POST",
            body: JSON.stringify({ lessonId: "pillar1_lesson3", userId }),
            headers: { "Content-Type": "application/json" },
        });
        window.location.href = "/pillar1-lessons";
    };

    return (
        <div className="lesson-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-wrapper">
                        <div className="logo"><a href="/">Finance<span className="logo-accent">U</span></a></div>
                        <ul className="nav-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/dashboard">Dashboard</a></li>
                            <li>
                                {localStorage.getItem("authState") === "true" ? (
                                    <button
                                        className="btn-primary"
                                        onClick={() => { localStorage.clear(); window.location.reload(); }}
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <a href="/login" className="btn-primary">Login</a>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Lesson Screens */}
            {currentScreen === 1 && (
                <div className="lesson-screen active">
                    <div className="screen-progress">Screen 1 of 8</div>
                    <div className="lesson-section">
                        <h2>Quick Intro</h2>
                        <p>Most people think $100 today equals $100 in a year—it doesn't.</p>
                    </div>
                    <button className="btn-nav" onClick={nextScreen}>Next →</button>
                </div>
            )}

            {/* Screens 2–7 would be similar */}

            {/* Screen 8: Quiz */}
            {currentScreen === 8 && (
                <div className="lesson-screen active">
                    <div className="screen-progress">Screen 8 of 8</div>

                    {!quizPassed ? (
                        <>
                            {currentQuestions.map((q, i) => (
                                <div key={i} className="question-card">
                                    <div className="question-text">{q.question}</div>
                                    {q.options.map((opt, oIndex) => (
                                        <div
                                            key={oIndex}
                                            className={`answer-option ${userAnswers[i] === oIndex ? "selected" : ""}`}
                                            onClick={() => selectAnswer(i, oIndex)}
                                        >
                                            <input type="radio" name={`question${i}`} value={oIndex} checked={userAnswers[i] === oIndex} readOnly />
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <button className="btn-submit-quiz" onClick={submitQuiz}>Submit Quiz</button>
                        </>
                    ) : (
                        <div className="quiz-result pass">
                            <div className="result-icon">🎉</div>
                            <div className="result-text">Quiz Passed!</div>
                            <button className="btn-finish" onClick={finishLesson}>Finish Lesson</button>
                            <button className="btn-retry" onClick={retryQuizHandler}>Retry Quiz</button>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="screen-navigation">
                {currentScreen > 1 && <button className="btn-nav btn-prev" onClick={previousScreen}>← Previous</button>}
                {currentScreen < totalScreens && <button className="btn-nav" onClick={nextScreen}>Next →</button>}
            </div>
        </div>
    );
};

export default Lesson3;
