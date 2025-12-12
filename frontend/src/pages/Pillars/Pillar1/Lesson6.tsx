import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "@css/lesson.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const quizData: QuizQuestion[] = [
  {
    question: "What is one of the main functions of banks?",
    options: [
      "To make money disappear",
      "To store money safely and facilitate transactions",
      "To charge as many fees as possible",
      "To invest in stocks only",
    ],
    correct: 1,
  },
  {
    question: "What is the main purpose of a checking account?",
    options: [
      "Long-term savings",
      "Daily transactions and frequent access",
      "Earning high interest",
      "Investing in stocks",
    ],
    correct: 1,
  },
  {
    question: "What type of institution is member-owned and often has better rates?",
    options: ["Traditional banks", "Online banks", "Credit unions", "Payday lenders"],
    correct: 2,
  },
  {
    question: "What common banking mistake involves spending more than you have?",
    options: [
      "Saving too much",
      "Overdrawing your account",
      "Using the mobile app",
      "Having direct deposit",
    ],
    correct: 1,
  },
];

export default function Lesson6() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const totalScreens = 8;

  const [checkpoint1Answered, setCheckpoint1Answered] = useState(false);
  const [checkpoint2Answered, setCheckpoint2Answered] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState<number[]>(new Array(quizData.length).fill(-1));
  const [quizPassed, setQuizPassed] = useState(false);

  // Auth buttons
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authState = localStorage.getItem("authState");
    if (authState) setIsLoggedIn(JSON.parse(authState).isLoggedIn);

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
  };

  const logout = async () => {
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    try {
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  const selectQuizAnswer = (qIndex: number, optionIndex: number) => {
    const updated = [...quizAnswers];
    updated[qIndex] = optionIndex;
    setQuizAnswers(updated);
  };

  const submitQuiz = () => {
    if (quizAnswers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const correctCount = quizAnswers.reduce((acc, ans, idx) => acc + (ans === quizData[idx].correct ? 1 : 0), 0);
    const passed = correctCount / quizData.length >= 0.8;
    setQuizPassed(passed);

    if (passed) {
      const userId = localStorage.getItem("userId");
      if (userId) localStorage.setItem(`lesson6_quiz_passed_${userId}`, "true");
    }
  };

  const finishLesson = () => {
    if (!quizPassed) {
      alert("Please complete the quiz first!");
      return;
    }
    window.location.href = "/pillar1-lessons";
  };

  const checkCheckpoint1 = (selected: number) => {
    if (checkpoint1Answered) return;
    setCheckpoint1Answered(true);
  };

  const checkCheckpoint2 = (selected: number) => {
    if (checkpoint2Answered) return;
    setCheckpoint2Answered(true);
  };

  const nextScreen = () => setCurrentScreen(Math.min(currentScreen + 1, totalScreens));
  const previousScreen = () => setCurrentScreen(Math.max(currentScreen - 1, 1));

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
                {isLoggedIn ? (
                  <button onClick={logout} className="btn-primary">Logout</button>
                ) : (
                  <a href="/login" className="btn-primary">Login</a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Screens */}
      <div style={{ display: currentScreen === 1 ? "block" : "none" }}>
        <h1>Lesson 6: Introduction to Banking</h1>
        <p>Most people choose banks randomly and pay hundreds in unnecessary fees every year.</p>
        <button onClick={nextScreen}>Next →</button>
      </div>

      <div style={{ display: currentScreen === 2 ? "block" : "none" }}>
        <h2>Core Concept</h2>
        <ul>
          <li>Banks store money safely, provide transactions, and offer credit.</li>
          <li>Types: Traditional, Credit Unions, Online.</li>
        </ul>
        <button onClick={previousScreen}>← Previous</button>
        <button onClick={nextScreen}>Next →</button>
      </div>

      {/* Add other screens similarly */}
      <div style={{ display: currentScreen === 8 ? "block" : "none" }}>
        <h2>Lesson Quiz</h2>
        {quizData.map((q, qIndex) => (
          <div key={qIndex}>
            <p>{qIndex + 1}. {q.question}</p>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex}>
                <input
                  type="radio"
                  name={`q${qIndex}`}
                  checked={quizAnswers[qIndex] === oIndex}
                  onChange={() => selectQuizAnswer(qIndex, oIndex)}
                />
                {opt}
              </div>
            ))}
          </div>
        ))}
        <button onClick={submitQuiz}>Submit Quiz</button>
        {quizPassed && <button onClick={finishLesson}>Finish Lesson</button>}
      </div>

      {/* Navigation Buttons */}
      <div>
        {currentScreen > 1 && <button onClick={previousScreen}>← Previous</button>}
        {currentScreen < totalScreens && <button onClick={nextScreen}>Next →</button>}
      </div>
    </div>
  );
}
