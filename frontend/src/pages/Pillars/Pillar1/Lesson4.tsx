import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@config/api";
import "@css/utilities/lesson.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const quizData: QuizQuestion[][] = [
  [
    {
      question: "What is the main difference between needs and wants?",
      options: [
        "Needs are expensive, wants are cheap",
        "Needs are essentials for survival, wants enhance your life but aren't necessary",
        "Needs are boring, wants are fun",
        "There is no difference",
      ],
      correct: 1,
    },
    {
      question: "Which statement best describes the difference between needs and wants?",
      options: [
        "Needs keep you alive, wants make life enjoyable",
        "All needs are wants",
        "Wants are more important than needs",
        "Needs and wants are always the same",
      ],
      correct: 0,
    },
  ],
  [
    {
      question: "Which of the following is a true need?",
      options: [
        "Designer clothing",
        "Latest smartphone model",
        "Nutritious food for meals",
        "Premium cable package",
      ],
      correct: 2,
    },
    {
      question: "Which item is most likely a want rather than a need?",
      options: [
        "Basic shelter",
        "Entertainment subscriptions",
        "Medical care",
        "Work transportation",
      ],
      correct: 1,
    },
  ],
  [
    {
      question: "In the lesson, Jordan could save how much per year by identifying wants disguised as needs?",
      options: ["$1,200", "$2,940", "$5,000", "$500"],
      correct: 1,
    },
    {
      question: "What did Jordan discover about expenses labeled as 'needs'?",
      options: [
        "They were all actual needs",
        "$245/month were actually wants or upgrades",
        "Everything was essential",
        "Only $50 was unnecessary",
      ],
      correct: 1,
    },
  ],
  [
    {
      question: "According to the lesson, when should needs come first?",
      options: [
        "Never, wants are more important",
        "Only on weekends",
        "If you're in debt or struggling financially, always",
        "Only during emergencies",
      ],
      correct: 2,
    },
    {
      question: "What's the problem with calling everything a 'need'?",
      options: [
        "It prevents honest assessment of spending",
        "It makes you happier",
        "It increases your income",
        "It has no effect on finances",
      ],
      correct: 0,
    },
  ],
];

export default function Lesson4() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(1);
  const totalScreens = 8;

  const [quizVersion, setQuizVersion] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    updateNav();
    initQuiz();

  }, []);

  const showScreen = (num: number) => {
    if (num >= 1 && num <= totalScreens) setCurrentScreen(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextScreen = () => showScreen(currentScreen + 1);
  const previousScreen = () => showScreen(currentScreen - 1);

  /** NAVIGATION */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const updateNav = async () => {
    const cachedAuth = localStorage.getItem("authState");
    if (cachedAuth) setIsLoggedIn(JSON.parse(cachedAuth).isLoggedIn);

    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      const loggedIn = res.ok;
      setIsLoggedIn(loggedIn);
      localStorage.setItem("authState", JSON.stringify({ isLoggedIn: loggedIn }));
    } catch {
      setIsLoggedIn(false);
      localStorage.setItem("authState", JSON.stringify({ isLoggedIn: false }));
    }
  };

  const logout = async () => {
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    try {
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error(err);
    }
    navigate("/");
  };

  /** QUIZ LOGIC */
  const initQuiz = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const passed = localStorage.getItem(`lesson4_quiz_passed_${userId}`) === "true";
    if (passed) setQuizPassed(true);

    // Randomly pick one version per question set
    const version = quizData.map((qSet) => qSet[Math.floor(Math.random() * qSet.length)]);
    setQuizVersion(version);
    setUserAnswers(new Array(version.length).fill(null));
  };

  const selectAnswer = (qIndex: number, oIndex: number) => {
    const updated = [...userAnswers];
    updated[qIndex] = oIndex;
    setUserAnswers(updated);
  };

  const submitQuiz = () => {
    if (userAnswers.includes(null)) return alert("Answer all questions.");
    let correct = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === quizVersion[idx].correct) correct++;
    });
    const passed = correct / quizVersion.length >= 0.8;
    if (passed) {
      setQuizPassed(true);
      const userId = localStorage.getItem("userId");
      localStorage.setItem(`lesson4_quiz_passed_${userId}`, "true");
    }
    alert(`You scored ${correct} / ${quizVersion.length} (${Math.round((correct / quizVersion.length) * 100)}%)`);
  };

  const finishLesson = () => {
    if (!quizPassed) return alert("Complete the quiz first!");
    navigate("/pillar1-lessons");
  };

  return (
    <div className="lesson-container">
      {/* NAVBAR */}
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

      {/* LESSON HEADER */}
      <div className="lesson-header">
        <a href="/pillar1-lessons" className="back-link">← Back to Pillar 1 Lessons</a>
        <div className="lesson-number">LESSON 4</div>
        <h1>Needs vs. Wants</h1>
      </div>

      {/* SCREENS */}
      {currentScreen === 1 && (
        <div className="lesson-screen">
          <div className="screen-progress">Screen 1 of 8</div>
          <h2>Quick Intro</h2>
          <p>Most people think they "need" things they actually just want—and it's costing them their future.</p>
          <button onClick={nextScreen} className="btn-nav">Next →</button>
        </div>
      )}
      {currentScreen === 2 && (
        <div className="lesson-screen">
          <div className="screen-progress">Screen 2 of 8</div>
          <h2>Core Concept</h2>
          <p><strong>Needs are essentials; wants enhance life but aren't necessary.</strong></p>
          <button onClick={previousScreen} className="btn-nav">← Previous</button>
          <button onClick={nextScreen} className="btn-nav">Next →</button>
        </div>
      )}
      {/* Continue screens 3-8 similarly with checkpoint logic, examples, reflection, and quiz */}

      {currentScreen === 8 && (
        <div className="lesson-screen">
          <div className="screen-progress">Screen 8 of 8</div>
          <h2>Lesson Quiz</h2>
          {quizVersion.map((q, i) => (
            <div key={i} className="question-card">
              <div>{q.question}</div>
              {q.options.map((opt, j) => (
                <div key={j} className={`answer-option ${userAnswers[i] === j ? "selected" : ""}`} onClick={() => selectAnswer(i, j)}>
                  <input type="radio" checked={userAnswers[i] === j} readOnly /> {opt}
                </div>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz} className="btn-submit-quiz">Submit Quiz</button>
          <button onClick={finishLesson} disabled={!quizPassed} className="btn-finish">Finish Lesson</button>
        </div>
      )}
    </div>
  );
}
