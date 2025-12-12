import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@config/api";
import { completeLesson } from "@utils/lessonCompletion";
import "@css/lesson.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const quizData: { versions: QuizQuestion[] }[] = [
  {
    versions: [
      {
        question: "What are the three main functions of money?",
        options: [
          "Medium of exchange, store of value, unit of account",
          "Earning, spending, and saving",
          "Cash, credit, and investments",
          "Income, expenses, and profit",
        ],
        correct: 0,
      },
      {
        question: "Which of the following is NOT a primary function of money?",
        options: ["Creating happiness", "Medium of exchange", "Store of value", "Unit of account"],
        correct: 0,
      },
    ],
  },
  {
    versions: [
      {
        question: "Why does money have value?",
        options: [
          "Because it's made of special paper",
          "Because society agrees it has value",
          "Because the government prints it",
          "Because it's backed by gold",
        ],
        correct: 1,
      },
      {
        question: "What makes a $20 bill valuable?",
        options: [
          "The paper it's printed on",
          "The ink used to print it",
          "Collective trust and acceptance by society",
          "The serial number on it",
        ],
        correct: 2,
      },
    ],
  },
  {
    versions: [
      {
        question: "What problem does money solve compared to bartering?",
        options: [
          "It makes things more expensive",
          "It eliminates the need to find someone who wants what you have",
          "It makes transactions slower",
          "It requires more paperwork",
        ],
        correct: 1,
      },
      {
        question: "How does money improve upon the barter system?",
        options: [
          "You don't need to trade goods directly with someone who wants them",
          "It makes all goods cost the same",
          "It prevents people from saving",
          "It eliminates the need for work",
        ],
        correct: 0,
      },
    ],
  },
  {
    versions: [
      {
        question: "According to the lesson, which statement about money is true?",
        options: ["Money equals happiness", "Money is evil", "Money is a neutral tool", "All money has the same impact on your finances"],
        correct: 2,
      },
      {
        question: "What is the best way to think about money?",
        options: [
          "As the ultimate life goal",
          "As something to avoid",
          "As a tool that provides security and options",
          "As something that only creates problems",
        ],
        correct: 2,
      },
    ],
  },
];

interface CheckpointFeedback {
  show: boolean;
  correct: boolean;
  title: string;
  explanation: string;
  icon: string;
}

export default function Lesson1() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const totalScreens = 8;
  const [authState, setAuthState] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizResult, setQuizResult] = useState<React.ReactNode>(null);
  const [checkpointFeedback, setCheckpointFeedback] = useState<Record<number, CheckpointFeedback>>({
    1: { show: false, correct: false, title: "", explanation: "", icon: "" },
    2: { show: false, correct: false, title: "", explanation: "", icon: "" },
  });

  const navigate = useNavigate();

  // AUTH
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const cachedAuth = localStorage.getItem("authState");
        if (cachedAuth) setAuthState(JSON.parse(cachedAuth).isLoggedIn);

        const response = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const loggedIn = response.ok;
        setAuthState(loggedIn);
        localStorage.setItem("authState", JSON.stringify({ isLoggedIn: loggedIn }));
      } catch {
        setAuthState(false);
        localStorage.setItem("authState", JSON.stringify({ isLoggedIn: false }));
      }
    };

    checkAuth();
  }, []);

  // QUIZ INIT
  useEffect(() => {
    const initQuiz = () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const passedStatus = localStorage.getItem(`lesson1_quiz_passed_${userId}`);
      if (passedStatus === "true") {
        setQuizPassed(true);
        return;
      }

      const selected = quizData.map((q) => q.versions[Math.floor(Math.random() * q.versions.length)]);
      setQuizQuestions(selected);
      setUserAnswers(Array(selected.length).fill(null));
    };
    initQuiz();
  }, []);

  const nextScreen = () => setCurrentScreen((prev) => Math.min(prev + 1, totalScreens));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentScreen]);

  const handleCheckpoint = (checkpoint: 1 | 2, selectedOption: number) => {
    const correctOption = checkpoint === 1 ? 3 : 1;
    const isCorrect = selectedOption === correctOption;

    setCheckpointFeedback((prev) => ({
      ...prev,
      [checkpoint]: {
        show: true,
        correct: isCorrect,
        title:
          checkpoint === 1
            ? isCorrect
              ? "Correct!"
              : "Not quite, but that's okay!"
            : isCorrect
            ? "Excellent!"
            : "Good thinking, but there's a better answer!",
        explanation:
          checkpoint === 1
            ? `Money has three functions: medium of exchange, store of value, and unit of account. ${
                isCorrect ? "" : 'The correct answer is "Source of happiness."'
              }`
            : `This demonstrates money as a "medium of exchange." Instead of being stuck with items to trade (barter), money lets Sarah exchange her value for any goods or services she wants. ${
                isCorrect ? "" : "The best answer is that she can use cash to buy exactly what she wants at any store."
              }`,
        icon: isCorrect ? "🎉" : "💡",
      },
    }));
  };

  const selectAnswer = (qIndex: number, oIndex: number) => {
    setUserAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = oIndex;
      return copy;
    });
  };

  const submitQuiz = () => {
    if (userAnswers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correctCount++;
    });

    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    const passed = percentage >= 80;
    setQuizPassed(passed);

    const userId = localStorage.getItem("userId");
    if (userId && passed) localStorage.setItem(`lesson1_quiz_passed_${userId}`, "true");

    setQuizResult(
      passed ? (
        <div className="quiz-result pass">
          <div className="result-icon">🎉</div>
          <div className="result-text" style={{ color: "#10b981" }}>
            Quiz Passed!
          </div>
          <div className="result-score">
            You scored {correctCount} out of {quizQuestions.length} ({percentage}%)
          </div>
        </div>
      ) : (
        <div className="quiz-result fail">
          <div className="result-icon">📚</div>
          <div className="result-text" style={{ color: "#dc2626" }}>
            Not quite there yet
          </div>
          <div className="result-score">
            You scored {correctCount} out of {quizQuestions.length} ({percentage}%)
          </div>
          <button className="btn-retry" onClick={() => window.location.reload()}>
            Retry Quiz
          </button>
        </div>
      )
    );
  };

  const finishLesson = async () => {
    if (!quizPassed) {
      alert("Please complete the quiz first!");
      return;
    }
    const success = await completeLesson("pillar1_lesson1", 1, 1);
    if (success) navigate("/pillar1-lessons");
  };

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
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                {authState ? (
                  <button className="btn-primary">Logout</button>
                ) : (
                  <a href="/login" className="btn-primary">
                    Login
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Screens */}
      {currentScreen === 1 && (
        <div className="lesson-screen active">
          <div className="screen-progress">Screen 1 of 8</div>
          <h2>Quick Intro</h2>
          <p>Most people think money is just paper and coins in their wallet...</p>
          <button className="btn-nav" onClick={nextScreen}>
            Next →
          </button>
        </div>
      )}

      {/* Screen 3: Checkpoint */}
      {currentScreen === 3 && (
        <div className="lesson-screen">
          <h2>Checkpoint 1</h2>
          <p>Which of these is NOT one of the three main functions of money?</p>
          {["Medium of exchange", "Store of value", "Unit of account", "Source of happiness"].map(
            (opt, idx) => (
              <div key={idx} onClick={() => handleCheckpoint(1, idx)}>
                {opt}
              </div>
            )
          )}
          {checkpointFeedback[1].show && (
            <div className={`checkpoint-feedback ${checkpointFeedback[1].correct ? "correct" : "incorrect"}`}>
              <div className="checkpoint-feedback-icon">{checkpointFeedback[1].icon}</div>
              <div className="checkpoint-feedback-title">{checkpointFeedback[1].title}</div>
              <div className="checkpoint-explanation">{checkpointFeedback[1].explanation}</div>
              <button className="btn-nav" onClick={nextScreen}>
                Continue →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz */}
      {currentScreen === 8 && (
        <div className="lesson-screen">
          <h2>Lesson Quiz</h2>
          {quizQuestions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-text">
                Question {qIndex + 1}: {q.question}
              </div>
              {q.options.map((opt, oIndex) => (
                <label key={oIndex} className={`answer-option ${userAnswers[qIndex] === oIndex ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name={`question${qIndex}`}
                    value={oIndex}
                    checked={userAnswers[qIndex] === oIndex}
                    onChange={() => selectAnswer(qIndex, oIndex)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>Submit Quiz</button>
          {quizResult}
          <button disabled={!quizPassed} onClick={finishLesson}>
            Finish Lesson
          </button>
        </div>
      )}

      {/* Placeholder screens 2, 4-7 */}
      {[2, 4, 5, 6, 7].includes(currentScreen) && (
        <div className="lesson-screen">
          <h2>Screen {currentScreen}</h2>
          <p>Content for screen {currentScreen} goes here...</p>
          <button className="btn-nav" onClick={nextScreen}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
