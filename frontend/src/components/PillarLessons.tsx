import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@css/utilities/lessons.css";

interface Lesson {
    id: number;
    title: string;
    description: string;
    url: string;
}

interface PillarLessonsProps {
    pillarNumber: number;
    pillarTitle: string;
    pillarDescription: string;
    lessons: Lesson[];
    quizConfig?: {
        questionCount: number;
        passingScore: number;
    };
}

const getInitialQuizState = (uid: string | null, pillarNum: number, lessons: Lesson[]) => {
    if (!uid || uid === 'null' || uid === 'undefined') {
        return { showQuiz: false, quizCompleted: false, quizScore: null };
    }

    const completed = JSON.parse(localStorage.getItem(`pillar${pillarNum}_completed_${uid}`) || '[]');
    const lessonCount = lessons.length;

    let allQuizzesPassed = true;
    for (let i = 1; i <= lessonCount; i++) {
        if (localStorage.getItem(`lesson${i}_quiz_passed_${uid}`) !== 'true') {
            allQuizzesPassed = false;
            break;
        }
    }

    const showQuiz = completed.length === lessonCount && allQuizzesPassed;

    if (showQuiz) {
        const quizComp = localStorage.getItem(`pillar${pillarNum}_quiz_completed_${uid}`) === 'true';
        const score = localStorage.getItem(`pillar${pillarNum}_quiz_score_${uid}`);

        return {
            showQuiz: true,
            quizCompleted: quizComp,
            quizScore: score
        };
    }

    return { showQuiz: false, quizCompleted: false, quizScore: null };
};

export default function PillarLessons({
    pillarNumber,
    pillarTitle,
    pillarDescription,
    lessons,
    quizConfig = { questionCount: 16, passingScore: 80 }
}: PillarLessonsProps) {
    const navigate = useNavigate();

    const [userId] = useState<string | null>(() => {
        return localStorage.getItem("userId");
    });

    const [completedLessons] = useState<number[]>(() => {
        const uid = localStorage.getItem("userId");
        if (!uid || uid === 'null' || uid === 'undefined') {
            return [];
        }
        return JSON.parse(localStorage.getItem(`pillar${pillarNumber}_completed_${uid}`) || '[]');
    });

    const [quizStatus] = useState(() => getInitialQuizState(userId, pillarNumber, lessons));

    const { showQuiz, quizCompleted, quizScore } = quizStatus;

    const isLessonLocked = (lessonId: number): boolean => {
        if (!userId || userId === 'null' || userId === 'undefined') {
            return lessonId > 1;
        }

        if (lessonId === 1) {
            return false;
        }

        const previousQuizPassed = localStorage.getItem(`lesson${lessonId - 1}_quiz_passed_${userId}`) === 'true';
        return !previousQuizPassed;
    };

    return (
        <>
            <Navbar />
            <div>
                <section className="pillar-header">
                    <h1>Pillar {pillarNumber}: {pillarTitle}</h1>
                    <p>{pillarDescription}</p>
                </section>

                <div className="lessons-container">
                    <a onClick={() => navigate("/dashboard")} className="back-link" style={{ cursor: 'pointer' }}>
                        ← Back to Dashboard
                    </a>

                    <div id="lessonsList">
                        {lessons.map((lesson) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isLocked = isLessonLocked(lesson.id);

                            return (
                                <div
                                    key={lesson.id}
                                    className={`lesson-card ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                                    data-lesson={lesson.id}
                                >
                                    <div className="lesson-content">
                                        <div className="lesson-info">
                                            <h3>{lesson.title}</h3>
                                            <p>{lesson.description}</p>
                                        </div>
                                        <div className="lesson-status">
                                            {isLocked ? (
                                                <span className="locked-text">🔒 Complete Previous Lesson</span>
                                            ) : isCompleted ? (
                                                <>
                                                    <span className="completed-badge">✓ Completed</span>
                                                    <a onClick={() => navigate(lesson.url)} className="btn-start-lesson" style={{ cursor: 'pointer' }}>
                                                        Review
                                                    </a>
                                                </>
                                            ) : (
                                                <a onClick={() => navigate(lesson.url)} className="btn-start-lesson" style={{ cursor: 'pointer' }}>
                                                    Start Lesson
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {showQuiz && (
                            <div className="quiz-card">
                                <div className="lesson-info">
                                    <h3>🎓 Final Quiz</h3>
                                    <p>Test your knowledge of all {lessons.length} lessons • {quizConfig.questionCount} questions • {quizConfig.passingScore}% to pass</p>
                                </div>
                                <div className="lesson-status">
                                    {quizCompleted ? (
                                        <>
                                            <span className="quiz-completed-badge">✓ Passed ({quizScore}%)</span>
                                            <a onClick={() => navigate(`/pillar${pillarNumber}/quiz`)} className="btn-start-quiz" style={{ cursor: 'pointer' }}>
                                                Retake Quiz
                                            </a>
                                        </>
                                    ) : (
                                        <a onClick={() => navigate(`/pillar${pillarNumber}/quiz`)} className="btn-start-quiz" style={{ cursor: 'pointer' }}>
                                            Take Quiz
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
