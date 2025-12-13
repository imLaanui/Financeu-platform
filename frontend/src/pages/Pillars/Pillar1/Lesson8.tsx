import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "@css/utilities/lesson.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export default function Lesson8() {
  const [authState, setAuthState] = useState<{ isLoggedIn: boolean }>({ isLoggedIn: false });
  const [currentScreen, setCurrentScreen] = useState(1);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [checkpoint1Answered, setCheckpoint1Answered] = useState(false);
  const [checkpoint2Answered, setCheckpoint2Answered] = useState(false);

  // Check login state
  useEffect(() => {
    const cached = localStorage.getItem("authState");
    if (cached) setAuthState(JSON.parse(cached));

    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const isLoggedIn = res.ok;
        setAuthState({ isLoggedIn });
        localStorage.setItem("authState", JSON.stringify({ isLoggedIn }));
      } catch {
        setAuthState({ isLoggedIn: false });
      }
    })();
  }, []);

  const logout = async () => {
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    try {
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/";
    }
  };

  // Initialize quiz
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const lessonPassed = localStorage.getItem(`lesson8_quiz_passed_${userId}`) === "true";
    if (lessonPassed) {
      setQuizPassed(true);
      return;
    }

    // Quiz data with random versions
    const quizData: { versions: QuizQuestion[] }[] = [
      {
        versions: [
          {
            question: "Why do habits matter more than motivation for financial success?",
            options: [
              "Motivation never works",
              "Habits are easier to break",
              "Motivation fades, but habits stick and require less willpower",
              "Habits cost money",
            ],
            correct: 2,
          },
          {
            question: "According to the lesson, what is the main difference between habits and motivation?",
            options: [
              "Habits are automatic, motivation is temporary",
              "Motivation is better than habits",
              "They are the same thing",
              "Habits require more energy",
            ],
            correct: 0,
          },
        ],
      },
      {
        versions: [
          {
            question: "What is the '24-hour rule' mentioned in the lesson?",
            options: [
              "Work 24 hours straight",
              "Wait one full day before any unplanned purchase over $50",
              "Check your bank every 24 hours",
              "Save for 24 days before buying",
            ],
            correct: 1,
          },
          {
            question: "What does 'pay yourself first' mean?",
            options: [
              "Give yourself a bonus",
              "Spend on wants before needs",
              "Automatically move money to savings before spending",
              "Pay yourself a salary",
            ],
            correct: 2,
          },
        ],
      },
      {
        versions: [
          {
            question: "In the example, what was the difference between Morgan and Sam after 5 years?",
            options: [
              "They had the same results",
              "Morgan had $12,000 saved, Sam had debt",
              "Sam had $12,000+ saved, Morgan had $3,000 in debt",
              "Both were in debt",
            ],
            correct: 2,
          },
          {
            question: "Morgan and Sam earn the same $40,000/year. What made the difference in their outcomes?",
            options: [
              "Morgan got a better job",
              "Daily money habits - Sam's good habits vs Morgan's poor habits",
              "Sam won the lottery",
              "Morgan spent less",
            ],
            correct: 1,
          },
        ],
      },
      {
        versions: [
          {
            question: "What common mistake do people make when building habits?",
            options: [
              "Starting too slowly",
              "Trying to change everything at once",
              "Tracking progress",
              "Using automation",
            ],
            correct: 1,
          },
          {
            question: "What should you do if you slip up on a financial habit?",
            options: [
              "Give up completely",
              "Wait until next year",
              "Beat yourself up about it",
              "Just restart the habit the next day - progress over perfection",
            ],
            correct: 3,
          },
        ],
      },
    ];

    // Pick random version for each question
    const questions = quizData.map((q) => {
      const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
      return randomVersion;
    });

    setQuizQuestions(questions);
    setUserAnswers(new Array(questions.length).fill(null));
  }, []);

  const selectAnswer = (qIndex: number, optionIndex: number) => {
    const updated = [...userAnswers];
    updated[qIndex] = optionIndex;
    setUserAnswers(updated);
  };

  const submitQuiz = () => {
    if (userAnswers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const correct = quizQuestions.filter((q, i) => userAnswers[i] === q.correct).length;
    const passed = correct / quizQuestions.length >= 0.8;

    setQuizPassed(passed);

    if (passed) {
      const userId = localStorage.getItem("userId");
      localStorage.setItem(`lesson8_quiz_passed_${userId}`, "true");
    } else {
      alert("You need at least 80% to pass. Try again!");
      setUserAnswers(new Array(quizQuestions.length).fill(null));
    }
  };

  const finishLesson = async () => {
    if (!quizPassed) {
      alert("Complete the quiz first!");
      return;
    }

    await fetch(`${API_URL}/lessons/complete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lesson: "pillar1_lesson8" }),
    });
    window.location.href = "/pillar1-lessons";
  };

  const checkCheckpoint = (checkpoint: 1 | 2, selected: number) => {
    if ((checkpoint === 1 && checkpoint1Answered) || (checkpoint === 2 && checkpoint2Answered)) return;

    const correctOption = 1;
    const isCorrect = selected === correctOption;

    if (checkpoint === 1) setCheckpoint1Answered(true);
    if (checkpoint === 2) setCheckpoint2Answered(true);

    alert(isCorrect ? "Correct!" : "Not quite, but check the lesson!");
  };

  const nextScreen = () => setCurrentScreen((s) => Math.min(s + 1, 8));
  const prevScreen = () => setCurrentScreen((s) => Math.max(s - 1, 1));

  return (
    <div className="lesson-container">
      {/* Navigation */}
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
              <li>
                {authState.isLoggedIn ? (
                  <button onClick={logout} className="btn-primary">Logout</button>
                ) : (
                  <a href="/login" className="btn-primary">Login</a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Screen 1 */}
      <div className={`lesson-screen ${currentScreen === 1 ? "active" : ""}`}>
        <div className="lesson-header">
          <div className="lesson-number">LESSON 8</div>
          <h1>Building Good Money Habits</h1>
        </div>
        <p>Quick intro and what you'll learn...</p>
        <div className="screen-navigation">
          <button className="btn-nav" onClick={nextScreen}>Next →</button>
        </div>
      </div>

      {/* Screen 2 */}
      {currentScreen === 2 && (
        <div className="lesson-screen active">
          <h2>Core Concept</h2>
          <p>Money habits are automatic behaviors that shape your financial life...</p>
          <div className="screen-navigation">
            <button className="btn-nav btn-prev" onClick={prevScreen}>← Previous</button>
            <button className="btn-nav" onClick={nextScreen}>Next →</button>
          </div>
        </div>
      )}

      {/* Screen 3: Checkpoint 1 */}
      {currentScreen === 3 && (
        <div className="lesson-screen active">
          <h3>Checkpoint 1</h3>
          <p>What's the 'Pay Yourself First' principle?</p>
          <div className="checkpoint-options">
            <button onClick={() => checkCheckpoint(1, 0)}>A</button>
            <button onClick={() => checkCheckpoint(1, 1)}>B</button>
            <button onClick={() => checkCheckpoint(1, 2)}>C</button>
            <button onClick={() => checkCheckpoint(1, 3)}>D</button>
          </div>
          <div className="screen-navigation">
            <button className="btn-nav btn-prev" onClick={prevScreen}>← Previous</button>
            <button className="btn-nav" onClick={nextScreen}>Continue →</button>
          </div>
        </div>
      )}

      {/* Screens 4-7 would go here - add similar structure */}

      {/* Screen 8: Quiz */}
      {currentScreen === 8 && (
        <div className="lesson-screen active">
          <div className="quiz-container">
            <h2>Lesson Quiz</h2>
            {quizQuestions.map((q, i) => (
              <div key={i} className="question-card">
                <div className="question-text">Question {i + 1}: {q.question}</div>
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`answer-option ${userAnswers[i] === idx ? "selected" : ""}`}
                    onClick={() => selectAnswer(i, idx)}
                  >
                    <input type="radio" checked={userAnswers[i] === idx} readOnly />
                    {opt}
                  </div>
                ))}
              </div>
            ))}
            <button onClick={submitQuiz} className="btn-submit-quiz">Submit Quiz</button>

            {quizPassed && (
              <div className="quiz-success">
                <h3>🎉 Congratulations!</h3>
                <p>You've completed all 8 lessons of Pillar 1!</p>
                <button onClick={finishLesson} className="btn-finish">Finish Lesson & Return to Dashboard</button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentScreen !== 1 && currentScreen !== 8 && (
        <div className="screen-navigation">
          <button className="btn-nav btn-prev" onClick={prevScreen}>← Previous</button>
          <button className="btn-nav" onClick={nextScreen}>Next →</button>
        </div>
      )}
    </div>
  );
}
