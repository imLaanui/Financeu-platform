import { useState } from "react";
import "@css/Pillar1Quiz.css";

interface Question {
  lesson: number;
  question: string;
  answers: string[];
  correct: number;
}

const questions: Question[] = [
  { lesson: 1, question: "What are the three main functions of money?", answers: ["Medium of exchange, store of value, unit of account", "Earning, saving, spending", "Cash, credit, investments", "Income, expenses, profit"], correct: 0 },
  { lesson: 1, question: "Why does money have value?", answers: ["Because it's made of precious metals", "Because society agrees it has value", "Because the government prints it", "Because banks guarantee it"], correct: 1 },
  { lesson: 2, question: "What is the basic formula for personal finance?", answers: ["Income + Expenses = Savings", "Income - Expenses = What's Left", "Expenses - Income = Debt", "Income × Expenses = Budget"], correct: 1 },
  { lesson: 2, question: "Which is an example of a variable expense?", answers: ["Rent payment", "Car insurance", "Groceries", "Student loan payment"], correct: 2 },
  { lesson: 3, question: "Why is money today worth more than the same amount in the future?", answers: ["Because prices always go down", "Because of growth potential, inflation, and opportunity cost", "Because cash is better than checks", "Because banks prefer immediate deposits"], correct: 1 },
  { lesson: 3, question: "If you invest $100 at age 20 with 7% annual growth until age 65, approximately how much will you have?", answers: ["$500", "$761", "$1,050", "$1,497"], correct: 3 },
  { lesson: 4, question: "What is a 'need' in personal finance?", answers: ["Anything you really want", "Essential for survival and basic functioning", "Items under $50", "Things your friends have"], correct: 1 },
  { lesson: 4, question: "Which of these is most likely a 'want' rather than a 'need'?", answers: ["Grocery food", "Basic internet for work", "Premium streaming subscriptions", "Work clothes"], correct: 2 },
  { lesson: 5, question: "What does SMART stand for in goal setting?", answers: ["Simple, Manageable, Actionable, Realistic, Timely", "Specific, Measurable, Achievable, Relevant, Time-bound", "Save, Manage, Achieve, Review, Track", "Strategic, Meaningful, Attainable, Recorded, Tested"], correct: 1 },
  { lesson: 5, question: "What is the recommended first financial goal for most people?", answers: ["Buy a house", "Save $1 million", "Build a $1,000 emergency fund", "Invest in stocks"], correct: 2 },
  { lesson: 6, question: "What is the main difference between a checking and savings account?", answers: ["Checking is for daily transactions, savings is for storing money and earning interest", "Checking has no fees, savings has fees", "Checking earns more interest", "There is no difference"], correct: 0 },
  { lesson: 6, question: "What does FDIC insurance protect?", answers: ["Your investments in stocks", "Your bank deposits up to $250,000", "Your credit card debt", "Your mortgage payments"], correct: 1 },
  { lesson: 7, question: "What is the main benefit of tracking your spending?", answers: ["It makes you feel guilty", "It helps you see patterns and identify problems", "Banks require it", "It impresses your friends"], correct: 1 },
  { lesson: 7, question: "Which tracking method is best?", answers: ["Apps only", "Spreadsheets only", "Pen and paper only", "Whichever method you'll use consistently"], correct: 3 },
  { lesson: 8, question: "What is the 'pay yourself first' principle?", answers: ["Buy things you want before bills", "Save money before spending on anything else", "Pay your salary before taxes", "Give yourself a bonus"], correct: 1 },
  { lesson: 8, question: "What is the '24-hour rule' for purchases?", answers: ["Shop only during business hours", "Wait one day before making unplanned purchases over $50", "Return items within 24 hours", "Pay bills within 24 hours"], correct: 1 },
];

// Shuffle questions once outside component to avoid impure function during render
const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

export default function Quiz() {
  const [answers, setAnswers] = useState<number[]>(Array(16).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex: number, answerIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = answerIndex;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const correct = shuffledQuestions.reduce((acc, q, idx) => acc + (q.correct === answers[idx] ? 1 : 0), 0);
    setScore(correct);
    const userId = localStorage.getItem("userId");
    localStorage.setItem(`pillar1_quiz_completed_${userId}`, "true");
    localStorage.setItem(`pillar1_quiz_score_${userId}`, Math.round((correct / shuffledQuestions.length) * 100).toString());
    setShowResult(true);
  };

  return (
    <div className="quiz-container">
      <a href="/pillar1-lessons" className="back-link">← Back to Pillar 1 Lessons</a>
      <div className="quiz-header">
        <h1>Pillar 1 Final Quiz</h1>
        <p style={{ color: "var(--text-secondary)" }}>Test your knowledge of Financial Literacy Fundamentals</p>
        <p style={{ color: "var(--text-secondary)", marginTop: "10px" }}>16 questions • 80% to pass</p>
      </div>

      <div className="quiz-progress">
        Question {answers.filter(a => a !== -1).length} of {shuffledQuestions.length}
      </div>

      <form>
        {shuffledQuestions.map((q, idx) => (
          <div key={idx} className="question-card">
            <div className="question-number">Question {idx + 1} of {shuffledQuestions.length}</div>
            <div className="question-text">{q.question}</div>
            <div className="answer-options">
              {q.answers.map((a, i) => (
                <div key={i} className="answer-option">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={answers[idx] === i}
                    onChange={() => handleSelect(idx, i)}
                  />
                  <label>{a}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </form>

      <button className="btn-submit-quiz" onClick={handleSubmit}>Submit Quiz</button>

      {showResult && (
        <div className="result-modal" style={{ display: "flex" }}>
          <div className={`result-content ${score >= 13 ? "pass" : "fail"}`}>
            <h2 className="result-message">{score >= 13 ? "Congratulations! You Passed! 🎉" : "Not Quite There Yet"}</h2>
            <div className={`result-score ${score >= 13 ? "pass" : "fail"}`}>{Math.round((score / shuffledQuestions.length) * 100)}%</div>
            <p className="result-details">You answered {score} out of {shuffledQuestions.length} questions correctly.</p>
            <div>
              {score < 13 && <a href="/pillar1-quiz" className="btn-result btn-retry">Retry Quiz</a>}
              <a href="/pillar1-lessons" className="btn-result btn-continue">Back to Lessons</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
