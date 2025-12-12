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
        question: "What does the 'S' in SMART goals stand for?",
        options: ["Simple", "Specific", "Strategic", "Sudden"],
        correct: 1,
      },
      {
        question:
          "According to the SMART framework, goals should be:",
        options: [
          "Vague and flexible",
          "Specific, Measurable, Achievable, Relevant, and Time-bound",
          "Simple and easy",
          "Complicated and impressive",
        ],
        correct: 1,
      },
    ],
  },
  {
    versions: [
      {
        question: "Which is an example of a short-term financial goal?",
        options: [
          "Retirement savings",
          "Buying a house",
          "Emergency fund (0-1 year)",
          "Children's college fund",
        ],
        correct: 2,
      },
      {
        question: "What timeframe defines a long-term financial goal?",
        options: ["0-1 year", "1-3 years", "3-5 years", "5+ years"],
        correct: 3,
      },
    ],
  },
  {
    versions: [
      {
        question: "Which is a better financial goal?",
        options: [
          "Save more money",
          "Save $500 by December 31st by setting aside $42 per month",
          "Get rich",
          "Try to save something",
        ],
        correct: 1,
      },
      {
        question: "What makes a goal 'measurable'?",
        options: [
          "It's written down",
          "It has specific numbers and can be tracked",
          "It's difficult",
          "Everyone has the same goal",
        ],
        correct: 1,
      },
    ],
  },
  {
    versions: [
      {
        question: "What common mistake involves setting financial goals?",
        options: [
          "Setting too many goals at once",
          "Writing goals down",
          "Making goals too easy",
          "Reviewing progress monthly",
        ],
        correct: 0,
      },
      {
        question: "According to the lesson, how many priority goals should you focus on?",
        options: ["As many as possible", "1-3 priorities", "10 or more", "None, just wing it"],
        correct: 1,
      },
    ],
  },
];

const Lesson5: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(1);
  const totalScreens = 8;

  const [checkpoint1Answered, setCheckpoint1Answered] = useState(false);
  const [checkpoint2Answered, setCheckpoint2Answered] = useState(false);

  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizPassed, setQuizPassed] = useState(false);

  // Initialize quiz
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const passed = localStorage.getItem(`lesson5_quiz_passed_${userId}`) === "true";
    if (passed) {
      setQuizPassed(true);
      return;
    }

    // Pick a random version for each question
    const questions = quizData.map((q) => {
      const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
      return randomVersion;
    });

    setCurrentQuestions(questions);
    setUserAnswers(new Array(questions.length).fill(null));
  }, []);

  const nextScreen = () => {
    if (currentScreen < totalScreens) setCurrentScreen(currentScreen + 1);
  };

  const prevScreen = () => {
    if (currentScreen > 1) setCurrentScreen(currentScreen - 1);
  };

  const selectCheckpoint = (checkpoint: 1 | 2, option: number) => {
    if (checkpoint === 1 && checkpoint1Answered) return;
    if (checkpoint === 2 && checkpoint2Answered) return;

    const correct = checkpoint === 1 ? 1 : 1; // Both correct options hardcoded

    if (checkpoint === 1) setCheckpoint1Answered(true);
    if (checkpoint === 2) setCheckpoint2Answered(true);

    // Visual feedback handled via CSS classes in real implementation
  };

  const selectAnswer = (qIndex: number, oIndex: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[qIndex] = oIndex;
    setUserAnswers(updatedAnswers);
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
      const userId = localStorage.getItem("userId");
      if (userId) localStorage.setItem(`lesson5_quiz_passed_${userId}`, "true");
    } else {
      // Reset or allow retry
      alert("You need 80% to pass. Try again!");
    }
  };

  const finishLessonHandler = async () => {
    if (!quizPassed) {
      alert("Please complete the quiz first!");
      return;
    }

    const success = await completeLesson("pillar1_lesson5", 1, 5);
    if (success) navigate("/pillar1-lessons");
  };

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
              <li><a href="dashboard">Dashboard</a></li>
              <li id="authButtons" style={{ opacity: 0 }}></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Lesson Header */}
      <div className="lesson-header">
        <div className="lesson-number">LESSON 5</div>
        <h1>Setting Financial Goals</h1>
      </div>

      {/* Screens */}
      <div className={`lesson-screen ${currentScreen === 1 ? "active" : ""}`}>
        {/* Screen 1 content */}
      </div>

      <div className={`lesson-screen ${currentScreen === 2 ? "active" : ""}`}>
        {/* Screen 2 content */}
      </div>

      <div className={`lesson-screen ${currentScreen === 3 ? "active" : ""}`}>
        {/* Screen 3 checkpoint */}
      </div>

      <div className={`lesson-screen ${currentScreen === 4 ? "active" : ""}`}>
        {/* Screen 4 example & visual */}
      </div>

      <div className={`lesson-screen ${currentScreen === 5 ? "active" : ""}`}>
        {/* Screen 5 checkpoint 2 */}
      </div>

      <div className={`lesson-screen ${currentScreen === 6 ? "active" : ""}`}>
        {/* Screen 6 mistakes */}
      </div>

      <div className={`lesson-screen ${currentScreen === 7 ? "active" : ""}`}>
        {/* Screen 7 micro action + reflection */}
      </div>

      <div className={`lesson-screen ${currentScreen === 8 ? "active" : ""}`}>
        {/* Screen 8 quiz */}
      </div>

      {/* Navigation Buttons */}
      <div className="screen-navigation">
        <button className="btn-nav btn-prev" onClick={prevScreen}>← Previous</button>
        <button className="btn-nav" onClick={nextScreen}>Next →</button>
      </div>
    </div>
  );
};

export default Lesson5;
