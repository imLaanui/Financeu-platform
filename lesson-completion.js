// Shared lesson completion logic for all lessons
async function completeLesson(lessonId, pillarNum, lessonNum) {
    const userId = localStorage.getItem('userId');

    // Validate userId exists
    if (!userId || userId === 'null' || userId === 'undefined') {
        console.error('❌ No userId found');
        alert('Please log in to save your progress.');
        return false;
    }

    console.log(`🎯 Completing lesson: ${lessonId} for user: ${userId}`);

    try {
        // Get auth token
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('❌ No auth token found');
            alert('Please log in again to save your progress.');
            window.location.href = 'login.html';
            return false;
        }

        console.log(`📤 Sending lesson completion to backend API...`);
        console.log(`   Lesson ID: ${lessonId}`);
        console.log(`   API URL: ${API_URL}/lessons/complete`);

        // Call backend API to save lesson completion
        const response = await fetch(`${API_URL}/lessons/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                lessonId: lessonId
            })
        });

        console.log(`📥 Backend response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('❌ Backend error response:', errorData);
            throw new Error(errorData.error || `Server returned ${response.status}`);
        }

        const data = await response.json();

        // Also save to localStorage as a cache
        const storageKey = `path${pillarNum}_completed_${userId}`;
        const completed = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!completed.includes(lessonNum)) {
            completed.push(lessonNum);
            localStorage.setItem(storageKey, JSON.stringify(completed));
        }

        console.log('✅ Lesson completed successfully! Saved to backend & localStorage.');

        return true;

    } catch (error) {
        console.error('❌ Error saving lesson completion:', error);
        console.error('   Error details:', error.message);
        alert(`Error saving your progress: ${error.message}\n\nPlease check your connection and try again.`);
        return false;
    }
}

console.log('✅ Lesson completion helper loaded');
