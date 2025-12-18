// Lesson Progress Sync Utility
// This script syncs lesson progress from backend to localStorage on page load

async function syncLessonProgress() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // If no auth, clear any cached progress
    if (!userId || !token || userId === 'null' || userId === 'undefined') {
        console.log('📝 No auth found, clearing cached progress');
        clearAllLessonCache();
        return { synced: false, reason: 'not_authenticated' };
    }

    try {
        console.log('🔄 Syncing lesson progress from backend...');

        // Fetch progress from backend
        const response = await fetch(`${API_URL}/api/lessons/progress`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('❌ Failed to fetch progress from backend');
            return { synced: false, reason: 'fetch_error' };
        }

        const data = await response.json();
        const progress = data.progress || [];

        console.log(`✅ Fetched ${progress.length} progress records from backend`);

        // Clear existing localStorage lesson data
        clearAllLessonCache();

        // Parse progress and organize by pillar
        const pillarProgress = {
            1: { completed: [], quizzes: {} },
            2: { completed: [], quizzes: {} },
            3: { completed: [], quizzes: {} },
            4: { completed: [], quizzes: {} }
        };

        // Process each progress record
        progress.forEach(record => {
            if (!record.completed) return;

            const lessonId = record.lesson_id;

            // Parse lesson IDs like "pillar1_lesson1", "pillar2_lesson3", etc.
            const match = lessonId.match(/pillar(\d+)_lesson(\d+)/);
            if (match) {
                const pillarNum = parseInt(match[1]);
                const lessonNum = parseInt(match[2]);

                if (pillarProgress[pillarNum]) {
                    // Add to completed lessons array
                    if (!pillarProgress[pillarNum].completed.includes(lessonNum)) {
                        pillarProgress[pillarNum].completed.push(lessonNum);
                    }
                }
            }

            // Also check for quiz completions
            const quizMatch = lessonId.match(/pillar(\d+)_lesson(\d+)_quiz/);
            if (quizMatch) {
                const pillarNum = parseInt(quizMatch[1]);
                const lessonNum = parseInt(quizMatch[2]);

                if (pillarProgress[pillarNum]) {
                    pillarProgress[pillarNum].quizzes[lessonNum] = true;
                }
            }

            // Check for legacy lesson format (lesson1, lesson2 for pillar 1)
            const legacyMatch = lessonId.match(/^lesson(\d+)$/);
            if (legacyMatch) {
                const lessonNum = parseInt(legacyMatch[1]);
                if (!pillarProgress[1].completed.includes(lessonNum)) {
                    pillarProgress[1].completed.push(lessonNum);
                }
            }

            // Legacy quiz format
            const legacyQuizMatch = lessonId.match(/^lesson(\d+)_quiz$/);
            if (legacyQuizMatch) {
                const lessonNum = parseInt(legacyQuizMatch[1]);
                pillarProgress[1].quizzes[lessonNum] = true;
            }
        });

        // Write to localStorage
        for (let pillar = 1; pillar <= 4; pillar++) {
            // Save completed lessons array
            const completedKey = `pillar${pillar}_completed_${userId}`;
            localStorage.setItem(completedKey, JSON.stringify(pillarProgress[pillar].completed));
            console.log(`📝 Pillar ${pillar}: ${pillarProgress[pillar].completed.length} lessons completed`);

            // Save quiz status
            for (const [lessonNum, passed] of Object.entries(pillarProgress[pillar].quizzes)) {
                const quizKey = pillar === 1
                    ? `lesson${lessonNum}_quiz_passed_${userId}`
                    : `pillar${pillar}_lesson${lessonNum}_quiz_passed_${userId}`;
                localStorage.setItem(quizKey, 'true');
            }
        }

        console.log('✅ Successfully synced lesson progress to localStorage');
        return { synced: true, progress: pillarProgress };

    } catch (error) {
        console.error('❌ Error syncing lesson progress:', error);
        return { synced: false, reason: 'error', error: error.message };
    }
}

function clearAllLessonCache() {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'null' || userId === 'undefined') {
        return;
    }

    console.log('🗑️ Clearing all cached lesson progress...');

    // Clear completion arrays
    for (let pillar = 1; pillar <= 4; pillar++) {
        localStorage.removeItem(`pillar${pillar}_completed_${userId}`);

        // Clear quiz status
        for (let lesson = 1; lesson <= 8; lesson++) {
            const quizKey = pillar === 1
                ? `lesson${lesson}_quiz_passed_${userId}`
                : `pillar${pillar}_lesson${lesson}_quiz_passed_${userId}`;
            localStorage.removeItem(quizKey);
        }

        // Clear pillar quiz data
        localStorage.removeItem(`pillar${pillar}_quiz_completed_${userId}`);
        localStorage.removeItem(`pillar${pillar}_quiz_score_${userId}`);
    }
}

// Auto-sync on script load if this is included in a page
if (typeof window !== 'undefined') {
    console.log('✅ Lesson sync helper loaded');
}
