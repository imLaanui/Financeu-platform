import { useEffect, useState } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import '@css/utilities/lesson.css';

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
}

interface QuizData {
    versions: QuizQuestion[];
}

export default function Lesson1() {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [checkpoint1Answered, setCheckpoint1Answered] = useState(false);
    const [checkpoint2Answered, setCheckpoint2Answered] = useState(false);
    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizResult, setQuizResult] = useState<{ correct: number; percentage: number } | null>(null);

    const totalScreens = 8;

    const quizData: QuizData[] = [
        {
            versions: [
                {
                    question: "What are the three main functions of money?",
                    options: [
                        "Medium of exchange, store of value, unit of account",
                        "Earning, spending, and saving",
                        "Cash, credit, and investments",
                        "Income, expenses, and profit"
                    ],
                    correct: 0
                },
                {
                    question: "Which of the following is NOT a primary function of money?",
                    options: [
                        "Creating happiness",
                        "Medium of exchange",
                        "Store of value",
                        "Unit of account"
                    ],
                    correct: 0
                }
            ]
        },
        {
            versions: [
                {
                    question: "Why does money have value?",
                    options: [
                        "Because it's made of special paper",
                        "Because society agrees it has value",
                        "Because the government prints it",
                        "Because it's backed by gold"
                    ],
                    correct: 1
                },
                {
                    question: "What makes a $20 bill valuable?",
                    options: [
                        "The paper it's printed on",
                        "The ink used to print it",
                        "Collective trust and acceptance by society",
                        "The serial number on it"
                    ],
                    correct: 2
                }
            ]
        },
        {
            versions: [
                {
                    question: "What problem does money solve compared to bartering?",
                    options: [
                        "It makes things more expensive",
                        "It eliminates the need to find someone who wants what you have",
                        "It makes transactions slower",
                        "It requires more paperwork"
                    ],
                    correct: 1
                },
                {
                    question: "How does money improve upon the barter system?",
                    options: [
                        "You don't need to trade goods directly with someone who wants them",
                        "It makes all goods cost the same",
                        "It prevents people from saving",
                        "It eliminates the need for work"
                    ],
                    correct: 0
                }
            ]
        },
        {
            versions: [
                {
                    question: "According to the lesson, which statement about money is true?",
                    options: [
                        "Money equals happiness",
                        "Money is evil",
                        "Money is a neutral tool",
                        "All money has the same impact on your finances"
                    ],
                    correct: 2
                },
                {
                    question: "What is the best way to think about money?",
                    options: [
                        "As the ultimate life goal",
                        "As something to avoid",
                        "As a tool that provides security and options",
                        "As something that only creates problems"
                    ],
                    correct: 2
                }
            ]
        }
    ];

    const initQuiz = () => {
        const selected = quizData.map(q => {
            const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
            return randomVersion;
        });
        setCurrentQuestions(selected);
        setUserAnswers(new Array(selected.length).fill(null));
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId || userId === 'null' || userId === 'undefined') {
            console.error('No valid userId found');
            return;
        }

        const quizPassedStatus = localStorage.getItem(`lesson1_quiz_passed_${userId}`);
        if (quizPassedStatus === 'true') {
            setQuizPassed(true);
            setQuizSubmitted(true);
        } else {
            initQuiz();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showScreen = (screenNumber: number) => {
        setCurrentScreen(screenNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const nextScreen = () => {
        if (currentScreen < totalScreens) {
            showScreen(currentScreen + 1);
        }
    };

    const previousScreen = () => {
        if (currentScreen > 1) {
            showScreen(currentScreen - 1);
        }
    };

    // FIX: Removed unused parameter
    const checkCheckpoint1 = () => {
        if (checkpoint1Answered) return;
        setCheckpoint1Answered(true);
    };

    // FIX: Removed unused parameter
    const checkCheckpoint2 = () => {
        if (checkpoint2Answered) return;
        setCheckpoint2Answered(true);
    };

    const selectAnswer = (questionIndex: number, optionIndex: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const submitQuiz = () => {
        if (userAnswers.includes(null)) {
            alert('Please answer all questions before submitting.');
            return;
        }

        let correct = 0;
        currentQuestions.forEach((q, index) => {
            if (userAnswers[index] === q.correct) {
                correct++;
            }
        });

        const percentage = Math.round((correct / currentQuestions.length) * 100);
        const passed = percentage === 100;

        setQuizResult({ correct, percentage });
        setQuizSubmitted(true);

        if (passed) {
            setQuizPassed(true);
            const userId = localStorage.getItem('userId');
            localStorage.setItem(`lesson1_quiz_passed_${userId}`, 'true');
        }
    };

    const retryQuiz = () => {
        setQuizSubmitted(false);
        setQuizResult(null);
        initQuiz();
    };

    const finishLesson = async () => {
        if (!quizPassed) {
            alert('Please complete the quiz first!');
            return;
        }

        // Mark lesson as completed
        const userId = localStorage.getItem('userId');
        const completedLessons = JSON.parse(localStorage.getItem(`pillar1_completed_${userId}`) || '[]');

        if (!completedLessons.includes(1)) {
            completedLessons.push(1);
            localStorage.setItem(`pillar1_completed_${userId}`, JSON.stringify(completedLessons));
        }

        window.location.href = '/pillar1-lessons';
    };

    const toggleChecklistItem = (index: number) => {
        const items = document.querySelectorAll('.checklist-item');
        items[index]?.classList.toggle('checked');
        const checkbox = items[index]?.querySelector('.checklist-checkbox');
        if (checkbox) {
            checkbox.textContent = items[index]?.classList.contains('checked') ? '✓' : '';
        }
    };

    return (
        <div className="lesson-page">
            <Navbar />

            <div className="lesson-container">
                <a href="/pillar1-lessons" className="back-link">← Back to Pillar 1 Lessons</a>

                {/* Header */}
                <div className="lesson-header">
                    <div className="lesson-number">LESSON 1</div>
                    <h1>What is Money?</h1>
                </div>

                {/* Screen 1: Quick Intro */}
                {currentScreen === 1 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 1 of 8</div>
                        <div className="lesson-section">
                            <h2>What is Money?</h2>
                            <div className="intro-cards">
                                <div className="intro-card">
                                    <div className="intro-card-icon">🎯</div>
                                    <h3>The Problem</h3>
                                    <p>Most people think money is just paper and coins</p>
                                </div>
                                <div className="intro-card">
                                    <div className="intro-card-icon">💡</div>
                                    <h3>Why It Matters</h3>
                                    <p>Understanding money helps you make smarter financial decisions</p>
                                </div>
                                <div className="intro-card">
                                    <div className="intro-card-icon">✨</div>
                                    <h3>What You'll Learn</h3>
                                    <p>Why money has value and how it works in your life</p>
                                </div>
                            </div>
                        </div>
                        <div className="screen-navigation">
                            <div className="nav-spacer"></div>
                            <button className="btn-nav" onClick={nextScreen}>Next <span>→</span></button>
                        </div>
                    </div>
                )}

                {/* Screen 2: Core Concept */}
                {currentScreen === 2 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 2 of 8</div>
                        <div className="lesson-section">
                            <h2>Core Concept</h2>
                            <p><strong>Money is a medium of exchange, a store of value, and a unit of account.</strong></p>
                            <p>Let's break that down:</p>
                            <ul>
                                <li><strong>Medium of Exchange:</strong> Money allows you to trade your work or goods for other things you need without having to barter directly. Instead of trading chickens for shoes, you sell chickens for money, then use that money to buy shoes.</li>
                                <li><strong>Store of Value:</strong> Money holds its worth over time, allowing you to save today and spend tomorrow. You can earn money now and use it months or years later.</li>
                                <li><strong>Unit of Account:</strong> Money provides a common way to measure value. Everything has a price tag, making it easy to compare what things are worth.</li>
                            </ul>
                            <p>Money only works because we all agree it has value. A $20 bill is just paper, but society accepts it as payment because we trust it represents real value.</p>
                        </div>
                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <button className="btn-nav" onClick={nextScreen}>Next <span>→</span></button>
                        </div>
                    </div>
                )}

                {/* Screen 3: Checkpoint Question 1 */}
                {currentScreen === 3 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 3 of 8</div>
                        <div className="checkpoint-container">
                            <div className="checkpoint-header">
                                <h3>Quick Check</h3>
                                <p>Let's pause and check your understanding. No pressure - you can continue regardless of your answer!</p>
                            </div>
                            <div className="checkpoint-question">
                                <div className="checkpoint-question-text">Which of these is NOT one of the three main functions of money?</div>
                                {['Medium of exchange', 'Store of value', 'Unit of account', 'Source of happiness'].map((option, idx) => (
                                    <div
                                        key={idx}
                                        className={`checkpoint-option ${checkpoint1Answered ? (idx === 3 ? 'correct' : '') : ''}`}
                                        onClick={checkCheckpoint1}
                                        style={{ pointerEvents: checkpoint1Answered ? 'none' : 'auto' }}
                                    >
                                        <input type="radio" name="checkpoint1" value={idx} />
                                        <span>{String.fromCharCode(65 + idx)}) {option}</span>
                                    </div>
                                ))}
                            </div>
                            {checkpoint1Answered && (
                                <div className="checkpoint-feedback show correct">
                                    <div className="checkpoint-feedback-icon">🎉</div>
                                    <div className="checkpoint-feedback-title">Great job!</div>
                                    <div className="checkpoint-explanation">
                                        Money has three functions: medium of exchange, store of value, and unit of account. While money can help provide security and options, happiness comes from many sources beyond money.
                                    </div>
                                </div>
                            )}
                            {checkpoint1Answered && (
                                <button className="btn-continue show" onClick={nextScreen}>Continue <span>→</span></button>
                            )}
                        </div>
                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <div className="nav-spacer"></div>
                        </div>
                    </div>
                )}

                {/* Screen 4: Simple Example */}
                {currentScreen === 4 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 4 of 8</div>
                        <div className="lesson-section">
                            <h2>Simple Example</h2>
                            <p>Imagine you're a talented artist who creates beautiful paintings. You want to buy groceries, pay rent, and get a haircut. Without money, you'd have to:</p>
                            <ul>
                                <li>Find a grocery store owner who wants a painting</li>
                                <li>Find a landlord who accepts art as rent payment</li>
                                <li>Find a hairstylist willing to trade a haircut for artwork</li>
                            </ul>
                            <p>This would be incredibly difficult and time-consuming! With money, you simply sell your paintings to anyone who wants them, receive cash, and use that cash to buy whatever you need from whoever is selling it. Money makes the exchange smooth and simple.</p>
                        </div>
                        <div className="visual-box">
                            <h3>How Money Flows in Your Life</h3>
                            <div className="money-flow">
                                <div className="flow-item">
                                    <strong>You Work</strong>
                                    <p style={{ fontSize: '14px', marginTop: '8px' }}>Provide value through labor or skills</p>
                                </div>
                                <div className="flow-arrow">→</div>
                                <div className="flow-item">
                                    <strong>You Earn Money</strong>
                                    <p style={{ fontSize: '14px', marginTop: '8px' }}>Receive payment for your work</p>
                                </div>
                                <div className="flow-arrow">→</div>
                                <div className="flow-item">
                                    <strong>You Spend Money</strong>
                                    <p style={{ fontSize: '14px', marginTop: '8px' }}>Exchange it for goods and services</p>
                                </div>
                            </div>
                            <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Money is the bridge between what you offer and what you need.
                            </p>
                        </div>
                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <button className="btn-nav" onClick={nextScreen}>Next <span>→</span></button>
                        </div>
                    </div>
                )}

                {/* Screen 5: Checkpoint Question 2 */}
                {currentScreen === 5 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 5 of 8</div>
                        <div className="checkpoint-container">
                            <div className="checkpoint-header">
                                <h3>Quick Check: Apply What You Learned</h3>
                                <p>Let's see how you can apply this concept to a real-world scenario!</p>
                            </div>
                            <div className="checkpoint-question">
                                <div className="checkpoint-question-text">
                                    Sarah wants to buy a $200 bike. Her friend offers to trade his old laptop for it. Why might Sarah prefer to get paid $200 in cash instead?
                                </div>
                                {[
                                    'Cash is easier to carry',
                                    'She can use cash to buy exactly what she wants at any store',
                                    'Laptops break easily',
                                    'Cash looks better'
                                ].map((option, idx) => (
                                    <div
                                        key={idx}
                                        className={`checkpoint-option ${checkpoint2Answered ? (idx === 1 ? 'correct' : '') : ''}`}
                                        onClick={checkCheckpoint2}
                                        style={{ pointerEvents: checkpoint2Answered ? 'none' : 'auto' }}
                                    >
                                        <input type="radio" name="checkpoint2" value={idx} />
                                        <span>{String.fromCharCode(65 + idx)}) {option}</span>
                                    </div>
                                ))}
                            </div>
                            {checkpoint2Answered && (
                                <div className="checkpoint-feedback show correct">
                                    <div className="checkpoint-feedback-icon">🎉</div>
                                    <div className="checkpoint-feedback-title">Excellent!</div>
                                    <div className="checkpoint-explanation">
                                        Perfect! This demonstrates money as a "medium of exchange." Instead of being stuck with items to trade (barter), money lets Sarah exchange her value for any goods or services she wants. She has the flexibility to buy exactly what she needs.
                                    </div>
                                </div>
                            )}
                            {checkpoint2Answered && (
                                <button className="btn-continue show" onClick={nextScreen}>Continue <span>→</span></button>
                            )}
                        </div>
                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <div className="nav-spacer"></div>
                        </div>
                    </div>
                )}

                {/* Screen 6: Common Mistakes */}
                {currentScreen === 6 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 6 of 8</div>
                        <div className="lesson-section">
                            <h2>Avoid These Mistakes</h2>
                            <div className="mistakes-grid">
                                {[
                                    { icon: '😔', title: 'Money = Happiness', desc: 'Money is a tool, not a life goal' },
                                    { icon: '😈', title: 'Money is Evil', desc: 'Money is neutral—it\'s how you use it' },
                                    { icon: '⏰', title: 'Money Buys Time', desc: 'Can\'t buy time, relationships, or health' },
                                    { icon: '💵', title: 'All Money is Equal', desc: 'Earned, borrowed, gifted—each has implications' }
                                ].map((mistake, idx) => (
                                    <div key={idx} className="mistake-card">
                                        <div className="mistake-icon">{mistake.icon}</div>
                                        <div className="mistake-title">{mistake.title}</div>
                                        <div className="mistake-desc">{mistake.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <button className="btn-nav" onClick={nextScreen}>Next <span>→</span></button>
                        </div>
                    </div>
                )}

                {/* Screen 7: Action Plan */}
                {currentScreen === 7 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 7 of 8</div>
                        <div className="lesson-section">
                            <div className="action-checklist">
                                <div className="checklist-title">🎯 Your Action Plan</div>
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '15px', fontSize: '14px' }}>
                                    Complete this 5-minute reflection:
                                </p>
                                {[
                                    'Look at a bill/coin and observe what it represents',
                                    'Think about what you trade for money (time, skills, creativity)',
                                    'Identify what money means to you personally',
                                    'Reflect on your relationship with money'
                                ].map((item, idx) => (
                                    <div key={idx} className="checklist-item" onClick={() => toggleChecklistItem(idx)}>
                                        <div className="checklist-checkbox"></div>
                                        <div className="checklist-text">{item}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="reflection-box">
                                <div className="reflection-icon">💭</div>
                                <div className="reflection-title">Quick Reflection</div>
                                <div className="reflection-text">
                                    What does money mean to you? Is it security? Freedom? Stress? Opportunity? Your relationship with money is shaped by your experiences—understanding this is the first step to taking control.
                                </div>
                            </div>
                        </div>
                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <button className="btn-nav" onClick={nextScreen}>Next <span>→</span></button>
                        </div>
                    </div>
                )}

                {/* Screen 8: Quiz */}
                {currentScreen === 8 && (
                    <div className="lesson-screen active">
                        <div className="screen-progress">Screen 8 of 8</div>

                        {!quizPassed && (
                            <div className="quiz-container">
                                <div className="quiz-header">
                                    <h2>Lesson Quiz</h2>
                                    <p>Answer these questions to unlock the next lesson. You need to answer all questions correctly to pass.</p>
                                </div>

                                <div>
                                    {currentQuestions.map((q, qIndex) => (
                                        <div key={qIndex} className="question-card">
                                            <div className="question-text">Question {qIndex + 1}: {q.question}</div>
                                            {q.options.map((option, oIndex) => (
                                                <div
                                                    key={oIndex}
                                                    className={`answer-option ${
                                                        userAnswers[qIndex] === oIndex ? 'selected' : ''
                                                    } ${
                                                        quizSubmitted
                                                            ? oIndex === q.correct
                                                                ? 'correct'
                                                                : userAnswers[qIndex] === oIndex
                                                                    ? 'incorrect'
                                                                    : ''
                                                            : ''
                                                    }`}
                                                    onClick={() => !quizSubmitted && selectAnswer(qIndex, oIndex)}
                                                    style={{ pointerEvents: quizSubmitted ? 'none' : 'auto' }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question${qIndex}`}
                                                        value={oIndex}
                                                        checked={userAnswers[qIndex] === oIndex}
                                                        readOnly
                                                        style={{ marginRight: '10px' }}
                                                    />
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {!quizSubmitted && (
                                    <button className="btn-submit-quiz" onClick={submitQuiz}>
                                        Submit Quiz
                                    </button>
                                )}

                                {quizResult && (
                                    <div className={`quiz-result ${quizPassed ? 'pass' : 'fail'}`}>
                                        <div className="result-icon">{quizPassed ? '🎉' : '📚'}</div>
                                        <div className="result-text" style={{ color: quizPassed ? '#10b981' : '#dc2626' }}>
                                            {quizPassed ? 'Quiz Passed!' : 'Not quite there yet'}
                                        </div>
                                        <div className="result-score">
                                            You scored {quizResult.correct} out of {currentQuestions.length} ({quizResult.percentage}%)
                                        </div>
                                        {quizPassed ? (
                                            <p style={{ color: 'var(--text-secondary)' }}>
                                                Great job! You can now finish the lesson and move to the next one.
                                            </p>
                                        ) : (
                                            <>
                                                <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                                    You need 100% to pass. Review the lesson and try again!
                                                </p>
                                                <button className="btn-retry" onClick={retryQuiz}>
                                                    Retry Quiz
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {quizPassed && (
                            <div className="finish-container">
                                <div className="quiz-passed-message">
                                    <div className="message-icon">✅</div>
                                    <h2>Lesson 1 Completed!</h2>
                                    <p>You have successfully passed the quiz. You are ready for the next lesson in Pillar 1.</p>
                                </div>
                                <button className="btn-finish-lesson" onClick={finishLesson}>
                                    Finish Lesson & Go to Pillar 1 Dashboard
                                </button>
                            </div>
                        )}

                        <div className="screen-navigation">
                            <button className="btn-nav btn-prev" onClick={previousScreen}><span>←</span> Previous</button>
                            <div className="nav-spacer"></div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
