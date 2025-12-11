import { API_URL } from '../config/api';

export async function completeLesson(
    lessonId: string,
    pillarNum: number,
    lessonNum: number
): Promise<boolean> {
    const userId = localStorage.getItem('userId');

    if (!userId || userId === 'null' || userId === 'undefined') {
        console.error('❌ No userId found');
        alert('Please log in to save your progress.');
        return false;
    }

    console.log(`🎯 Completing lesson: ${lessonId} for user: ${userId}`);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('❌ No auth token found');
            alert('Please log in again to save your progress.');
            window.location.href = '/login';
            return false;
        }

        console.log(`📤 Sending lesson completion to backend API...`);
        const response = await fetch(`${API_URL}/lessons/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ lessonId }),
        });

        console.log(`📥 Backend response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('❌ Backend error response:', errorData);
            throw new Error((errorData as { error?: string }).error || `Server returned ${response.status}`);
        }

        // Save locally as cache
        const storageKey = `pillar${pillarNum}_completed_${userId}`;
        const completed: number[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!completed.includes(lessonNum)) {
            completed.push(lessonNum);
            localStorage.setItem(storageKey, JSON.stringify(completed));
        }

        console.log('✅ Lesson completed successfully! Saved to backend & localStorage.');
        alert('Congratulations! Lesson completed successfully! 🎉');

        return true;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('❌ Error saving lesson completion:', error);
            alert(`Error saving your progress: ${error.message}\n\nPlease check your connection and try again.`);
        } else {
            console.error('❌ Unknown error:', error);
            alert('Unknown error saving your progress. Please try again.');
        }
        return false;
    }
}

console.log('✅ Lesson completion helper loaded');
