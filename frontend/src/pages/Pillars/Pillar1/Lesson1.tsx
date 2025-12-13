import { useEffect, useState, useMemo } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

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
    const [checkpoint1Answer, setCheckpoint1Answer] = useState<number | null>(null);
    const [checkpoint1Answered, setCheckpoint1Answered] = useState(false);
    const [checkpoint2Answer, setCheckpoint2Answer] = useState<number | null>(null);
    const [checkpoint2Answered, setCheckpoint2Answered] = useState(false);
    const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizResult, setQuizResult] = useState<{ correct: number; percentage: number } | null>(null);

    const totalScreens = 8;

    const quizData: QuizData[] = useMemo(() => [
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
    ], []);

    const initQuiz = () => {
        const selected = quizData.map(q => {
            const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
            return randomVersion;
        });
        setCurrentQuestions(selected);
        setUserAnswers(new Array(selected.length).fill(null));
    };

    useEffect(() => {
        const quizPassedStatus = localStorage.getItem('lesson1_quiz_passed');
        if (quizPassedStatus === 'true') {
            setQuizPassed(true);
            setQuizSubmitted(true);
        } else {
            const selected = quizData.map(q => {
                const randomVersion = q.versions[Math.floor(Math.random() * q.versions.length)];
                return randomVersion;
            });
            setCurrentQuestions(selected);
            setUserAnswers(new Array(selected.length).fill(null));
        }
    }, [quizData]);

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

    const checkCheckpoint1 = (selectedIndex: number) => {
        if (checkpoint1Answered) return;
        setCheckpoint1Answer(selectedIndex);
        setCheckpoint1Answered(true);
    };

    const checkCheckpoint2 = (selectedIndex: number) => {
        if (checkpoint2Answered) return;
        setCheckpoint2Answer(selectedIndex);
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
            localStorage.setItem('lesson1_quiz_passed', 'true');
        }
    };

    const retryQuiz = () => {
        setQuizSubmitted(false);
        setQuizResult(null);
        initQuiz();
    };

    const finishLesson = () => {
        if (!quizPassed) {
            alert('Please complete the quiz first!');
            return;
        }
        alert('Lesson completed! Redirecting to dashboard...');
    };

    const toggleChecklistItem = (index: number) => {
        const checkbox = document.querySelector(`#checklist-${index}`);
        checkbox?.parentElement?.classList.toggle('checked');
    };

    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <a href="#" style={{
                    display: 'inline-block',
                    marginBottom: '20px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '600'
                }}>← Back to Pillar 1 Lessons</a>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    padding: '30px',
                    background: 'linear-gradient(135deg, #0A1A2F 0%, #1a3a5c 100%)',
                    borderRadius: '16px',
                    color: 'white'
                }}>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '5px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>LESSON 1</div>
                    <h1 style={{ fontSize: '36px', margin: '0' }}>What is Money?</h1>
                </div>

                {/* Screen 1: Quick Intro */}
                {currentScreen === 1 && (
                    <div>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #0A1A2F15 0%, #00A67615 100%)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: '#3b82f6'
                        }}>Screen 1 of 8</div>

                        <div style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ color: '#3b82f6', fontSize: '24px', marginBottom: '15px' }}>What is Money?</h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                marginTop: '20px'
                            }}>
                                {[
                                    { icon: '🎯', title: 'The Problem', desc: 'Most people think money is just paper and coins' },
                                    { icon: '💡', title: 'Why It Matters', desc: 'Understanding money helps you make smarter financial decisions' },
                                    { icon: '✨', title: "What You'll Learn", desc: 'Why money has value and how it works in your life' }
                                ].map((card, i) => (
                                    <div key={i} style={{
                                        background: 'linear-gradient(135deg, #0A1A2F15 0%, #00A67615 100%)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>{card.icon}</div>
                                        <h3 style={{ color: '#3b82f6', fontSize: '18px', marginBottom: '8px' }}>{card.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>{card.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={nextScreen} style={{
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>Next →</button>
                        </div>
                    </div>
                )}

                {/* Screen 2: Core Concept */}
                {currentScreen === 2 && (
                    <div>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #0A1A2F15 0%, #00A67615 100%)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: '#3b82f6'
                        }}>Screen 2 of 8</div>

                        <div style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ color: '#3b82f6', fontSize: '24px', marginBottom: '15px' }}>Core Concept</h2>
                            <p style={{ lineHeight: '1.8', color: '#64748b' }}>
                                <strong>Money is a medium of exchange, a store of value, and a unit of account.</strong>
                            </p>
                            <p style={{ lineHeight: '1.8', color: '#64748b' }}>Let's break that down:</p>
                            <ul style={{ lineHeight: '1.8', color: '#64748b' }}>
                                <li><strong>Medium of Exchange:</strong> Money allows you to trade your work or goods for other things you need without having to barter directly.</li>
                                <li><strong>Store of Value:</strong> Money holds its worth over time, allowing you to save today and spend tomorrow.</li>
                                <li><strong>Unit of Account:</strong> Money provides a common way to measure value.</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={previousScreen} style={{
                                padding: '12px 24px',
                                background: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>← Previous</button>
                            <button onClick={nextScreen} style={{
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>Next →</button>
                        </div>
                    </div>
                )}

                {/* Screen 3: Checkpoint 1 */}
                {currentScreen === 3 && (
                    <div>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #0A1A2F15 0%, #00A67615 100%)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: '#3b82f6'
                        }}>Screen 3 of 8</div>

                        <div style={{
                            background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                            border: '2px solid #7DD3FC',
                            borderRadius: '12px',
                            padding: '30px'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#0284C7', fontSize: '24px', marginBottom: '8px' }}>Quick Check</h3>
                                <p style={{ color: '#64748b' }}>Let's pause and check your understanding.</p>
                            </div>

                            <div style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '15px'
                                }}>Which of these is NOT one of the three main functions of money?</div>

                                {['Medium of exchange', 'Store of value', 'Unit of account', 'Source of happiness'].map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => checkCheckpoint1(idx)}
                                        style={{
                                            background: checkpoint1Answered
                                                ? idx === 3
                                                    ? '#d1fae5'
                                                    : checkpoint1Answer === idx
                                                        ? '#fee2e2'
                                                        : '#f9fafb'
                                                : '#f9fafb',
                                            padding: '15px',
                                            border: checkpoint1Answered
                                                ? idx === 3
                                                    ? '2px solid #10b981'
                                                    : checkpoint1Answer === idx
                                                        ? '2px solid #dc2626'
                                                        : '2px solid #e5e7eb'
                                                : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            marginBottom: '10px',
                                            cursor: checkpoint1Answered ? 'default' : 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {String.fromCharCode(65 + idx)}) {option}
                                    </div>
                                ))}
                            </div>

                            {checkpoint1Answered && (
                                <div style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    borderLeft: checkpoint1Answer === 3 ? '4px solid #10b981' : '4px solid #f59e0b'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                                        {checkpoint1Answer === 3 ? '🎉' : '💭'}
                                    </div>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        marginBottom: '10px',
                                        color: checkpoint1Answer === 3 ? '#10b981' : '#f59e0b'
                                    }}>
                                        {checkpoint1Answer === 3 ? 'Great job!' : 'Not quite!'}
                                    </div>
                                    <div style={{ color: '#64748b', lineHeight: '1.6' }}>
                                        {checkpoint1Answer === 3
                                            ? 'Money has three functions: medium of exchange, store of value, and unit of account. While money can help provide security and options, happiness comes from many sources beyond money.'
                                            : 'The correct answer is "Source of happiness". Money has three functions: medium of exchange, store of value, and unit of account. While money can help provide security and options, happiness comes from many sources beyond money.'}
                                    </div>
                                </div>
                            )}

                            {checkpoint1Answered && (
                                <button onClick={nextScreen} style={{
                                    display: 'block',
                                    width: '100%',
                                    maxWidth: '300px',
                                    margin: '20px auto 0',
                                    padding: '15px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>Continue →</button>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                            <button onClick={previousScreen} style={{
                                padding: '12px 24px',
                                background: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>← Previous</button>
                        </div>
                    </div>
                )}

                {/* Screen 4: Simple Example */}
                {currentScreen === 4 && (
                    <div>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #0A1A2F15 0%, #00A67615 100%)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: '#3b82f6'
                        }}>Screen 4 of 8</div>

                        <div style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h2 style={{ color: '#3b82f6', fontSize: '24px', marginBottom: '15px' }}>Simple Example</h2>
                            <p style={{ lineHeight: '1.8', color: '#64748b' }}>
                                Imagine you're a talented artist who creates beautiful paintings. Without money, you'd have to find specific people who want your art AND have what you need. With money, you simply sell your paintings and use that cash to buy whatever you need from whoever is selling it.
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={previousScreen} style={{
                                padding: '12px 24px',
                                background: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>← Previous</button>
                            <button onClick={nextScreen} style={{
                                padding: '12px 24px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>Next →</button>
                        </div>
                    </div>
                )}

                {/* Screen 5: Checkpoint 2 */}
                {currentScreen === 5 && (
                    <div>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #0A1A2F15 0%, #00A67615 100%)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: '#3b82f6'
                        }}>Screen 5 of 8</div>

                        <div style={{
                            background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                            border: '2px solid #7DD3FC',
                            borderRadius: '12px',
                            padding: '30px'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#0284C7', fontSize: '24px', marginBottom: '8px' }}>Quick Check: Apply What You Learned</h3>
                                <p style={{ color: '#64748b' }}>Let's see how you can apply this concept!</p>
                            </div>

                            <div style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '15px'
                                }}>Sarah wants to buy a $200 bike. Her friend offers to trade his old laptop for it. Why might Sarah prefer to get paid $200 in cash instead?</div>

                                {[
                                    'Cash is easier to carry',
                                    'She can use cash to buy exactly what she wants at any store',
                                    'Laptops break easily',
                                    'Cash looks better'
                                ].map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => checkCheckpoint2(idx)}
                                        style={{
                                            background: checkpoint2Answered
                                                ? idx === 1
                                                    ? '#d1fae5'
                                                    : checkpoint2Answer === idx
                                                        ? '#fee2e2'
                                                        : '#f9fafb'
                                                : '#f9fafb',
                                            padding: '15px',
                                            border: checkpoint2Answered
                                                ? idx === 1
                                                    ? '2px solid #10b981'
                                                    : checkpoint2Answer === idx
                                                        ? '2px solid #dc2626'
                                                        : '2px solid #e5e7eb'
                                                : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            marginBottom: '10px',
                                            cursor: checkpoint2Answered ? 'default' : 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {String.fromCharCode(65 + idx)}) {option}
                                    </div>
                                ))}
                            </div>

                            {checkpoint2Answered && (
                                <div style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    borderLeft: checkpoint2Answer === 1 ? '4px solid #10b981' : '4px solid #f59e0b'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                                        {checkpoint2Answer === 1 ? '🎉' : '💭'}
                                    </div>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        marginBottom: '10px',
                                        color: checkpoint2Answer === 1 ? '#10b981' : '#f59e0b'
                                    }}>
                                        {checkpoint2Answer === 1 ? 'Excellent!' : 'Not quite!'}
                                    </div>
                                    <div style={{ color: '#64748b', lineHeight: '1.6' }}>
                                        {checkpoint2Answer === 1
                                            ? 'Perfect! This demonstrates money as a "medium of exchange." Instead of being stuck with items to trade, money lets Sarah exchange her value for any goods or services she wants.'
                                            : 'The correct answer is "She can use cash to buy exactly what she wants at any store". This demonstrates money as a "medium of exchange" - it gives Sarah flexibility to buy exactly what she needs instead of being stuck with a specific item through barter.'}
                                    </div>
                                </div>
                            )}

                            {checkpoint2Answered && (
                                <button onClick={nextScreen} style={{
                                    display: 'block',
                                    width: '100%',
                                    maxWidth: '300px',
                                    margin: '20px auto 0',
                                    padding: '15px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>Continue →</button>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                            <button onClick={previousScreen} style={{
                                padding: '12px 24px',
                                background: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>← Previous</button>
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
                                                    className={`answer-option ${userAnswers[qIndex] === oIndex ? 'selected' : ''
                                                        } ${quizSubmitted
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
