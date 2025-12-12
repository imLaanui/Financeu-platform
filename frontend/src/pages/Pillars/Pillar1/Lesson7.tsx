import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import "@css/lesson.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export default function Lesson7() {
  const [authState, setAuthState] = useState<{ isLoggedIn: boolean }>({ isLoggedIn: false });
  const [currentScreen, setCurrentScreen] = useState(1);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);

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

    const lessonPassed = localStorage.getItem(`lesson7_quiz_passed_${userId}`) === "true";
    if (lessonPassed) {
      setQuizPassed(true);
      return;
    }

    // Example quiz data
    const quizData: QuizQuestion[] = [
      {
        question: "Why is tracking your money important?",
        options: [
          "It makes you feel bad about spending",
          "It provides awareness and control over spending patterns",
          "It's not important, just spend freely",
          "Banks require it",
        ],
        correct: 1,
      },
      {
        question: "In Casey's example, how much in spending did they not remember?",
        options: ["$100", "$200", "$315", "$500"],
        correct: 2,
      },
      {
        question: "According to the lesson, what is the best tracking method?",
        options: [
          "The most expensive app",
          "Pen and paper only",
          "The one you'll actually use consistently",
          "Excel spreadsheets only",
        ],
        correct: 2,
      },
      {
        question: "What common mistake do people make when tracking?",
        options: [
          "Being too detailed and giving up",
          "Tracking too little",
          "Using technology",
          "Writing things down",
        ],
        correct: 0,
      },
    ];

    setQuizQuestions(quizData);
    setUserAnswers(new Array(quizData.length).fill(null));
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
    const passed = correct / quizQuestions.length >= 0.75;

    setQuizPassed(passed);

    if (passed) {
      const userId = localStorage.getItem("userId");
      localStorage.setItem(`lesson7_quiz_passed_${userId}`, "true");
    } else {
      alert("You need at least 75% to pass. Try again!");
    }
  };

  const finishLesson = () => {
    if (!quizPassed) {
      alert("Complete the quiz first!");
      return;
    }
    window.location.href = "/pillar1-lessons";
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

      {/* Lesson Screens */}
      <div className={`lesson-screen ${currentScreen === 1 ? "active" : ""}`}>
        <div className="lesson-header">
          <div className="lesson-number">LESSON 7</div>
          <h1>Tracking Your Money</h1>
        </div>
        <p>Screen 1 content...</p>
        <div className="screen-navigation">
          <button className="btn-nav" onClick={nextScreen}>Next →</button>
        </div>
      </div>

      {/* Add all other screens similarly, keeping currentScreen checks */}

      {/* Screen 8: Quiz */}
      {currentScreen === 8 && (
        <div className="lesson-screen active">
          <div className="quiz-container">
            <h2>Lesson Quiz</h2>
            {quizQuestions.map((q, i) => (
              <div key={i} className="question-card">
                <div className="question-text">{q.question}</div>
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
          </div>
          <button onClick={finishLesson} className="btn-finish" disabled={!quizPassed}>Finish Lesson</button>
        </div>
      )}

      <div className="screen-navigation">
        <button className="btn-nav btn-prev" onClick={prevScreen}>← Previous</button>
        <button className="btn-nav" onClick={nextScreen}>Next →</button>
      </div>
    </div>
  );
}
