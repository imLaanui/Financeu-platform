import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
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

const Lesson8 = () => {
  const totalScreens = 8;
  const [currentScreen, setCurrentScreen] = useState(1);
  const [checkpoint1Answered, setCheckpoint1Answered] = useState(false);
  const [checkpoint2Answered, setCheckpoint2Answered] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const userId = localStorage.getItem("userId");

  // Multi-screen navigation
  const showScreen = (screenNumber: number) => {
    if (screenNumber < 1 || screenNumber > totalScreens) return;
    setCurrentScreen(screenNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextScreen = () => showScreen(currentScreen + 1);
  const previousScreen = () => showScreen(currentScreen - 1);

  // Quiz initialization
  useEffect(() => {
    if (!userId) return;

    const quizPassedStatus = localStorage.getItem(`lesson8_quiz_passed_${userId}`);
    if (quizPassedStatus === "true") {
      setQuizPassed(true);
      return;
    }

    // Pick random versions
    const questions = quizData.map((q) => {
      const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
      return randomVersion;
    });

    setCurrentQuestions(questions);
    setUserAnswers(Array(questions.length).fill(null));
  }, [userId]);

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

    let correct = 0;
    currentQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correct) correct++;
    });

    const percentage = Math.round((correct / currentQuestions.length) * 100);
    const passed = percentage >= 80;

    if (passed) {
      setQuizPassed(true);
      userId && localStorage.setItem(`lesson8_quiz_passed_${userId}`, "true");
    } else {
      alert("You did not pass. Review the lesson and try again!");
      // Reset answers
      setUserAnswers(Array(currentQuestions.length).fill(null));
    }
  };

  const finishLesson = async () => {
    if (!quizPassed) {
      alert("Please complete the quiz first!");
      return;
    }
    // Call backend to mark lesson complete
    await fetch(`${API_URL}/lessons/complete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lesson: "pillar1_lesson8" }),
    });
    window.location.href = "/pillar1-lessons";
  };

  const checkCheckpoint = (checkpoint: 1 | 2, selected: number) => {
    if (checkpoint === 1 && checkpoint1Answered) return;
    if (checkpoint === 2 && checkpoint2Answered) return;

    const correctOption = checkpoint === 1 ? 1 : 1;
    const isCorrect = selected === correctOption;

    if (checkpoint === 1) setCheckpoint1Answered(true);
    if (checkpoint === 2) setCheckpoint2Answered(true);

    alert(isCorrect ? "Correct!" : "Not quite, but check the lesson!");
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
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li id="authButtons" style={{ opacity: 0 }}>
                {/* JS will populate login/logout */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Screens */}
      {currentScreen === 1 && (
        <div className="lesson-screen active">
          <h1>Lesson 8: Building Good Money Habits</h1>
          <p>Quick intro and what you'll learn...</p>
          <button onClick={nextScreen}>Next →</button>
        </div>
      )}
      {currentScreen === 2 && (
        <div className="lesson-screen">
          <h2>Core Concept</h2>
          <p>Money habits are automatic behaviors that shape your financial life...</p>
          <button onClick={previousScreen}>← Previous</button>
          <button onClick={nextScreen}>Next →</button>
        </div>
      )}
      {currentScreen === 3 && (
        <div className="lesson-screen">
          <h3>Checkpoint 1</h3>
          <p>What's the 'Pay Yourself First' principle?</p>
          <button onClick={() => checkCheckpoint(1, 0)}>A</button>
          <button onClick={() => checkCheckpoint(1, 1)}>B</button>
          <button onClick={() => checkCheckpoint(1, 2)}>C</button>
          <button onClick={() => checkCheckpoint(1, 3)}>D</button>
          <button onClick={nextScreen}>Continue →</button>
        </div>
      )}
      {/* Continue screens 4-7 similarly */}

      {currentScreen === 8 && (
        <div className="lesson-screen">
          <h2>Lesson Quiz</h2>
          {currentQuestions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <p>Question {qIndex + 1}: {q.question}</p>
              {q.options.map((opt, oIndex) => (
                <div
                  key={oIndex}
                  className={`answer-option ${userAnswers[qIndex] === oIndex ? "selected" : ""}`}
                  onClick={() => selectAnswer(qIndex, oIndex)}
                >
                  <input type="radio" checked={userAnswers[qIndex] === oIndex} readOnly />
                  {opt}
                </div>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>Submit Quiz</button>
          {quizPassed && (
            <div>
              <h3>🎉 Congratulations!</h3>
              <p>You've completed all 8 lessons of Pillar 1!</p>
              <button onClick={finishLesson}>Finish Lesson & Return to Dashboard</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Lesson8;
